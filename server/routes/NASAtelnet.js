const { TIMEOUT } = require("dns");
const fs = require("fs");

require("dotenv").config();

function ReadPlanets() {
  const fileContent = fs.readFileSync("./public/static/data/data.json");
  return JSON.parse(fileContent);
}

exports.getPlanetsHandeler = (req, res) => {
  const Planets = ReadPlanets();
  setTimeout(() => {
    res.json(Planets);
  }, Math.random() * (8000 - 1000) + 1000);
};