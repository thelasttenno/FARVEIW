import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Pluto = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.0002));
//   let geometry = nodes.Cube001.geometry;
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
      {/* <sphereBufferGeometry
              args={[props.i === 0 ? 0.2 : props.props.data.planets[props.i].r * 800, 30, 30]}
              attach="geometry"
            /> */}
    </mesh>
  );
};

export default Pluto;