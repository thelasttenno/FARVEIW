import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Mercury = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.001));

  return (
    <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.Cube008.geometry}
      material={nodes.Cube008.material}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${props.props.data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[(.00005 * 2) / 2.6 ,(.00005 * 2) / 2.6,(.00005 * 2) / 2.6]}

    >

    </mesh>
  );
};

export default Mercury;