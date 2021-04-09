import React, { Component } from "react";
// import data from "../data.json";

class PlanetInfo extends Component {
  render() {
    return (
      <div className="planetInfo">
        <div className="planet">
          <h1>{this.props.display.planetname}</h1>
        </div>
      </div>
    );
  }
}
export default PlanetInfo;
