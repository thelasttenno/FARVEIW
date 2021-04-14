import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Pluto = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.0002));

  return (
    <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.cylindrically_mapped_sphere.geometry}
      material={nodes.cylindrically_mapped_sphere.material}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${props.props.data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[(.00005 * 2) * 11,(.00005 * 2) * 11,(.00005 * 2) * 11]}

    >

    </mesh>
  );
};

export default Pluto;