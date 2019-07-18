export default {
  /**
   * @method isNumber
   * Checks if the string provided is a number
   * @param {string} value
   * @returns {boolean}
   */

  async isNumeric(value) {
    return !!Number(value) && value > 0;
  },

  /**
   * @method isValidSlug
   * Checks if the slug provided is a valid
   * @param {string} value
   * @returns {boolean}
   */

  async isValidSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }
};
