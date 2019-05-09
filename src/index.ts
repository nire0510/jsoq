import { JSOQ } from './jsoq';

export function from(json: object[]): JSOQ {
  return new JSOQ(json);
}
