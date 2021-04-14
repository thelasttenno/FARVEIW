const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

function ReadPlanets() {
  const fileContent = fs.readFileSync("./static/data/data.json");
  return JSON.parse(fileContent);
}

function WritePlanets(Planets) {
  fs.writeFileSync("./static/data/data.json", JSON.stringify(Planets));
}

// USE ReadInventory() TO READ FROM FILE INSIDE HANDLER


exports.getPlanetsHandeler = (req, res) => {
  const Planets = ReadPlanets();
  res.json(Planets);
};