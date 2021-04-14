const { TIMEOUT } = require("dns");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

function ReadPlanets() {
  const fileContent = fs.readFileSync("./public/static/data/data.json");
  return JSON.parse(fileContent);
}

function WritePlanets(Planets) {
  fs.writeFileSync("./data.json", JSON.stringify(Planets));
}

// USE ReadInventory() TO READ FROM FILE INSIDE HANDLER


exports.getPlanetsHandeler = (req, res) => {
  const Planets = ReadPlanets();
  setTimeout(() => {
    res.json(Planets);
  }, Math.random() * (8000 - 1000) + 1000);
};