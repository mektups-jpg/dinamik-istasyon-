import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Grade12StageStatus } from '../shared/Grade12FullStageLab';
import {
  MeasurementMode,
  modeCopy,
  SolidKind,
  SolidMission,
  solidCopy,
} from './solidMeasurementModel';
import { buildSolidGroup, disposeObject3D } from './solidThreeFactory';

interface SolidMeasurementSceneProps {
  mission: SolidMission;
  solid: SolidKind | null;
  mode: MeasurementMode | null;
  solved: boolean;
  status: Grade12StageStatus;
  onHome: () => void;
}

interface ThreeRefs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  modelGroup: THREE.Group;
  frameId: number;
}

export function SolidMeasurementScene({
  mission,
  solid,
  mode,
  solved,
  status,
  onHome,
}: SolidMeasurementSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<ThreeRefs | null>(null);
  const activeSolid = solid ?? 'prism';
  const activeMode = mode ?? 'volume';
  const activeCopy = solidCopy[activeSolid];
  const modeData = modeCopy[activeMode];
  const isError = status === 'error';
  const proofChip = solved ? mission.formula : solid && mode ? 'kanıtı test et' : 'seçim bekliyor';

  const helperText = useMemo(() => {
    if (solid === null) return 'Nötr dökümhane çekirdeği bekliyor; önce hangi cismin ölçüleceğini seç.';
    if (mode === null) return `${activeCopy.label} sahneye alındı; şimdi iç hacim mi dış kaplama mı ölçülecek?`;
    if (solved) return mission.mechanism;
    return activeMode === 'volume'
      ? `${activeCopy.label} içinde ${modeData.short} önizleniyor.`
      : `${activeCopy.label} dışına ${modeData.short} önizleniyor.`;
  }, [activeCopy.label, activeMode, mode, modeData.short, mission.mechanism, solid, solved]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020611');
    scene.fog = new THREE.FogExp2('#020611', 0.024);

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 620;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(6.6, 4.4, 7.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.width = '100%';
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5.4;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.38));
    const key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(7, 9, 7);
    key.castShadow = true;
    scene.add(key);
    const cyan = new THREE.PointLight(0x00e5ff, 2.8, 18);
    cyan.position.set(-3, 2.2, 4);
    scene.add(cyan);
    const green = new THREE.PointLight(0xa3e635, 2.2, 18);
    green.position.set(3, -0.8, -2.4);
    scene.add(green);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.MeshStandardMaterial({ color: 0x07101c, roughness: 0.88, metalness: 0.12 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(18, 18, 0x00e5ff, 0x15273a);
    grid.position.y = -1.99;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.18;
    scene.add(grid);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const render = () => {
      const refs = threeRef.current;
      if (!refs) return;
      refs.frameId = requestAnimationFrame(render);
      modelGroup.rotation.y += 0.0035;
      modelGroup.position.y = Math.sin(Date.now() * 0.0012) * 0.06;
      controls.update();
      renderer.render(scene, camera);
    };

    const resize = () => {
      const nextWidth = mount.clientWidth || 900;
      const nextHeight = mount.clientHeight || 620;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    threeRef.current = { scene, camera, renderer, controls, modelGroup, frameId: 0 };
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      const refs = threeRef.current;
      if (refs) {
        cancelAnimationFrame(refs.frameId);
        disposeObject3D(refs.modelGroup);
        refs.renderer.dispose();
        refs.controls.dispose();
      }
      floor.geometry.dispose();
      if (Array.isArray(floor.material)) floor.material.forEach((material) => material.dispose());
      else floor.material.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      threeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const refs = threeRef.current;
    if (!refs) return;
    disposeObject3D(refs.modelGroup);
    refs.modelGroup.clear();
    const group = buildSolidGroup({ solid, mode, solved, error: isError });
    refs.modelGroup.add(group);
  }, [isError, mode, solid, solved]);

  return (
    <div
      data-testid="solid-measurement-foundry-manipulator"
      tabIndex={0}
      aria-label="Katı cisim 3D ölçüm sahnesi"
      aria-keyshortcuts="Home"
      onKeyDown={(event) => {
        if (event.key === 'Home') onHome();
      }}
      className="relative h-full w-full overflow-hidden outline-none"
    >
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_50%_82%,rgba(0,229,255,0.12),transparent_34%)]" />

      <div className="pointer-events-none absolute left-5 top-5 flex max-w-[520px] flex-wrap gap-2">
        <InfoChip label="görev" value={mission.title} tone="cyan" />
        <InfoChip label="aktif cisim" value={solid ? activeCopy.label : 'seçim bekliyor'} tone={isError ? 'pink' : 'white'} />
        <InfoChip label="mod" value={mode ? modeData.label : 'hacim / alan?'} tone={activeMode === 'volume' ? 'cyan' : 'green'} />
      </div>

      <motion.div
        key={`${mission.id}-${solid ?? 'empty'}-${mode ?? 'empty'}-${status}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-none absolute bottom-5 left-1/2 w-[min(760px,calc(100%-40px))] -translate-x-1/2 rounded-[26px] border border-white/12 bg-black/44 px-5 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/45">3D ölçüm kanıtı</p>
            <p className="mt-1 text-base font-black text-white">{helperText}</p>
          </div>
          <div className={`rounded-2xl border px-4 py-2 font-mono text-sm font-black ${solved ? 'border-[#00FF88]/35 bg-[#00FF88]/12 text-emerald-100' : 'border-white/12 bg-white/[0.06] text-white/70'}`}>
            {proofChip}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoChip({ label, value, tone }: { label: string; value: string; tone: 'cyan' | 'green' | 'pink' | 'white' }) {
  const toneClass = {
    cyan: 'border-[#00E5FF]/24 bg-[#00E5FF]/10 text-cyan-100',
    green: 'border-[#A3E635]/24 bg-[#A3E635]/10 text-lime-100',
    pink: 'border-[#FF4FA3]/28 bg-[#FF4FA3]/10 text-pink-100',
    white: 'border-white/12 bg-white/[0.06] text-white/84',
  }[tone];

  return (
    <span className={`rounded-2xl border px-3 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl ${toneClass}`}>
      <span className="mr-2 font-mono text-[9px] font-black uppercase tracking-[0.18em] opacity-60">{label}</span>
      <span className="text-sm font-black">{value}</span>
    </span>
  );
}
