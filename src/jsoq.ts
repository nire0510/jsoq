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
   * Returns current state of input json array.
   * @param {boolean} flatten - Indicates whether a singl object should be returned
   * @returns {*} - Single object if flatten is true, array otherwise
   */
  public toJSON(): any[];
  public toJSON(flatten: boolean): any[] | object;
  public toJSON(flatten?: boolean): any[] | object {
    return (this.json.length === 1 && flatten) ? this.json[0] : this.json;
  }

  /**
   * Returns current state of input json array as string.
   * @returns {string} - JSON array as a string
   */
  public toString(): string {
    return JSON.stringify(this.json);
  }

  //#endregion

  //#region MANIPULATION

  /**
   * Transforms array into a dictionary which composed of keys generated from the array.
   * @param {string} property — Property name / path.
   * @returns {object}
   */
  public group(property: string): object {
    return _.groupBy(this.json, property);
  }

  /**
   * Merges two JSON arrays based on a property. Takes only objects which exist in both JSON arrays.
   * where only items which exist on both JSON array included.
   * @param {string} property — Property name / path.
   * @param {string} rightProperty — Property name / path of the second object. Leave blank if it's the same as property.
   * @returns {this}
   */
  public join(json: any[], property: string, rightProperty?: string): this {
    this.json = _.compact(
      _.map(this.json, item => {
        const match = _.find(json, [property, _.get(item, rightProperty || property)]);

        if (match) {
          return _.assign(item, _.find(json, [property, _.get(item, rightProperty || property)]));
        }

        return null;
      }),
    );

    return this;
  }

  /**
   * Merges two JSON arrays based on a property. Takes all objects from left (first) JSON array
   * even when no match found.
   * @param {string} property — Property name / path.
   * @param {string} rightProperty — Property name / path of the second object. Leave blank if it's the same as property.
   * @returns {this}
   */
  public leftJoin(json: any[], property: string, rightProperty?: string): this {
    this.json = _.map(this.json, item => _.assign(item, _.find(json, [property, _.get(item, rightProperty || property)])));
    
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
   * Merges two JSON arrays based on a property. Takes all objects from the right (second) JSON array.
   * even when no match found.
   * @param {string} property — Property name / path.
   * @param {string} rightProperty — Property name / path of the second object. Leave blank if it's the same as property.
   * @returns {this}
   */
  public rightJoin(json: any[], property: string, rightProperty?: string): this {
    this.json = _.map(json, item => _.assign(item, _.find(this.json, [property, _.get(item, rightProperty || property)])));
    
    return this;
  }

  /**
   * Extracts specific properties from all objects in array.
   * @param {string} properties - One or more properties to pick.
   * @returns {this}
   */
  public select(...properties: string[]): this {
    const keysMap = _.mapValues(_.groupBy(properties.map(i => i.split(/\s+as\s+/i)), 0), v => _.last(_.flatten(v)));

    this.json = _.map(this.json, item => _.mapKeys(_.pick(item, Object.keys(keysMap)), (v, k) => keysMap[k]));
    
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
   * Takes only the objects which match at list one pattern (case insensitive).
   * @param {string | string[]} values — One or more matching patterns.
   * @returns {this}
   */
  public ilike(property: string, values: string | string[]): this {
    this.json = _.filter(this.json, (o: any) =>
      (Array.isArray(values) ? values : [values]).some(
        (v: string): boolean => _.get(o, property).match(new RegExp(`^${v.replace(/%/g, '.+')}$`, 'i')),
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
   * Takes only the objects which match at list one pattern (case sensitive).
   * @param {string | string[]} values — One or more matching patterns.
   * @returns {this}
   */
  public like(property: string, values: string | string[]): this {
    this.json = _.filter(this.json, (o: any) =>
      (Array.isArray(values) ? values : [values]).some(
        (v: string): boolean => _.get(o, property).match(new RegExp(`^${v.replace(/%/g, '.+')}$`)),
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
    this.json = [_.nth(this.json, n)];
    
    return this;
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
   * Takes only the objects which match the predicate.
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
   * @param {string} property — Property name / path.
   * @returns {number}
   */
  public avg(property: string): number {
    return _.meanBy(this.json, property);
  }

  /**
   * Computes the number of objects in array.
   * @returns {number}
   */
  public count(): number {
    return this.json.length;
  }

  /**
   * Finds the maximum value of a property in array.
   * @param {string} property — Property name / path.
   * @param {boolean} whole — True to return the entire object, otherwise returns scalar.
   * @returns {*} - JSOQ object if whole is true, single var otherwhise
   */
  public max(property: string): any;
  public max(property: string, whole: boolean): this;
  public max(property: string, whole?: boolean): any | this {
    if (whole) {
      this.json = [_.maxBy(this.json, property)];
      
      return this;
    }

    return _.get(_.maxBy(this.json, property), property);
  }

  /**
   * Finds the minimum value of a property in array.
   * @param {string} property — Property name / path.
   * @param {boolean} whole — True to return the entire object, otherwise returns scalar.
   * @returns {*} - JSOQ object if whole is true, single var otherwhise
   */
  public min(property: string): any;
  public min(property: string, whole: boolean): this;
  public min(property: string, whole?: boolean): any | this {
    if (whole) {
      this.json = [_.minBy(this.json, property)];
      
      return this;
    }

    return _.get(_.minBy(this.json, property), property);
  }

  /**
   * Computes the summation of a property in array.
   * @param {string} property — Property name / path.
   * @returns {number}
   */
  public sum(property: string): number {
    return _.sumBy(this.json, property);
  }

  //#endregion
}
