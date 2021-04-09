import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";
import data from "../data.json";
const Sphear = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${data.planets[props.i].map}`);
  const active = false;
  useFrame(() => (planet.current.rotation.y += 0.0002));
  return (
    <mesh
      // scale={active ? 1.5 : 1}
      ref={planet}
      visible
      key={`${data.planets[props.i].name}`}
      position={props.ppos}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      // geometry={nodes.Cube008.geometry}
      material={nodes.Cube008.material}
    >
      <sphereBufferGeometry
          args={[props.i === 0 ? 0.2 : data.planets[props.i].r * 800, 30, 30]}
          
          attach="geometry"
        />
    </mesh>
    
  );
};

export default Sphear;
