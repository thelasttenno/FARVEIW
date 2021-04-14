const glob = require('glob');
const path = require('path');
const fs = require('fs');
const compiler = require('./orbitalCompiler');
const ephemeris = require('./ephemeris');

/**
 * Returns ephemeris data structure in object, or false if none found.
 * 
 * @param  {Object} data - orbital data
 * @returns {String[]\Boolean} array of NASA codes, or false if no ephemeris
 */
const getNasaData = (data) => {
	if (data.ephemeris) {
		const {
			nasaOrbitalCode,
			nasaBarycenterCode,
			revolutionOrder
		} = data.ephemeris;

		return [
			nasaOrbitalCode,
			nasaBarycenterCode,
			revolutionOrder
		];
	}
	return false;
}

/**
 * Updates the given orbital file with updated ephemeris data.
 * 
 * @param  {String} path - path to orbital JSON file
 * @param  {Object} originalData - current orbital data
 * @param  {Object} ephemerisData - ephemeris data
 */
const updateFileWithEphemeris = (path, originalData, ephemerisData) => {
	const data = Object.assign({}, originalData, ephemerisData);
	const content = JSON.stringify(data, null, 2);

	console.log(`Writing: ${path}`);

	compiler.writeFile(content, path);
}

/**
 * Finds all orbital data files and updates them with latest NASA ephemeris data.
 * 
 * @param  {String[]} orbitalPaths - list of orbital files
 * @param  {Number} index - current orbital file
 * @returns {Promise}
 */
const processOrbitals = (orbitalPaths, index = 0) => {
	const orbitalPath = orbitalPaths[index];
	const orbitalData = compiler.getJsonData(orbitalPath);
	const nasaData = getNasaData(orbitalData);

	console.log(`Processing: ${orbitalPath}...`);

	const processNext = () => {
		if (orbitalPaths.length - 1 > index) {
			return processOrbitals(orbitalPaths, ++index);
		}
	}

	if (nasaData) {
		return ephemeris
			.getEphemeris(...nasaData)
			.then((data) => updateFileWithEphemeris(orbitalPath, orbitalData, data))
			.then(processNext)
	} else {
		console.log(`No valid NASA data found for: ${orbitalPath}...`);
	}

	return processNext();
}

/**
 * Updates all orbital files.
 */
const updateAll = () => {
	const orbitalPaths = compiler.getFilePaths();

	processOrbitals(orbitalPaths);
}

module.exports = {updateAll};