import React, { Component } from "react";

class PlanetInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { found: this.props.data.planets.find(({name}) => name === `${this.props.display.planetname}`)};
  }
  componentDidUpdate(){
    if(this.state.found.name !== `${this.props.display.planetname}`){
      this.setState({
        found: this.props.data.planets.find(({name}) => name === `${this.props.display.planetname}`)
      })
    }
  }
  render() {
  console.log(this.state);
    return (
      <div className="planetInfo">
        <div className="planet">
          <h1>{this.props.display.planetname}</h1>
          <p>{this.state.found.info}</p>
          <p>Mass: {this.state.found.m}</p>
          <p>Radius: {this.state.found.r}</p>
        </div>
      </div>
    );
  }
}
export default PlanetInfo;
