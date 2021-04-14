import React, { Fragment, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader } from "react-three-fiber";


const Saturn = (props) => {
  const planet = useRef();

  const { nodes } = useLoader(GLTFLoader, `${props.props.data.planets[props.i].map}`);

  useFrame(() => (planet.current.rotation.y += 0.0002));
//   let geometry = nodes.Cube001.geometry;
  console.log(nodes);
  return (
<mesh>
      ref={planet}
      visible
      position={props.ppos}
      {/* geometry={nodes.RingsTop.geometry} */}
      {/* material={nodes.RingsTop.material} */}
      onClick={(e) => {
        props.props.setDisplay({ planetname: `${props.props.data.planets[props.i].name}` });
        props.props.setActive(!props.active);
      }}
      scale={[
        0.02 * (0.1 / props.props.data.planets[props.i].r),
        0.02 * (0.1 / props.props.data.planets[props.i].r),
        0.02 * (0.1 / props.props.data.planets[props.i].r)
      ]}
    </mesh>
  );
};

export default Saturn;