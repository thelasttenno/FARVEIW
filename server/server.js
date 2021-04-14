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
// axios.get(NASA)
// FTP REQUEST
function MathConvertions(){
  const fileContent = fs.readFileSync("./public/static/data/orbitals.json");
  NasaFile = JSON.parse(fileContent);
  console.log(NasaFile);
}
// COMPONENT FOR MATH STUFS THAT I CANT PROGRAM BUT WILL EXPLAIN

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
