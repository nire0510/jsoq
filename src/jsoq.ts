import * as _ from 'lodash';

export class JSOQ {
  private json: any[];

  //#region BASE

  /**
   * Constructor function
   * @param {object[]} json - Input JSON array
   */
  constructor(json: any[]) {
    this.json = json;
  }

  /**
   * Returns current state of input json array
   */
  public done(): any[] {
    return this.json;
  }

  /**
   * Returns current state of input json array as string
   */
  public toString(): string {
    return JSON.stringify(this.json);
  }

  //#endregion

  //#region MANIPULATION

  /**
   * Changes the order of all properties in array.
   * @param {string} properties — One or more properties to order by.
   * @returns {this}
   */
  public order(...properties: string[]): this {
    const sort: object = _.mapValues(
      _.keyBy(
        _.map(properties, p => {
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

    this.json = _.orderBy(this.json, Object.keys(sort), Object.values(sort));
    return this;
  }

  /**
   * Extracts specific properties from all objects in array.
   * @param {string} properties - One or more properties to pick.
   * @returns {this}
   */
  public select(...properties: string[]): this {
    this.json = _.map(this.json, item => _.pick(item, properties));
    return this;
  }

  //#endregion

  //#region FILTERING

  /**
   * Keeps only the first occurrence of a property in each object in array.
   * @param {number} [property] — Property name. Leave empty to use all properties.
   * @returns {this}
   */
  public distinct(property?: string): this {
    this.json = property ? _.uniqBy(this.json, property) : _.uniq(this.json);
    return this;
  }

  /**
   * Takes n objects from the beginning of array.
   * @param {number} [n] — Number of objects to take.
   * @returns {this}
   */
  public first(n?: number): this {
    this.json = _.take(this.json, n || 1);
    return this;
  }

  /**
   * Takes only the objects in array, which property value exists in given array.
   * @param {string} property — Property name.
   * @param {*[]} values — Valid values.
   * @returns {this}
   */
  public in(property: string, values: any[]): this {
    this.json = _.filter(this.json, (o: any) => values.includes(o[property]));
    return this;
  }

  /**
   * Takes n objects from the end of array.
   * @param {number} [n] — Number of objects to take.
   * @returns {this}
   */
  public last(n?: number): this {
    this.json = _.takeRight(this.json, n || 1);
    return this;
  }

  /**
   * Takes the nth object from array.
   * @param {number} n — Index of object to take.
   * @returns {object}
   */
  public nth(n: number): any {
    return _.nth(this.json, n);
  }

  /**
   * Takes all objects from array, except of the first n objects.
   * @param {number} [n] — Number of objects to drop.
   * @returns {this}
   */
  public skip(n: number = 0): this {
    this.json = _.drop(this.json, n);
    return this;
  }

  /**
   * Takes only the objects in array which match the predicate.
   * @param {*} predicate — Search criteria.
   * @returns {this}
   */
  public where(predicate: any): this {
    this.json = _.filter(this.json, predicate);
    return this;
  }

  //#endregion

  //#region AGGREGATION

  /**
   * Computes the average value of a property in array.
   * @param {string} path — Property path.
   * @returns {number}
   */
  public avg(path: string): number {
    return _.meanBy(this.json, path);
  }

  /**
   * Computes the number of objects in array.
   * @param {string} path — Property path.
   * @returns {number}
   */
  public count(): number {
    return this.json.length;
  }

  /**
   * Finds the maximum value of a property in array.
   * @param {string} path — Property path.
   * @param {boolean} whole — True to return the entire object, otherwise returns scalar.
   */
  public max(path: string, whole?: boolean): any {
    if (whole) {
      return _.maxBy(this.json, path);
    }

    return _.get(_.maxBy(this.json, path), path);
  }

  /**
   * Finds the minimum value of a property in array.
   * @param {string} path — Property path.
   * @param {boolean} whole — True to return the entire object, otherwise returns scalar.
   */
  public min(path: string, whole?: boolean): any {
    if (whole) {
      return _.minBy(this.json, path);
    }

    return _.get(_.minBy(this.json, path), path);
  }

  /**
   * Computes the summation of a property in array.
   * @param {string} path — Property path.
   * @returns {number}
   */
  public sum(path: string): number {
    return _.sumBy(this.json, path);
  }

  //#endregion
}
