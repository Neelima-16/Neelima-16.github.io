import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../utils/loadingProgress";
import { setCharTimeline, setAllTimeline, cleanupCharTimeline } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const containerDiv = canvasDiv.current;
    if (!containerDiv) return;

    let isCancelled = false;

    // Remove any stale canvas elements from containerDiv
    const staleCanvases = containerDiv.querySelectorAll("canvas");
    staleCanvases.forEach((c) => c.remove());

    const rect = containerDiv.getBoundingClientRect();
    const container = { width: rect.width || window.innerWidth, height: rect.height || window.innerHeight };
    const aspect = container.width / container.height;
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerDiv.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let cleanupHover: (() => void) | undefined;
    let introTimeout: ReturnType<typeof setTimeout> | undefined;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => {
      if (!isCancelled) setLoading(value);
    });
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let onResize: (() => void) | null = null;

    loadCharacter(() => isCancelled).then((gltf) => {
      if (isCancelled || !gltf) {
        if (gltf?.scene) {
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.geometry?.dispose();
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
              } else {
                mesh.material?.dispose();
              }
            }
          });
        }
        return;
      }

      const loadedChar = gltf.scene;

      // Ensure no duplicate character is in the scene
      const existingModel = scene.getObjectByName(loadedChar.name || "character_root");
      if (existingModel) {
        scene.remove(existingModel);
      }
      loadedChar.name = loadedChar.name || "character_root";
      scene.add(loadedChar);

      const animations = setAnimations(gltf);
      if (hoverDivRef.current) {
        cleanupHover = animations.hover(gltf, hoverDivRef.current);
      }
      mixer = animations.mixer;

      headBone = loadedChar.getObjectByName("spine006") || null;
      screenLight = loadedChar.getObjectByName("screenlight") || null;

      setCharTimeline(loadedChar, camera);
      setAllTimeline();

      progress.loaded().then(() => {
        if (isCancelled) return;
        introTimeout = setTimeout(() => {
          if (isCancelled) return;
          light.turnOnLights();
          animations.startIntro();
        }, 2500);
      });

      onResize = () => {
        if (!isCancelled) {
          handleResize(renderer, camera, canvasDiv, loadedChar);
        }
      };
      window.addEventListener("resize", onResize);
    });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounce: ReturnType<typeof setTimeout> | undefined;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    document.addEventListener("mousemove", onMouseMove);
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart);
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    let animationFrameId: number;
    const animate = () => {
      if (isCancelled) return;
      animationFrameId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      if (introTimeout) clearTimeout(introTimeout);
      if (debounce) clearTimeout(debounce);
      if (cleanupHover) cleanupHover();
      if (mixer) mixer.stopAllAction();

      cleanupCharTimeline();

      if (onResize) {
        window.removeEventListener("resize", onResize);
      }
      document.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }

      // Dispose all geometries and materials in scene
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      scene.clear();

      renderer.dispose();
      if (renderer.domElement.parentNode === containerDiv) {
        containerDiv.removeChild(renderer.domElement);
      }
    };
  }, []); // Run once on mount

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
