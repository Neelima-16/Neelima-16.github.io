import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

let cachedDecryptedBuffer: ArrayBuffer | null = null;

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (
    checkCancelled?: () => boolean
  ): Promise<GLTF | null> => {
    try {
      if (!cachedDecryptedBuffer) {
        cachedDecryptedBuffer = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
      }

      if (checkCancelled && checkCancelled()) {
        dracoLoader.dispose();
        return null;
      }

      const blobUrl = URL.createObjectURL(new Blob([cachedDecryptedBuffer]));

      return new Promise<GLTF | null>((resolve, reject) => {
        loader.load(
          blobUrl,
          async (gltf) => {
            URL.revokeObjectURL(blobUrl);

            if (checkCancelled && checkCancelled()) {
              dracoLoader.dispose();
              resolve(null);
              return;
            }

            const character = gltf.scene;
            try {
              await renderer.compileAsync(character, camera, scene);
            } catch {
              // Ignore compilation errors if renderer disposed
            }

            if (checkCancelled && checkCancelled()) {
              dracoLoader.dispose();
              resolve(null);
              return;
            }

            character.traverse((child: THREE.Object3D) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.frustumCulled = true;
              }
            });

            const footR = character.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            const footL = character.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;

            dracoLoader.dispose();
            resolve(gltf);
          },
          undefined,
          (error) => {
            URL.revokeObjectURL(blobUrl);
            dracoLoader.dispose();
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      });
    } catch (err) {
      dracoLoader.dispose();
      console.error(err);
      return null;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
