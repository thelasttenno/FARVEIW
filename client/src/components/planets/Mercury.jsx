import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Mercury = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.0002));
//   let geometry = nodes.Cube001.geometry;
  return (
    <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.Cube008.geometry}
      material={nodes.Cube008.material}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[.00005,.00005,.00005]}
    >
      {/* <sphereBufferGeometry
              args={[props.i === 0 ? 0.2 : data.planets[props.i].r * 800, 30, 30]}
              attach="geometry"
            /> */}
    </mesh>
  );
};

export default Mercury;