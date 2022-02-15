import * as _ from 'lodash';

export class JSOQ {
  private data: any[];

  //#region BASE

  /**
   * Constructor function
   * @param {object[]} data - Input JSON array
   */
  constructor(data: any[]) {
    if (!Array.isArray(data)) {
      throw new Error('Input must be an array');
    }

    this.data = data;
  }

  /**
   * Returns current state of input json array.
   * @returns {*} - JSON array
   */
  public json(): any[];
  public json(): object {
    return this.data;
  }

  /**
   * Returns current state of input json array as string.
   * @returns {string} - JSON array as a string
   */
  public string(): string {
    return JSON.stringify(this.data);
  }

  //#endregion

  //#region MANIPULATION

  /**
   * Transforms array into a dictionary which composed of keys generated from the array.
   * @param {string} property — Property name / path.
   * @returns {object}
   */
  public group(property: string): object {
    return _.groupBy(this.data, property);
  }

  /**
   * Merges two JSON arrays based on a property. Takes only objects which exist in both JSON arrays.
   * where only items which exist on both JSON array included.
   * @param {string} property — Property name / path.
   * @param {string} fromProperty — Property name / path of the object specified in from. Leave blank if it's the same as property.
   * @returns {this}
   */
  public join(json: any[], property: string, fromProperty?: string): this {
    this.data = _.compact(
      _.reduce(
        this.data,
        (acc: any[], cur: any) => {
          const matches = _.filter(json, [property, _.get(cur, fromProperty || property)]);

          _.forEach(matches, (match) => {
            acc.push(_.assign({}, cur, match));
          });

          return acc;
        },
        [],
      ),
    );

    return this;
  }

  /**
   * Merges two JSON arrays based on a property. Takes all objects from left (first) JSON array
   * even when no match found.
   * @param {string} property — Property name / path.
   * @param {string} fromProperty — Property name / path of the object specified in from. Leave blank if it's the same as property.
   * @returns {this}
   */
  public leftJoin(json: any[], property: string, fromProperty?: string): this {
    this.data = _.map(this.data, (item) =>
      _.assign(item, _.find(json, [property, _.get(item, fromProperty || property)])),
    );

    return this;
  }

  /**
   * Changes the order of all properties in array.
   * @param {string} properties — One or more properties to order by.
   * @returns {this}
   */
  public order(...properties: string[]): this {
    const sort: object = _.mapValues(
      _.keyBy(
        _.map(properties, (p) => {
          const propOrder = p.split(/\s+/);

          return {
            direction: propOrder[1] || 'asc',
            property: propOrder[0],
          };
        }),
        'property',
      ),
      'direction',
    );

    this.data = _.orderBy(this.data, Object.keys(sort), Object.values(sort));

    return this;
  }

  /**
   * Returns a random element.
   * @returns {this}
   */
  public random(): any {
    return _.sample(this.data);
  }

  /**
   * Merges two JSON arrays based on a property. Takes all objects from the right (second) JSON array.
   * even when no match found.
   * @param {string} property — Property name / path.
   * @param {string} fromProperty — Property name / path of the object specified in from. Leave blank if it's the same as property.
   * @returns {this}
   */
  public rightJoin(json: any[], property: string, fromProperty?: string): this {
    this.data = _.map(json, (item) =>
      _.assign(item, _.find(this.data, [property, _.get(item, fromProperty || property)])),
    );

    return this;
  }

  /**
   * Extracts specific properties from all objects in array.
   * @param {string} properties - One or more properties to pick.
   * @returns {this}
   */
  public select(...properties: string[]): this {
    const keysMap = _.mapValues(
      _.groupBy(
        properties.map((i) => i.split(/\s+as\s+/i)),
        0,
      ),
      (v) => _.last(_.flatten(v)),
    );

    this.data = _.map(this.data, (item) => _.mapKeys(_.pick(item, Object.keys(keysMap)), (v, k) => keysMap[k]));

    return this;
  }

  /**
   * Changes the order of all properties in array randomaly.
   * @returns {this}
   */
  public shuffle(): this {
    this.data = _.shuffle(this.data);

    return this;
  }

  //#endregion

  //#region FILTERING

  /**
   * Takes only the objects which are greater than first value in range and smaller than the second.
   * @param {string} property — Property name.
   * @param {range[]} range — Minimium and maximum allowed values.
   * @returns {this}
   */
  public between(property: string, range: [any, any]): this {
    return this.where((o: any) => _.get(o, property) >= range[0] && _.get(o, property) <= range[1]);
  }

  /**
   * Keeps only the first occurrence of a property in each object in array.
   * @param {number} [property] — Property name. Leave empty to use all properties.
   * @returns {this}
   */
  public distinct(property?: string): this {
    this.data = property ? _.uniqBy(this.data, property) : _.uniq(this.data);

    return this;
  }

  /**
   * Takes n objects from the beginning of array.
   * @param {number} [n] — Number of objects to take (default 1).
   * @returns {this}
   */
  public first(n?: number): this {
    this.data = _.take(this.data, n || 1);

    return this;
  }

  /**
   * Takes only the objects which match at list one pattern (case insensitive).
   * @param {string | string[]} values — One or more matching patterns.
   * @returns {this}
   */
  public ilike(property: string, values: string | string[]): this {
    this.data = _.filter(this.data, (o: any) =>
      (Array.isArray(values) ? values : [values]).some((v: string): boolean =>
        _.get(o, property).match(new RegExp(`^${v.replace(/%/g, '.+')}$`, 'i')),
      ),
    );

    return this;
  }

  /**
   * Takes only the objects in array, which property value exists in given array.
   * @param {string} property — Property name.
   * @param {*[]} values — Valid values.
   * @returns {this}
   */
  public in(property: string, values: any[]): this {
    this.data = _.filter(this.data, (o: any) => values.includes(o[property]));

    return this;
  }

  /**
   * Takes n objects from the end of array.
   * @param {number} [n] — Number of objects to take (default 1).
   * @returns {this}
   */
  public last(n?: number): this {
    this.data = _.takeRight(this.data, n || 1);

    return this;
  }

  /**
   * Takes only the objects which match at list one pattern (case sensitive).
   * @param {string | string[]} values — One or more matching patterns.
   * @returns {this}
   */
  public like(property: string, values: string | string[]): this {
    this.data = _.filter(this.data, (o: any) =>
      (Array.isArray(values) ? values : [values]).some((v: string): boolean =>
        _.get(o, property).match(new RegExp(`^${v.replace(/%/g, '.+')}$`)),
      ),
    );

    return this;
  }

  /**
   * Takes the nth object from array.
   * @param {number} n — Index of object to take.
   * @returns {this}
   */
  public nth(n: number): this {
    this.data = [_.nth(this.data, n)];

    return this;
  }

  /**
   * Takes all objects from array, except of the first n objects.
   * @param {number} [n] — Number of objects to drop.
   * @returns {this}
   */
  public skip(n: number = 0): this {
    this.data = _.drop(this.data, n);

    return this;
  }

  /**
   * Takes only the objects which match the predicate.
   * @param {*} predicate — Search criteria.
   * @returns {this}
   */
  public where(predicate: any): this {
    this.data = _.filter(this.data, predicate);

    return this;
  }

  //#endregion

  //#region AGGREGATION

  /**
   * Computes the average value of a property in array.
   * @param {string} property — Property name / path.
   * @returns {number}
   */
  public avg(property: string): number {
    return _.meanBy(this.data, property);
  }

  /**
   * Computes the number of objects in array.
   * @returns {number}
   */
  public count(): number {
    return this.data.length;
  }

  /**
   * Finds the maximum value of a property in array.
   * @param {string} property — Property name / path.
   * @param {boolean} scalar — True to return the value, otherwise returns the entire object.
   * @returns {*} - single value if scalar is true, JSOQ object otherwhise
   */
  public max(property: string, scalar: boolean = false): any | this {
    if (scalar) {
      return _.get(_.maxBy(this.data, property), property);
    }

    this.data = [_.maxBy(this.data, property)];

    return this;
  }

  /**
   * Finds the minimum value of a property in array.
   * @param {string} property — Property name / path.
   * @param {boolean} scalar — True to return the value, otherwise returns the entire object.
   * @returns {*} - single value if scalar is true, JSOQ object var otherwhise
   */
  public min(property: string, scalar: boolean = false): any | this {
    if (scalar) {
      return _.get(_.minBy(this.data, property), property);
    }

    this.data = [_.minBy(this.data, property)];

    return this;
  }

  /**
   * Computes the summation of a property in array.
   * @param {string} property — Property name / path.
   * @returns {number}
   */
  public sum(property: string): number {
    return _.sumBy(this.data, property);
  }

  //#endregion

  //#region AGGREGATION

  //#endregion
}
