import React, { Fragment, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Saturn = (props) => {
  const planet = useRef();
  const RingTop = useRef();
  const RingBottom = useRef();

  const { nodes } = useLoader(GLTFLoader, `${data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.0002));
//   let geometry = nodes.Cube001.geometry;
  return (
    <Fragment>
 <mesh
      ref={planet}
      visible
      position={props.ppos}
      geometry={nodes.Saturn001.geometry}
      material={nodes.Saturn001.material}
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
    <mesh>
      {/* ref={RingTop} */}
      visible
      position={props.ppos}
      {/* geometry={nodes.RingsTop.geometry} */}
      {/* material={nodes.RingsTop.material} */}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[.00005,.00005,.00005]}
    </mesh>
    <mesh>
      {/* ref={RingBottom} */}
      visible
      position={props.ppos}
      {/* geometry={nodes.RingsBottom.geometry} */}
      {/* material={nodes.RingsBottom.material} */}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[.00005,.00005,.00005]}
    </mesh>
    </Fragment>
   
  );
};

export default Saturn;