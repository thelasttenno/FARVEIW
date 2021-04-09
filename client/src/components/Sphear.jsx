import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";
import data from "../data.json";
const Sphear = (props) => {
  // const planet = useRef();

    // const { nodes } = useLoader(GLTFLoader, "models/mars.glb");

    // useFrame(() => (planet.current.rotation.y += 0.0002));
    return (
      <mesh
        key={`${data.planets[props.i].name}`}
        position={props.ppos}
        // onClick={(e) => {
        //   props.setDisplay({ planetname: `${data.planets[this.props.i].name}` });
        //   props.setActive(!props.active);
        // }}
      >
        <sphereBufferGeometry
          args={[props.i === 0 ? 0.2 : data.planets[props.i].r * 800, 30, 30]}
          // geometry={nodes.Cube008.geometry}
          attach="geometry"
        />
        <meshStandardMaterial
          color={data.planets[props.i].color}
          // material={nodes.Cube008.material}
          attach="material"
        />
      </mesh>
  );
};

export default Sphear;
