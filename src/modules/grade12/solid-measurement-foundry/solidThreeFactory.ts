import * as THREE from 'three';
import { MeasurementMode, SolidKind, solidCopy } from './solidMeasurementModel';

interface BuildOptions {
  solid: SolidKind | null;
  mode: MeasurementMode | null;
  solved: boolean;
  error: boolean;
}

const GLASS_COLOR = 0x8eeaff;
const FILL_COLOR = 0x00e5ff;
const SHELL_COLOR = 0xa3e635;
const ERROR_COLOR = 0xff4fa3;

export function buildSolidGroup(options: BuildOptions) {
  if (options.solid === null) return createIdleFoundryGroup();

  const group = new THREE.Group();
  const solid = options.solid;
  const mode = options.mode;
  const hasMode = mode !== null;
  const accent = new THREE.Color(options.error ? ERROR_COLOR : solidCopy[solid].accent);
  const shellColor = new THREE.Color(options.error ? ERROR_COLOR : mode === 'surface' ? SHELL_COLOR : FILL_COLOR);

  const outerMaterial = new THREE.MeshPhysicalMaterial({
    color: accent,
    roughness: 0.18,
    metalness: 0.12,
    transparent: true,
    opacity: options.solid ? 0.28 : 0.14,
    clearcoat: 1,
    side: THREE.DoubleSide,
  });
  const fillMaterial = new THREE.MeshPhysicalMaterial({
    color: shellColor,
    roughness: 0.1,
    metalness: 0.05,
    transparent: true,
    opacity: options.solid && options.mode ? options.solved ? 0.58 : 0.36 : 0.16,
    clearcoat: 1,
    side: THREE.DoubleSide,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: options.error ? ERROR_COLOR : 0xffffff,
    transparent: true,
    opacity: options.error ? 0.86 : 0.72,
  });

  const outer = createSolidMesh(solid, outerMaterial);
  outer.castShadow = true;
  outer.receiveShadow = true;
  group.add(outer);

  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(outer.geometry), edgeMaterial);
  outline.scale.copy(outer.scale);
  outline.rotation.copy(outer.rotation);
  outline.position.copy(outer.position);
  group.add(outline);

  const fill = createSolidMesh(solid, fillMaterial);
  if (hasMode) {
    fill.scale.multiplyScalar(mode === 'surface' ? 1.08 : options.solved ? 0.88 : 0.66);
    fill.position.y += mode === 'volume' ? -0.18 : 0;
    group.add(fill);
    group.add(mode === 'surface' ? createSurfaceBands(solid, shellColor) : createVolumeCore(solid, shellColor, options.solved));
  }

  group.add(createBaseHalo(options.error ? ERROR_COLOR : Number.parseInt(solidCopy[solid].accent.slice(1), 16)));
  return group;
}

function createIdleFoundryGroup() {
  const group = new THREE.Group();
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00e5ff,
    roughness: 0.16,
    metalness: 0.12,
    transparent: true,
    opacity: 0.22,
    wireframe: true,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), coreMaterial);
  group.add(core);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.36 });
  for (let index = 0; index < 3; index += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.65 + index * 0.28, 0.014, 10, 96), ringMaterial.clone());
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.36 + index * 0.36;
    group.add(ring);
  }

  const base = createBaseHalo(FILL_COLOR);
  group.add(base);
  return group;
}

export function disposeObject3D(object: THREE.Object3D) {
  object.traverse((child) => {
    const maybeMesh = child as THREE.Object3D & {
      geometry?: THREE.BufferGeometry;
      material?: THREE.Material | THREE.Material[];
    };
    maybeMesh.geometry?.dispose();
    if (Array.isArray(maybeMesh.material)) {
      maybeMesh.material.forEach((material) => material.dispose());
    } else {
      maybeMesh.material?.dispose();
    }
  });
}

function createSolidMesh(solid: SolidKind, material: THREE.Material) {
  if (solid === 'cylinder') return new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 3.05, 72), material);
  if (solid === 'pyramid') {
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(1.95, 3.15, 4), material);
    mesh.rotation.y = Math.PI / 4;
    return mesh;
  }
  if (solid === 'cone') return new THREE.Mesh(new THREE.ConeGeometry(1.65, 3.25, 72), material);
  if (solid === 'sphere') return new THREE.Mesh(new THREE.SphereGeometry(1.65, 72, 36), material);
  return new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.28, 2.42), material);
}

function createVolumeCore(solid: SolidKind, color: THREE.Color, solved: boolean) {
  const group = new THREE.Group();
  const level = solved ? 1 : 0.62;
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.34, side: THREE.DoubleSide });

  for (let index = 0; index < 5; index += 1) {
    const y = -1.25 + index * 0.56;
    const ring = solid === 'sphere'
      ? new THREE.Mesh(new THREE.TorusGeometry(0.58 + index * 0.19, 0.012, 10, 80), material.clone())
      : new THREE.Mesh(new THREE.TorusGeometry(solid === 'prism' || solid === 'pyramid' ? 1.25 : 1.15, 0.012, 10, 80), material.clone());
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y * level;
    ring.scale.x = solid === 'prism' || solid === 'pyramid' ? 1.38 : 1;
    ring.scale.z = solid === 'prism' || solid === 'pyramid' ? 0.74 : 1;
    group.add(ring);
  }

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 3.8, 16),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 }),
  );
  beam.position.x = solid === 'prism' ? -2.25 : -2.05;
  group.add(beam);
  return group;
}

function createSurfaceBands(solid: SolidKind, color: THREE.Color) {
  const group = new THREE.Group();
  const bandMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.68 });

  if (solid === 'prism') {
    const sizes = [
      [3.55, 0.04, 2.55, 0, 1.22, 0],
      [3.55, 0.04, 2.55, 0, -1.22, 0],
      [0.04, 2.35, 2.55, 1.75, 0, 0],
      [0.04, 2.35, 2.55, -1.75, 0, 0],
    ];
    sizes.forEach(([x, y, z, px, py, pz]) => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(x, y, z), bandMaterial.clone());
      panel.position.set(px, py, pz);
      group.add(panel);
    });
    return group;
  }

  const ringCount = solid === 'sphere' ? 4 : 3;
  for (let index = 0; index < ringCount; index += 1) {
    const radius = solid === 'sphere' ? 1.66 * Math.cos((index - 1.5) * 0.35) : 1.55 - index * 0.08;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(Math.abs(radius), 0.018, 12, 96), bandMaterial.clone());
    ring.rotation.x = Math.PI / 2;
    ring.position.y = solid === 'sphere' ? (index - 1.5) * 0.58 : -1.08 + index * 1.08;
    group.add(ring);
  }

  const vertical = new THREE.Mesh(new THREE.TorusGeometry(1.64, 0.015, 12, 96), bandMaterial.clone());
  vertical.rotation.y = Math.PI / 2;
  group.add(vertical);
  return group;
}

function createBaseHalo(color: number) {
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
  const halo = new THREE.Mesh(new THREE.RingGeometry(2.25, 2.42, 96), material);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -1.92;
  return halo;
}
