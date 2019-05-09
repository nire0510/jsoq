import { JSOQ } from './jsoq';

export default {
  /**
   * Sets the input JSON array
   * @param {object[]} json - Input
   * @returns {JSOQ}
   */
  from(json: object[]): JSOQ {
    return new JSOQ(json);
  },
};
