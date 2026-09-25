import * as THREE from "three";
import gsap from "gsap";

let activeTl1: gsap.core.Timeline | null = null;
let activeTl2: gsap.core.Timeline | null = null;
let activeTl3: gsap.core.Timeline | null = null;
let activeScreenLightTl: gsap.core.Timeline | null = null;
let activeCareerSectionTimeline: gsap.core.Timeline | null = null;
let activeTM2: gsap.core.Timeline | null = null;

export function cleanupCharTimeline() {
  if (activeTl1) {
    activeTl1.scrollTrigger?.kill();
    activeTl1.kill();
    activeTl1 = null;
  }
  if (activeTl2) {
    activeTl2.scrollTrigger?.kill();
    activeTl2.kill();
    activeTl2 = null;
  }
  if (activeTl3) {
    activeTl3.scrollTrigger?.kill();
    activeTl3.kill();
    activeTl3 = null;
  }
  if (activeScreenLightTl) {
    activeScreenLightTl.kill();
    activeScreenLightTl = null;
  }
  if (activeCareerSectionTimeline) {
    activeCareerSectionTimeline.scrollTrigger?.kill();
    activeCareerSectionTimeline.kill();
    activeCareerSectionTimeline = null;
  }
  if (activeTM2) {
    activeTM2.scrollTrigger?.kill();
    activeTM2.kill();
    activeTM2 = null;
  }
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  cleanupCharTimeline();

  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  activeTl1 = tl1;

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  activeTl2 = tl2;

  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  activeTl3 = tl3;
  let screenLight: THREE.Mesh | undefined;
  let monitor: THREE.Mesh | undefined;

  if (character) {
    for (const object of character.children) {
      if (object.name === "Plane004") {
        for (const child of object.children) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.transparent = true;
            mesh.material.opacity = 0;
            if (mesh.material.name === "Material.027") {
              monitor = mesh;
              (mesh.material as THREE.MeshStandardMaterial).color.set("#FFFFFF");
            }
          }
        }
      }
      if (object.name === "screenlight") {
        const mesh = object as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissive.set("#C8BFFF");
          activeScreenLightTl = gsap.timeline({ repeat: -1, repeatRefresh: true }).to(mat, {
            emissiveIntensity: () => Math.random() * 8,
            duration: () => Math.random() * 0.6,
            delay: () => Math.random() * 0.1,
          });
          screenLight = mesh;
        }
      }
    }
  }
  const neckBone = character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      if (monitor && screenLight && neckBone) {
        tl2
          .to(
            camera.position,
            { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
            0
          )
          .to(".about-section", { y: "30%", duration: 6 }, 0)
          .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
          .fromTo(
            ".character-model",
            { pointerEvents: "inherit" },
            { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
            0
          )
          .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
          .to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0)
          .to((monitor.material as THREE.Material), { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
          .to((screenLight.material as THREE.Material), { opacity: 1, duration: 0.8, delay: 4.5 }, 0)
          .fromTo(
            ".what-box-in",
            { display: "none" },
            { display: "flex", duration: 0.1, delay: 6 },
            0
          )
          .fromTo(
            monitor.position,
            { y: -10, z: 2 },
            { y: 0, z: 0, delay: 1.5, duration: 3 },
            0
          )
          .fromTo(
            ".character-rim",
            { opacity: 1, scaleX: 1.4 },
            { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
            0.3
          );
      }

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      activeTM2 = tM2;
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }
}

export function setAllTimeline() {
  if (window.innerWidth > 1024) {
    if (activeCareerSectionTimeline) {
      activeCareerSectionTimeline.scrollTrigger?.kill();
      activeCareerSectionTimeline.kill();
      activeCareerSectionTimeline = null;
    }
    const careerSectionTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".career-section",
        start: "top 50%",
        end: "bottom 30%",
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    });
    activeCareerSectionTimeline = careerSectionTimeline;
    careerSectionTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  }
}
