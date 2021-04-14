import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import ControlPanel from "./components/ControlPanel";
import "./styles.scss";
import PlanetInfo from "./components/PlanetInfo";
import Skybox from "./components/SkyBox";
import axios from "axios";
import dataTest from "./data.json"
import SolarSystem from "./components/SolarSystem";

function App() {
  
  let [active, setActive] = useState(false);
  let [display, setDisplay] = useState({ planetname: null });
  let [data, setData] = useState(null);
  if (data === null) {
    axios.get(`http://localhost:8080/planets`)
    .then(response => {
      setData(dataTest);
    });
    setData(dataTest); 
  }

  console.log(data);
  if (data !== null) {
    return (
      <div className="App">
        {/* <ControlPanel /> */}
        {active && <PlanetInfo display={display} data={data} />}
        <Canvas camera={{ position: [10, 0, 0] }}>
          <SolarSystem
            setDisplay={setDisplay}
            setActive={setActive}
            active={active}
            data={data}
          />
          <Skybox/>
        </Canvas>
      </div>
    );
  } else {
    return(
      <div>
        <h1>loading</h1>
      </div>
    );
  }
  
}

export default App;
