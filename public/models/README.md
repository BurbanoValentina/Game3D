/*
  OASIS 3D Models Directory
  
  Los modelos 3D se generan proceduralmente con Three.js
  (geometría parametrica en BuildingFactory.js y WorldBuilder.js).
  
  Para agregar modelos externos (.glb, .gltf):
  1. Colocar aquí los archivos .glb
  2. Usar GLTFLoader de Three.js para cargarlos
  3. Ejemplo:
  
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  
  const loader = new GLTFLoader();
  loader.load('/models/eva-avatar.glb', (gltf) => {
    scene.add(gltf.scene);
  });
  
  Modelos sugeridos:
  - eva-avatar.glb (avatar de Eva)
  - puzzle-terminal.glb (terminal de puzzles)
  - key-amber.glb (modelo de la llave ámbar)
  - npc-broken.glb (NPC en bucle)
*/
