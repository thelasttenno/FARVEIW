import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
  Suspense,
} from "react";
import { useThree, extend, useFrame } from "react-three-fiber";
import {
  Sun,
  Mercury,
  Venus,
  Earth,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
  Pluto,
  SaturnRingBottom,
  SaturnRingTop,
} from "./planets";
import * as tf from "@tensorflow/tfjs";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls });


function SolarSystem(props, { dt = 0.1 }) {
let data = props.data;
const numberOfPlanets = data.planets.length;

const xInitialArray = data.planets.map((planet) => planet.x.map((xyz)=> xyz * 1));
const vInitialArray = data.planets.map((planet) => planet.v.map((xyz)=> xyz * 1));
const masses = data.planets.map((planet) => planet.m * 1);

const xInitial = tf.tensor2d(xInitialArray, [numberOfPlanets, 3]);
const vInitial = tf.tensor2d(vInitialArray, [numberOfPlanets, 3]);
const G = tf.scalar(data.G);
const trajSize = 480;
const initialTraj = xInitialArray.map((x) => Array(trajSize).fill(x));
  const [pos, setPos] = useState(xInitialArray);
  const [traj, setTraj] = useState(initialTraj);
  const x = useRef(xInitial);
  const v = useRef(vInitial);
  const nTimeStpes = useRef(0);
  const dtTensor = useMemo(() => tf.scalar(dt), [dt]);
  const compute = useCallback(() => {
    const [newX, newV] = tf.tidy(() => {
      const a = calcA(x.current);
      const newX = x.current.add(tf.mul(v.current, dtTensor));
      const newV = v.current.add(tf.mul(a, dtTensor));

      return [newX, newV];
    });

    tf.dispose([x.current, v.current]);
    x.current = newX;
    v.current = newV;

    newX.array().then((newPos) => {
      setPos(newPos);
      if (nTimeStpes.current++ % 30 === 0) {
        setTraj((traj) =>
          traj.map((points, i) =>
            points.slice(-trajSize + 1).concat([newPos[i]])
          )
        );
      }
    });
  }, [x, v, dtTensor]);

  useEffect(() => {
    requestAnimationFrame(() => {
      compute();
    });
  }, [pos, compute]);

  const handleUpdateGeometry = useCallback((self) => {
    self.verticesNeedUpdate = true;
  }, []);
  ////////////////////////////////////////
  const {
    camera,
    gl: { domElement },
  } = useThree();

  const controls = useRef();
  useFrame(() => 1);
  //////////////////////////////////////////////
  return (
    <group>
      <orbitControls
        ref={controls}
        args={[camera, domElement]}
        autoRotate={false}
        enableZoom={true}
      />
      <ambientLight intensity={0} />
      <pointLight intensity={1} />
      <Suspense fallback="loading">
        <Sun
          i={0}
          ppos={pos[0]}
          props={props}
          key={`${data.planets[0].name}`}
        />
        <Mercury
          i={1}
          ppos={pos[1]}
          props={props}
          key={`${data.planets[1].name}`}
        />
        <Venus
          i={2}
          ppos={pos[2]}
          props={props}
          key={`${data.planets[2].name}`}
        />
        <Earth
          i={3}
          ppos={pos[3]}
          props={props}
          key={`${data.planets[3].name}`}
        />
        <Mars
          i={4}
          ppos={pos[4]}
          props={props}
          key={`${data.planets[4].name}`}
        />
        <Jupiter
          i={5}
          ppos={pos[5]}
          props={props}
          key={`${data.planets[5].name}`}
        />
        <Saturn
          i={6}
          ppos={pos[6]}
          props={props}
          key={`${data.planets[6].name}`}
        />
        <Uranus
          i={7}
          ppos={pos[7]}
          props={props}
          key={`${data.planets[7].name}`}
        />
        <Neptune
          i={8}
          ppos={pos[8]}
          props={props}
          key={`${data.planets[8].name}`}
        />
        <Pluto
          i={9}
          ppos={pos[9]}
          props={props}
          key={`${data.planets[9].name}`}
        />
      </Suspense>

      {traj.map((points, i) => {
        return (
          <line
            key={`line-${i}`}
            // this code is iffy need to figure it out before impletmenting it
            // onClick={(e) => {
            //   props.setDisplay({
            //     planetname: `${data.planets[i].name}`,
            //   });
            //   props.setActive(!props.active);
            // }}
            //
          >
            <geometry
              attach="geometry"
              vertices={points.map((point) => new Vector3(...point))}
              onUpdate={handleUpdateGeometry}
            />
            <lineBasicMaterial
              color={data.planets[i].color}
              attach="material"
            />
          </line>
        );
      })}
    </group>
  );
  function calcA(x) {
    const unstackedX = tf.unstack(x);
    const accelerations = Array(numberOfPlanets).fill(tf.tensor1d([0, 0, 0]));
  
    for (let i = 0; i < numberOfPlanets; i++) {
      const iX = unstackedX[i];
      for (let j = i + 1; j < numberOfPlanets; j++) {
        const jX = unstackedX[j];
        const vector = tf.sub(jX, iX);
        const r = tf.norm(vector);
  
        const force = G.mul(masses[i])
          .mul(masses[j])
          .div(tf.pow(r, 3))
          .mul(vector);
        accelerations[i] = accelerations[i].add(force);
        accelerations[j] = accelerations[j].sub(force);
      }
  
      accelerations[i] = accelerations[i].div(masses[i]);
    }
  
    return tf.stack(accelerations);
  }
}


export default SolarSystem;
