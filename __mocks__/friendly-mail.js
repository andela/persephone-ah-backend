/* eslint-disable class-methods-use-this */
/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
/**
 *
 *
 * @export
 * @class Mail
 * @method to returns this
 * @method data returns this
 * @method subject returns this
 */

export default class Mail {
  /**
   *
   *
   * @returns this object
   * @memberof Mail
   */
  to() {
    return this;
  }

  /**
   *
   *
   * @returns this object
   * @memberof Mail
   */
  data() {
    return this;
  }

  /**
   *
   *
   * @returns this object
   * @memberof Mail
   */

  subject() {
    return this;
  }

  /**
   *
   *
   * @memberof Mail
   *
   * @returns a promise
   */
  // eslint-disable-next-line class-methods-use-this
  // eslint-disable-next-line no-empty-function
  async send() {}
}
