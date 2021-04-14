const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const path = require("path");
const NASAtelnet = require("./routes/NASAtelnet");

const orbitalCompiler = require("./lib/orbitalCompiler");
const ephemeris = require("./lib/ephemeris");
const orbitalUpdater = require("./lib/orbitalUpdater");
require("dotenv").config();

app.use(express.static("files"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.get("/planets", NASAtelnet.getPlanetsHandeler);

// COMPONENT FOR MATH STUFS THAT I CANT PROGRAM BUT WILL EXPLAIN
function MathConvertions(){
  const fileContent = fs.readFileSync("./public/static/data/orbitals.json");
  let NasaFile = JSON.parse(fileContent);
  console.log(NasaFile);
  // here is where i would use a lagrounde formula if i knew/had time to do the calculus
  // so i could take Nasas data and import it into my three.js scape.
  // becuase we need a inital Velocity and a intial position that we cant get from NASAs flat data.
  let FarVeiwFile = NasaFile;
  fs.writeFileSync("./public/static/data/data.json", JSON.stringify(FarVeiwFile));
}
////////////////////////////////////////////////////////

for (let index = 0; index < 1; index++) {
  orbitalUpdater.updateAll();
  setTimeout(() => {
  orbitalCompiler.compileBundles();
  console.log("Code ran");
  }, 10 * 60 * 1000);
}

var dayInMilliseconds = 1000 * 60 * 60 * 24;
setInterval(function () {
  orbitalUpdater.updateAll();
  setTimeout(() => {
  orbitalCompiler.compileBundles();
  console.log("Code ran");
  }, 5 * 60 * 1000);
}, dayInMilliseconds);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
