import { JSOQ } from './jsoq';

export = {
  /**
   * Sets the input JSON array
   * @param {object[]} json - Input
   * @returns {JSOQ}
   */
  from(json: object[]): JSOQ {
    return new JSOQ(json);
  },
};
