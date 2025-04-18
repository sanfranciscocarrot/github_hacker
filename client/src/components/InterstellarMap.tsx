import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface CelestialBody {
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  type: 'planet' | 'star' | 'system';
  orbitRadius: number;
  orbitalPeriod: number;
}

// Scale down distances for visualization (1 AU = 1 unit in our visualization)
const SCALE_FACTOR = 0.5;
const ORBIT_SCALE = 2;

const celestialBodies: CelestialBody[] = [
  // Solar System
  { 
    name: 'Sun',
    position: [0, 0, 0],
    radius: 0.5,
    color: '#ffff00',
    type: 'star',
    orbitRadius: 0,
    orbitalPeriod: 0,
  },
  { 
    name: 'Mercury',
    position: [0.387 * ORBIT_SCALE, 0, 0],
    radius: 0.08,
    color: '#A0522D',
    type: 'planet',
    orbitRadius: 0.387 * ORBIT_SCALE,
    orbitalPeriod: 0.24,
  },
  { 
    name: 'Venus',
    position: [0.723 * ORBIT_SCALE, 0, 0],
    radius: 0.18,
    color: '#DEB887',
    type: 'planet',
    orbitRadius: 0.723 * ORBIT_SCALE,
    orbitalPeriod: 0.62,
  },
  { 
    name: 'Earth',
    position: [1 * ORBIT_SCALE, 0, 0],
    radius: 0.19,
    color: '#1a75ff',
    type: 'planet',
    orbitRadius: 1 * ORBIT_SCALE,
    orbitalPeriod: 1,
  },
  { 
    name: 'Mars',
    position: [1.524 * ORBIT_SCALE, 0, 0],
    radius: 0.1,
    color: '#ff4d4d',
    type: 'planet',
    orbitRadius: 1.524 * ORBIT_SCALE,
    orbitalPeriod: 1.88,
  },
  { 
    name: 'Jupiter',
    position: [5.203 * ORBIT_SCALE, 0, 0],
    radius: 0.4,
    color: '#ffcc00',
    type: 'planet',
    orbitRadius: 5.203 * ORBIT_SCALE,
    orbitalPeriod: 11.86,
  },
  { 
    name: 'Saturn',
    position: [9.537 * ORBIT_SCALE, 0, 0],
    radius: 0.35,
    color: '#F4D03F',
    type: 'planet',
    orbitRadius: 9.537 * ORBIT_SCALE,
    orbitalPeriod: 29.46,
  },
  { 
    name: 'Uranus',
    position: [19.191 * ORBIT_SCALE, 0, 0],
    radius: 0.25,
    color: '#85C1E9',
    type: 'planet',
    orbitRadius: 19.191 * ORBIT_SCALE,
    orbitalPeriod: 84.01,
  },
  { 
    name: 'Neptune',
    position: [30.069 * ORBIT_SCALE, 0, 0],
    radius: 0.24,
    color: '#3498DB',
    type: 'planet',
    orbitRadius: 30.069 * ORBIT_SCALE,
    orbitalPeriod: 164.79,
  },
  // Nearby visible stars (scaled down significantly for visualization)
  {
    name: 'Proxima Centauri',
    position: [35 * ORBIT_SCALE, 0, 0],
    radius: 0.3,
    color: '#ff6b6b',
    type: 'star',
    orbitRadius: 35 * ORBIT_SCALE,
    orbitalPeriod: 0,
  },
  {
    name: 'Alpha Centauri A',
    position: [36 * ORBIT_SCALE, 2, 0],
    radius: 0.4,
    color: '#ffd700',
    type: 'star',
    orbitRadius: 36 * ORBIT_SCALE,
    orbitalPeriod: 0,
  },
  {
    name: 'Sirius',
    position: [37 * ORBIT_SCALE, -1, 0],
    radius: 0.45,
    color: '#ffffff',
    type: 'star',
    orbitRadius: 37 * ORBIT_SCALE,
    orbitalPeriod: 0,
  }
];

export const InterstellarMap: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Add the Sun's light
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Add celestial bodies
    const bodies = celestialBodies.map(body => {
      const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
      let material;
      
      if (body.name === 'Sun') {
        material = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.color,
          emissiveIntensity: 1,
          metalness: 0,
          roughness: 1,
        });
      } else if (body.type === 'star') {
        material = new THREE.MeshStandardMaterial({
          color: body.color,
          emissive: body.color,
          emissiveIntensity: 0.5,
          metalness: 0.3,
          roughness: 0.7,
        });
      } else {
        material = new THREE.MeshStandardMaterial({
          color: body.color,
          roughness: 0.7,
          metalness: 0.3,
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...body.position);
      scene.add(mesh);

      // Add orbit line if it's a planet
      if (body.type === 'planet') {
        const orbitGeometry = new THREE.RingGeometry(
          body.orbitRadius - 0.1,
          body.orbitRadius + 0.1,
          64
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3,
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
      }

      return { mesh, orbitalPeriod: body.orbitalPeriod, orbitRadius: body.orbitRadius };
    });

    // Camera position
    camera.position.set(20, 15, 40);
    camera.lookAt(0, 0, 0);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 5;

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.002;

      // Rotate planets
      bodies.forEach((body, index) => {
        if (body.orbitalPeriod > 0) {
          const speed = 0.1 / body.orbitalPeriod;
          body.mesh.position.x = Math.cos(time * speed) * body.orbitRadius;
          body.mesh.position.z = Math.sin(time * speed) * body.orbitRadius;
          body.mesh.rotation.y += 0.01;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <Box
      ref={mountRef}
      w="100%"
      h="100%"
      borderRadius="xl"
      overflow="hidden"
      position="relative"
    />
  );
}; 