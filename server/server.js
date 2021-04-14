const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const path = require('path');
const NASAtelnet = require('./routes/NASAtelnet');

require('dotenv').config();

app.use(express.static("files"));
app.use(express.static(path.join(__dirname, 'public/static/data')));
app.use(express.json());
app.use(cors());


app.get('/planets', NASAtelnet.getPlanetsHandeler);
// axios.get(NASA)
// FTP REQUEST
// COMPONENT FOR MATH STUFS THAT I CANT PROGRAM BUT WILL EXPLAIN

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});