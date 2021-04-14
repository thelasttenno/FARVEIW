import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Venus = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.001));

  return (
    <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.cylindrically_mapped_sphereMesh.geometry}
      material={nodes.cylindrically_mapped_sphereMesh.material}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${props.props.data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[(.00005 * 2) / 1.1,(.00005 * 2) / 1.1,(.00005 * 2) / 1.1]}

    >
    </mesh>
  );
};

export default Venus;