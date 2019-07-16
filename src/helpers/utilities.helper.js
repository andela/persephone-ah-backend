/**
 * @method isNumber
 * Checks if the string provided is a number
 * @param {string} value
 * @returns {boolean}
 */

const isNumeric = async value => {
  return !!Number(value);
};

export default isNumeric;
