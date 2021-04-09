import React, {
    useState
  } from "react";
  import { Canvas} from "react-three-fiber";
  import ControlPanel from "./components/ControlPanel";
  import "./styles.scss";
  import PlanetInfo from "./components/PlanetInfo";
  import SolarSystem from "./components/SolarSystem"

  function App() {
    let [active, setActive] = useState(false);
    let [display, setDisplay] = useState({ planetname: null });
    return (
      <div className="App">
        <ControlPanel />
        {active && <PlanetInfo display={display} />}
        <Canvas camera={{ position: [10, 0, 0] }}>
          <SolarSystem
            setDisplay={setDisplay}
            setActive={setActive}
            active={active}
          />
        </Canvas>
      </div>
    );
  }
  
export default App
  