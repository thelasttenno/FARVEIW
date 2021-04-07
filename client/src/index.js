import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect
} from "react";
import ReactDOM from "react-dom";
import { Canvas, useThree, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as tf from "@tensorflow/tfjs";
import data from "./data.json";

import "./styles.css";
import { Vector3 } from "three";

extend({ OrbitControls });

const numberOfPlanets = data.planets.length;

const xInitialArray = data.planets.map((planet) => planet.x);
const vInitialArray = data.planets.map((planet) => planet.v);
const masses = data.planets.map((planet) => planet.m);

const xInitial = tf.tensor2d(xInitialArray, [numberOfPlanets, 3]);
const vInitial = tf.tensor2d(vInitialArray, [numberOfPlanets, 3]);
const G = tf.scalar(data.G);

const trajSize = 240;
const initialTraj = xInitialArray.map((x) => Array(trajSize).fill(x));

function SolarSystem( props,{ dt = 0.1 }) {
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

  // setDisplay({ planetname: "mars" });
  const { camera } = useThree();
  return (
    <group>
      <orbitControls args={[camera]} />
      <ambientLight />
      <pointLight />

      {pos.map((ppos, i) => {
        return (
          <mesh
            key={`${data.planets[i].name}`}
            position={ppos}
            onClick={(e) => {
              props.setDisplay({ planetname: `${data.planets[i].name}` });
              props.setActive(!props.active)
            }
          }
          >
            <sphereBufferGeometry
              args={[i === 0 ? 0.2 : data.planets[i].r * 800, 30, 30]}
              attach="geometry"
            />
            <meshStandardMaterial
              color={data.planets[i].color}
              attach="material"
            />
          </mesh>
        );
      })}
      {traj.map((points, i) => {
        return (
          <line key={`line-${i}`}>
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
}

function App() {
  let [active, setActive] = useState(false);
  let [display, setDisplay] = useState({ planetname: null });
  return (
    <div className="App">
      {active && <div><h1>{display.planetname}</h1></div>}
      <Canvas camera={{ position: [10, 0, 0] }}>
        <SolarSystem setDisplay={setDisplay} setActive={setActive} active={active}/>
      </Canvas>
    </div>
  );
}

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

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
