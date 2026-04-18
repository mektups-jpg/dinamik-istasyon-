import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function CylinderSimulation() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1); // 1 = closed cylinder, 0 = flat plane
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any existing canvas elements first (prevents the "stuck image" issue)
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // Dimensions
    let containerWidth = mountRef.current.clientWidth;
    let containerHeight = mountRef.current.clientHeight;

    // Fallback if dimensions are 0
    if (containerWidth === 0) containerWidth = 800;
    if (containerHeight === 0) containerHeight = 600;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0B0C10');
    scene.fog = new THREE.Fog('#0B0C10', 15, 40);

    const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 100);
    camera.position.set(8, 6, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Ensure the canvas takes up the full container
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '10';
    
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00E5FF, 2, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Floor for shadows
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x111111, 
      roughness: 0.8, 
      metalness: 0.2 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(40, 40, 0x333333, 0x1a1a1a);
    gridHelper.position.y = -3.99;
    scene.add(gridHelper);

    // Cylinder parameters
    const radius = 2;
    const height = 5;
    const width = 2 * Math.PI * radius; // Circumference
    const segmentsX = 128; // High res for smooth bending
    const segmentsY = 1;

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 1. Create Side Surface (Plane that bends)
    const sideGeometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const originalVertices = new Float32Array(sideGeometry.attributes.position.array);
    
    // Premium Glass-like Material
    const sideMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0x00E5FF, 
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
    });

    const sideMesh = new THREE.Mesh(sideGeometry, sideMaterial);
    sideMesh.castShadow = true;
    sideMesh.receiveShadow = true;
    sceneGroup.add(sideMesh);

    // Side Outline (Dynamic)
    const sideOutlineGeo = new THREE.BufferGeometry();
    const outlinePoints = 128;
    const outlinePositions = new Float32Array((outlinePoints * 2) * 3);
    sideOutlineGeo.setAttribute('position', new THREE.BufferAttribute(outlinePositions, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      linewidth: 2, 
      transparent: true, 
      opacity: 0.9 
    });
    const sideOutline = new THREE.LineLoop(sideOutlineGeo, edgeMaterial);
    sceneGroup.add(sideOutline);

    // 2. Create Top and Bottom Caps (Circles) with Hinges
    const capGeometry = new THREE.CircleGeometry(radius, 64);
    const capMaterial = new THREE.MeshPhysicalMaterial({ 
      color: 0xFF6B00, 
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
    });
    const capEdgesGeo = new THREE.EdgesGeometry(capGeometry);

    // Top Hinge & Cap
    const topHinge = new THREE.Group();
    topHinge.position.set(0, height / 2, 0);
    
    const topCap = new THREE.Mesh(capGeometry, capMaterial);
    topCap.position.set(0, radius, 0);
    topCap.castShadow = true;
    topCap.receiveShadow = true;
    
    const topCapEdges = new THREE.LineSegments(capEdgesGeo, edgeMaterial);
    topCap.add(topCapEdges);
    topHinge.add(topCap);
    sceneGroup.add(topHinge);

    // Bottom Hinge & Cap
    const bottomHinge = new THREE.Group();
    bottomHinge.position.set(0, -height / 2, 0);
    
    const bottomCap = new THREE.Mesh(capGeometry, capMaterial);
    bottomCap.position.set(0, -radius, 0);
    bottomCap.castShadow = true;
    bottomCap.receiveShadow = true;
    
    const bottomCapEdges = new THREE.LineSegments(capEdgesGeo, edgeMaterial);
    bottomCap.add(bottomCapEdges);
    bottomHinge.add(bottomCap);
    sceneGroup.add(bottomHinge);

    // Adjust camera target to center of the 3D object
    controls.target.set(0, 0, -radius / 2);

    // Store refs
    sceneRef.current = {
      scene, camera, renderer, controls,
      sideGeometry, sideOutlineGeo, topHinge, bottomHinge,
      originalVertices, width, radius, height
    };

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      
      // Subtle floating animation
      const time = Date.now() * 0.001;
      sceneGroup.position.y = Math.sin(time) * 0.1;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Initial update
    updateGeometry(1);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Proper cleanup of the DOM element
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      sideGeometry.dispose();
      sideOutlineGeo.dispose();
      capGeometry.dispose();
      capEdgesGeo.dispose();
      sideMaterial.dispose();
      capMaterial.dispose();
      edgeMaterial.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Helper to calculate bent position
  const getBentPosition = (origX: number, origY: number, p: number, w: number) => {
    if (p < 0.0001) return { x: origX, y: origY, z: 0 };
    const currentAngleTotal = 2 * Math.PI * p;
    const currentRadius = w / currentAngleTotal;
    const theta = (origX / w) * currentAngleTotal;
    return {
      x: currentRadius * Math.sin(theta),
      y: origY,
      z: currentRadius * Math.cos(theta) - currentRadius
    };
  };

  // Update geometry based on progress slider
  const updateGeometry = (p: number) => {
    if (!sceneRef.current) return;
    const { sideGeometry, sideOutlineGeo, topHinge, bottomHinge, originalVertices, width, height } = sceneRef.current;
    
    // --- 1. Deform Side Surface ---
    const positions = sideGeometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const origX = originalVertices[i];
      const origY = originalVertices[i + 1];
      const { x, y, z } = getBentPosition(origX, origY, p, width);
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
    }
    sideGeometry.attributes.position.needsUpdate = true;
    sideGeometry.computeVertexNormals();

    // --- 2. Deform Side Outline ---
    const outPos = sideOutlineGeo.attributes.position.array as Float32Array;
    let idx = 0;
    const outlinePoints = 128;
    
    // Top edge (left to right)
    for (let i = 0; i < outlinePoints; i++) {
      const t = i / (outlinePoints - 1);
      const origX = -width / 2 + t * width;
      const { x, y, z } = getBentPosition(origX, height / 2, p, width);
      outPos[idx++] = x; outPos[idx++] = y; outPos[idx++] = z;
    }
    
    // Bottom edge (right to left)
    for (let i = 0; i < outlinePoints; i++) {
      const t = i / (outlinePoints - 1);
      const origX = width / 2 - t * width;
      const { x, y, z } = getBentPosition(origX, -height / 2, p, width);
      outPos[idx++] = x; outPos[idx++] = y; outPos[idx++] = z;
    }
    sideOutlineGeo.attributes.position.needsUpdate = true;

    // --- 3. Animate Hinges (Caps) ---
    topHinge.rotation.x = -(Math.PI / 2) * p;
    bottomHinge.rotation.x = (Math.PI / 2) * p;
  };

  // Sync slider with 3D update
  useEffect(() => {
    updateGeometry(progress);
  }, [progress]);

  return (
    <div className="w-full h-full flex flex-col relative bg-[#0B0C10]">
      {/* The container for the Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0 z-10" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 w-[85%] max-w-md flex flex-col items-center gap-4 shadow-[0_8px_32px_rgba(0,229,255,0.15)] z-50 pointer-events-auto">
        <label className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
          Silindiri Aç / Kapat
        </label>
        <div className="w-full relative flex items-center">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer accent-[#00E5FF] relative z-10"
          />
        </div>
        <div className="flex justify-between w-full text-xs font-bold text-gray-500 px-1 uppercase tracking-wider">
          <span className={`transition-colors duration-300 ${progress < 0.1 ? "text-[#FF6B00]" : ""}`}>Açık (Dikdörtgen)</span>
          <span className={`transition-colors duration-300 ${progress > 0.9 ? "text-[#00E5FF]" : ""}`}>Kapalı (Silindir)</span>
        </div>
        
        <div className={`mt-2 text-center text-sm font-medium transition-all duration-500 ${progress < 0.2 ? 'opacity-100 text-[#00E5FF]' : 'opacity-40 text-gray-400'}`}>
          Silindir açıldığında yan yüzeyi bir <strong>dikdörtgene</strong> dönüşür ve bu dikdörtgenin genişliği silindirin <strong>çevresine (2πr)</strong> eşittir.
        </div>
      </div>
    </div>
  );
}
