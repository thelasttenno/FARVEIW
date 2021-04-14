const glob = require('glob');
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(process.cwd(), './public/static/data/orbitals');

/**
 * Returns JSON data from the given file path.
 *
 * @param {String} filePath - path to JSON file
 * @returns {Object} JSON-parsed contents of given file
 */
const getJsonData = (filePath) => {
  return require(filePath);
}

/**
 * Extracts the file name from the given file path.
 *
 * @param {String} filePath - path to JSON file
 * @returns {String} file name from given path
 */
const getKeyFromPath = (filePath) => {
  return filePath
    .replace(/^.*[\\\/]/, '')
    .replace('.json', '');
}

/**
 * Bundles all JSONs from the given paths to one object.
 * The keys will be the file name of the given file path.
 *
 * @param {String[]} filePaths - list of JSON file paths
 * @returns {Object} flat object with JSON data
 */
const jsonFilesToObject = (filePaths) => {
  let data = {};

  filePaths.forEach((filePath) => {
    const key = getKeyFromPath(filePath);
    data[key] = getJsonData(filePath);
  });

  return data;
}

/**
 * Removes satellites from the given object.
 *
 * @param {Object} mapping - with satellites mapped
 * @returns {Object} data with satellites removed
 */
const removeSatellites = (mapping, satellites) => {
  satellites.forEach((satellite) => {
    delete mapping[satellite];
  });
  return mapping;
}

/**
 * Maps satellites to their parents.
 * Satellites will be removed from the flat map.
 *
 * @param {Object} data - flat data
 * @returns {Object} data with satellites mapped
 */
const mapSatellitesToParents = (data) => {
  let mapping = {};
  let satelliteKeys = [];

  for (const id in data) {
    const {satellites} = data[id];

    if (Array.isArray(satellites)) {
      data[id].satellites = satellites
        .map((satellite) => {
          if (!data[satellite]) {
            data[satellite] = {};
          }
          satelliteKeys.push(satellite);
          
          return Object.assign(data[satellite], {id: satellite});
        })
        .filter((satellite) => !!satellite);
    }
    mapping[id] = data[id];
  }
  
  return removeSatellites(mapping, satelliteKeys);
}

/**
 * Flattens key-value orbital data structure to array.
 * Assigns the key as the `id` property of the given orbital.
 *
 * @param {Object} orbitalData - key/value pair of orbital data
 * @returns {Object[]} array of orbitals
 */
const orbitalsToArray = (orbitalData) => {
  let data = [];

  for (const id in orbitalData) {
    data.push(
      Object.assign({}, orbitalData[id], {id})
    );
  }
  return data;
}

/**
 * Returns all *.json files recursively in the given path.
 *
 * @private
 * @returns {String[]} list of paths to JSON files.
 */
const getFilePaths = () => {
  return glob.sync(`${DATA_PATH}/**/*.json`);
}

/**
 * Compiles data from the given base path.
 *
 * @private
 * @param {String} basePath - base path for json files
 * @returns {String} JSON-stringified data bundle
 */
const getOrbitalDataBundle = () => {
  const filePaths = getFilePaths();
  const jsonData = jsonFilesToObject(filePaths);
  const orbitalsObj = mapSatellitesToParents(jsonData);
  const orbitalsArr = orbitalsToArray(orbitalsObj);

  return JSON.stringify(orbitalsArr);
}

/**
 * Writes the given data to the location of the specified orbital.
 *
 * @private
 * @param {String} data - JSON-encoded data
 * @param {String} fileName - name of orbital JSON to write
 */
const compileDataFile = (data, fileName) => {
  writeFile(data, `${DATA_PATH}/${fileName}.json`);
}

/**
 * Writes the given data to the specified file.
 *
 * @param {String} data - file contents
 * @param {String} filePath - full path of file to write
 */
const writeFile = (data, filePath) => {
  fs.writeFile(filePath, data, {flag: 'w'}, (err) => {
    if (err) {
      return console.log('Error: ', err);
    }
    console.log(`🌎  Created orbital file in: ${filePath}`);
  }); 
}

/**
 * Compiles all bundles.
 */
const compileBundles = () => {
  compileDataFile(getOrbitalDataBundle(), '../orbitals');
}

module.exports = {
  DATA_PATH,
  writeFile,
  getKeyFromPath,
  getFilePaths,
  getJsonData,
  jsonFilesToObject,
  removeSatellites,
  mapSatellitesToParents,
  orbitalsToArray,
  getOrbitalDataBundle,
  compileBundles
};
