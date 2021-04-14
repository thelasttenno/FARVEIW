import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Uranus = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.002));

  return (
    <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.Uranus.geometry}
      material={nodes.Uranus.material}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${props.props.data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[(.00005 * 2) * 4 ,(.00005 * 2) * 4,(.00005 * 2) * 4]}

    >
    </mesh>
  );
};

export default Uranus;