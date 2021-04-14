const et = require('expect-telnet');
const moment = require('moment');

/**
 * NASA telnet interface constants.
 */
const TELNET_HOST = 'horizons.jpl.nasa.gov:6775';

const TELNET_TIMEOUT = 50000;

const DATE_FORMAT = 'YYYY-DD-MMM HH:mm';

/**
 * Regex patterns
 */
const JULIAN_DAY_PATTERN = '([0-9\\.]+)\\s*=\\s*A\\.D\\.[^\\n]+';

const NUMBER_VAR_PATTERN = '([A-z]{1,2})\\s*\=\\s*([0-9\\.E\\-\\+]+)';

const NUMBER_SET_PATTERN = `(${JULIAN_DAY_PATTERN}\\n(\\s*(${NUMBER_VAR_PATTERN})+\\s*)+)\\n`;

/**
 * Numerical constants.
 */
const ONE_DAY_TO_SECONDS = 31540000;

const JULIAN_DAYS_AT_UNIX_EPOCH = 2440587.5;

const SECONDS_IN_YEAR = 86400.0;

const GRAVITATIONAL_CONSTANT = 6.67408e-11; // TODO: move to front-end?

const AU_TO_KM = 1.496e+8;

/**
 * Returns key/value set separated by '='
 *
 * @param {String} v - numerical entry
 * @returns {Object} key/value pair of entry
 */
const getNumberVar = (v) => {
  const entry = v.split('=');
  const key = entry[0].trim();
  const value = entry[1].trim();

  return {
    [key]: parseFloat(value)
  };
}

/**
 * Converts Julian days to UNIX timestamp.
 *
 * @param {Number} julian - time, in Julian calendar days
 * @returns {Number} UNIX timestamp
 */
const julianToUnix = (julian) => {
  return ((julian - JULIAN_DAYS_AT_UNIX_EPOCH) * SECONDS_IN_YEAR) * 1000;
}

/**
 * Returns object of periapsis data from the given list of data sets.
 *
 * @param {Object[]} list - list of data sets
 * @returns {Object} in format {last, next}
 */
const getPeriapses = (list) => {
  let minValue, maxValue, prevValue;
  let last, next;

  list.forEach((item) => {
    const isMaxSet = maxValue !== Infinity;

    if (prevValue && item.TA < prevValue) {
      if (!minValue) {
        minValue = item.TA;
        last = julianToUnix(item.Tp);
      } else if(!maxValue) {
        maxValue = prevValue;
        next = julianToUnix(item.Tp);
      }
    }
    prevValue = item.TA;
  });
  return {last, next};
}

/**
 * Extracts numerical results from string sets and maps them to an object.
 * 
 * @param {String[]} sets - strings of data
 * @returns {Object[]} data sets in hashmap format
 */
const mapToDataSets = (sets) => {
  return sets.map((set) => {
    const vars = set.match(new RegExp(NUMBER_VAR_PATTERN, 'g'));
    let data = {};

    vars.forEach((v) => {
      Object.assign(data, getNumberVar(v));
    });

    return data;
  });
}

/**
 * Calculates semiminor axis from eccentricity and semimajor.
 *
 * @param {Number} eccentricity - elliptical eccentricity
 * @param {Number} semimajor - semimajor axis
 * @returns {Number} semiminor axis
 */
const getSemiminorAxis = (eccentricity, semimajor) => {
  return semimajor * Math.sqrt(1 - Math.pow(eccentricity, 2));
}

/**
 * Returns data in Tycho format.
 * See Github wiki page on Tycho data format.
 *
 * @param {String[]} sets - NASA-generated ephemeris data block
 * @returns {Object} Tycho-format data
 */
const getTychoData = (sets) => {
  const dataSets = mapToDataSets(sets);
  const dataSet = dataSets[0];
  const periapses = getPeriapses(dataSets);
  const semiminor = getSemiminorAxis(dataSet.EC, dataSet.A);

  return {
    argPeriapsis: dataSet.W,
    eccentricity: dataSet.EC,
    longAscNode: dataSet.OM,
    semimajor: dataSet.A,
    semiminor: semiminor,
    periapses
  };
}

/**
 * Returns a data set from the raw response from NASA ephemerides.
 *
 * @param {String} raw - raw response data
 * @returns {Object} data params in Tycho format (see Github wiki page)
 */
const getDataFromRaw = ({rawData}) => {
  const sets = rawData.match(new RegExp(NUMBER_SET_PATTERN, 'g'));

  if (Array.isArray(sets)) {
    return getTychoData(sets);
  }
  return {};
}

/**
 * Maps strings to expect-telnet sequence items.
 * `expect`s any characters.
 * 
 * @param  {String[]} sequence - sequence of commands to send
 * @return {Object[]} expect-telnet sequence
 */
const renderSequence = (sequence) => {
  return sequence.map((s) => ({
    expect: /.*/g,
    send: `${s}\r\n`
  }));
}

/**
 * Returns the next revolution order in the sequence, or undefined if N/A.
 * 
 * @param  {String} revolutionOrder - NASA code for revolution order
 * @return {String} next revolution order in sequence, or undefined
 */
const nextOrder = (revolutionOrder) => {
  const orders = ['y', 'mo', 'd', 'h', 'm'];

  for (let i = 0; i < orders.length - 1; i++) {
    if (revolutionOrder === orders[i]) {
      return orders[i + 1];
    }
  }
}

/**
 * Converts the NASA revolution order code to moment.js order code.
 * 
 * @param  {String} revolutionOrder - NASA rev order code
 * @return {String} moment.js order code
 */
const momentDateOrder = (revolutionOrder) => {
  if (revolutionOrder === 'mo') {
    return 'month';
  }
  return revolutionOrder;
}

/**
 * Renders an array of start, end dates and revolution order.
 * 
 * @param  {String} revolutionOrder - NASA revolution order code
 * @param  {Moment} date - instance of moment
 * @return {String[]} start, end, order
 */
const renderDates = (revolutionOrder, date) => {
  let start = date
    .clone()
    .format(DATE_FORMAT);

  let end = date
    .clone()
    .add(500, momentDateOrder(revolutionOrder))
    .format(DATE_FORMAT);

  return [start, end, `1${revolutionOrder}`];
}

/**
 * Returns whether the given revolution order warrants another lookup.
 * 
 * @param  {String} revolutionOrder - NASA revolution order code
 * @return {Boolean}
 */
const shouldLookupAgain = (revolutionOrder) => {
  return revolutionOrder !== 'm';
}

/**
 * Renders the request for expect-telnet.
 *
 * @private
 * @param  {String} bodyCode - NASA orbital body code
 * @param  {String} observerCode - NASA observer body code
 * @param  {String} revolutionOrder - NASA revolution order
 * @param  {Function} out - callback when telnet session ends
 * @param  {Moment} date - momentjs instance for target periapsis time
 * @return {Object[]} expect-telnet request body
 */
const getRequest = (bodyCode, observerCode, revolutionOrder, out, date) => {
  return [
    {
      expect: 'Horizons> ',
      send: `${bodyCode}\r\n`
    },
    ...renderSequence([
      'E', 'e', observerCode, 'eclip',
      ...renderDates(revolutionOrder, date),
      'y'
    ]),
    {
      expect: /Computations by/g,
      send: '\r\n',
      out
    }
  ];
}

/**
 * Renders the request for expect-telnet.
 *
 * @private
 * @param  {String} bodyCode - NASA orbital body code
 * @param  {String} observerCode - NASA observer body code
 * @param  {String} revolutionOrder - NASA revolution order
 * @param  {Function} out - callback when telnet session ends
 * @param  {Moment} date - momentjs instance for target periapsis time
 * @return {Object[]} expect-telnet request body
 */
const makeRequest = (bodyCode, observerCode, revolutionOrder, date) => {
  return new Promise((resolve, reject) => {
    const req = getRequest(bodyCode, observerCode, revolutionOrder, resolve, date);

    et(TELNET_HOST, req, {
      exit: true,
      timeout: TELNET_TIMEOUT
    }, reject);
  });
}

/**
 * Creates telnet requests for the given date. Will recursively loop through
 * each subsequent revolution periods down to one minute.
 *
 * @private
 * @param  {String} bodyCode - NASA orbital body code
 * @param  {String} observerCode - NASA observer body code
 * @param  {String} revolutionOrder - NASA revolution order
 * @param  {Moment} date - momentjs instance for target periapsis time
 * @return {Promise<Number>} exact moment of periapsis 
 */
const requestZoomIn = (bodyCode, observerCode, revolutionOrder, date) => {
  return makeRequest(bodyCode, observerCode, revolutionOrder, date)
    .then((rawData) => {
      const {periapses} = getDataFromRaw({rawData});

      if (shouldLookupAgain(revolutionOrder)) {
        const next = nextOrder(revolutionOrder);

        return requestZoomIn(bodyCode, observerCode, next, moment(periapses.last));
      }
      return periapses.last;
    });
}

/**
 * Creates the initial telnet request to retrieve ephemeris data.
 *
 * @param  {String} bodyCode - NASA orbital body code
 * @param  {String} observerCode - NASA observer body code
 * @param  {String} revolutionOrder - NASA revolution order
 * @return {Promise<Object>} full ephemeris data, including periapses
 */
const getEphemeris = (bodyCode, observerCode, revolutionOrder) => {
  return makeRequest(bodyCode, observerCode, revolutionOrder, moment())
    .then((rawData) => {
      const nextRevOrder = nextOrder(revolutionOrder);
      const formattedData = getDataFromRaw({rawData});
      const last = moment(formattedData.periapses.last);
      const next = moment(formattedData.periapses.next);

      return Promise
        .all([
          requestZoomIn(bodyCode, observerCode, nextRevOrder, last),
          requestZoomIn(bodyCode, observerCode, nextRevOrder, next)
        ])
        .then((periapsesEpochs) => {
          return Object.assign(formattedData, {
            periapses: {
              last: periapsesEpochs[0],
              next: periapsesEpochs[1]
            }
          });
        });
    });
}

module.exports = {
  DATE_FORMAT,
  getNumberVar,
  julianToUnix,
  getPeriapses,
  mapToDataSets,
  getSemiminorAxis,
  getTychoData,
  getDataFromRaw,
  renderSequence,
  nextOrder,
  momentDateOrder,
  renderDates,
  shouldLookupAgain,
  getEphemeris,
  makeRequest
};