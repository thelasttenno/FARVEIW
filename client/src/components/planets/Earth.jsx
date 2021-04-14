import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";
// import { Html } from "@react-three/drei"


const Earth = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.0002));

  return (
    <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.Cube001.geometry}
      material={nodes.Cube001.material}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${props.props.data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[.00005 * 2,.00005 * 2,.00005 * 2]}
      
    >
      {/* <Html scaleFactor={10}>
        <div class="content">
          Earth
        </div>
      </Html> */}

    </mesh>
  );
};

export default Earth;