import { JSOQ } from './jsoq';

export default {
  from(json: object[]): JSOQ {
    return new JSOQ(json);
  },
};
