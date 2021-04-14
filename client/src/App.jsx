import React, { Suspense, useState } from "react";
import { Canvas } from "react-three-fiber";
// import ControlPanel from "./components/ControlPanel";
import "./styles.scss";
import PlanetInfo from "./components/PlanetInfo";
import Skybox from "./components/SkyBox";
import axios from "axios";
import SolarSystem from "./components/SolarSystem";
import Loading from "./components/Loading";

function App() {
  let [active, setActive] = useState(false);
  let [display, setDisplay] = useState({ planetname: null });
  let [data, setData] = useState(null);
  if (data === null) {
    axios.get(`http://localhost:8080/planets`).then((response) => {
      setData(response.data);
    });
  }
  if (data !== null) {
    return (
      <div className="App">
        <Suspense fallback={<Loading/>}>
          {/* <ControlPanel /> */}
          {active && <PlanetInfo display={display} data={data} />}
          <Canvas camera={{ position: [10, 0, 0] }}>
            <SolarSystem
              setDisplay={setDisplay}
              setActive={setActive}
              active={active}
              data={data}
            />
            <Skybox />
          </Canvas>
        </Suspense>
      </div>
    );
  } else {
    return (
     <Loading/>
    );
  }
}

export default App;
