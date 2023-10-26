# jsoq
Query and manipulate JSON arrays easily. Powered by lodash, inspired by knex syntax and SQL in general.

![GitHub package.json version](https://img.shields.io/github/package-json/v/nire0510/jsoq)  ![GitHub](https://img.shields.io/github/license/nire0510/jsoq)
[![Rate on Openbase](https://badges.openbase.io/js/rating/jsoq.svg)](https://openbase.io/js/jsoq?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)


## Installation
`npm i jsoq@latest`

## Usage
```javascript
/*** 1. Import jsoq package: ***/
import jsoq from 'jsoq';
// or const jsoq = require('jsoq');

const data = [
  { a: 1, b: 'some text', c: false },
  { a: 2, b: 'another text', c: true },
];

/*** 2. Set the JSON array you want to query: ***/
const output = jsoq.from(data)
  /*** 3. Start manipulating: ***/
  .where({ c: true })
  .select('a')
  /*** 4. Manipulation done, return result: ***/
  .json();
//-> [ { a: 2 } ]
```

## Functions

### Basic
* `.from(json: object[])` - Sets the input JSON array.
  ```javascript
  jsoq.from(data); //-> jsoq
  ```
* `.json()` - Returns current state of input JSON array.
  ```javascript
  jsoq.from(data).json(); //-> [{}, {}, ...]
* `.string()` - Returns current state of input JSON array as string.
  ```javascript
  jsoq.from(data).string(); //-> "[{}, {}, ...]"
  ```

### Aggregation
* `.avg(property: string)` - Computes the average value of a property in JSON array.
  ```javascript
  jsoq.from(data).avg('index'); //-> 3.5
  ```
* `.count()` - Computes the number of objects in JSON array.
  ```javascript
  jsoq.from(data).count(); //-> 6
  ```
* `.max(property: string, scalar?: boolean)` - Finds the maximum value of a property in JSON array.
  ```javascript
  jsoq.from(data).max('age'); //-> jsoq
  jsoq.from(data).max('age', true); //-> 40
  ```
* `.min(property: string, scalar?: boolean)` - Finds the minimum value of a property in JSON array.
  ```javascript
  jsoq.from(data).min('age'); //-> jsoq
  jsoq.from(data).min('age', true); //-> 21
  ```
* `.sum(property: string)` - Computes the summation of a property in JSON array.
  ```javascript
  jsoq.from(data).sum('age'); //-> 68
  ```

### Filtering
* `.between(property: string, range: [min: any, max: any])` - Takes only the objects which are greater than or equals to the first value in range and smaller than or equals to the the second.
  ```javascript
  jsoq.from(data).between('age', [10, 20]); //-> jsoq
  jsoq.from(data).between('name', ['A', 'B']); //-> jsoq
  ```
* `.distinct(property?: string)` - Keeps only the first occurrence of a property in each object in JSON array.
  ```javascript
  jsoq.from(data).distinct(); //-> jsoq
  jsoq.from(data).distinct('age'); //-> jsoq
  ```
* `.first(n?: number)` - Takes n objects from the beginning of JSON array.
  ```javascript
  jsoq.from(data).first(); //-> jsoq
  jsoq.from(data).first(3); //-> jsoq
  ```
* `.ilike(property: string, values: string | string[])` - Takes only the objects which match at list one pattern (case insensitive) in JSON array.
  ```javascript
  jsoq.from(data).ilike('name', 'sha%'); //-> jsoq
  jsoq.from(data).ilike('name', ['sha%', '%ro%']); //-> jsoq
  ```
* `.in(property: string, values: any[])` - Takes only the objects which property value exists in given array.
  ```javascript
  jsoq.from(data).in('index', [1, 2]); //-> jsoq
  ```
* `.last(n?: number)` - Takes n objects from the end of JSON array.
  ```javascript
  jsoq.from(data).last(); //-> jsoq
  jsoq.from(data).last(2); //-> jsoq
  ```
* `.like(property: string, values: string | string[])` - Takes only the objects which match at list one pattern (case sensitive) in JSON array.
  ```javascript
  jsoq.from(data).like('name', 'Sha%'); //-> jsoq
  jsoq.from(data).like('name', ['Sha%', '%ro%']); //-> jsoq
  ```
* `.nth(n: number)` - Takes the nth object from JSON array.
  ```javascript
  jsoq.from(data).nth(4); //-> jsoq
  ```
* `.skip(n: number)` - Takes all objects from JSON array, except of the first n objects.
  ```javascript
  jsoq.from(data).skip(2); //-> jsoq
  ```
* `.where(predicate: any)` - Takes only the objects which match the predicate in JSON array.
  ```javascript
  jsoq.from(data).where({ age: 32 }); //-> jsoq
  jsoq.from(data).where('isActive'); //-> jsoq
  jsoq.from(data).where(o => o.age === 32 || o.isActive); //-> jsoq
  ```
### Manipulation
* `.group(property: string)` - Transforms JSON array into a dictionary, which composed of keys generated from the array.
  ```javascript
  jsoq.from(data).group('age'); //-> { '21': [{}, {}...], '32': [{}...] }
  jsoq.from(data).group('gender', 'isActive'); //-> { 'female': { 'true': [{}, {}...], 'false': [{}, {}...] }, 'male': { 'true': [{}, {}...], 'false': [{}, {}...] } }
  ```
* `.join(json: any[], property: string, fromProperty?: string)` - Merges two JSON arrays based on a property. Takes only objects which exist in both JSON arrays. You may use fromProperty if the common property name is different in each array.
  ```javascript
  jsoq.from(data).join(data2, 'index'); //-> jsoq
  ```
* `.leftJoin(json: any[], property: string, fromProperty?: string)` - Merges two JSON arrays based on a property. Takes all objects from left (first) JSON array. You may use fromProperty if the common property name is different in each array.
  ```javascript
  jsoq.from(data).leftJoin(data2, 'index'); //-> jsoq
  ```
* `.order(property: string)` - Changes the order of all properties in array.
  ```javascript
  jsoq.from(data).order('index'); //-> jsoq
  jsoq.from(data).order('index asc', 'age', 'isActive desc'); //-> jsoq
  ```
* `.random()` - Returns a random element.
  ```javascript
  jsoq.from(data).random(); //-> {}
  ```
* `.rightJoin(json: any[], property: string, fromProperty?: string)` - Merges two JSON arrays based on a property. Takes all objects from the right (second) JSON array. You may use fromProperty if the common property name is different in each array.
  ```javascript
  jsoq.from(data).rightJoin(data2, 'index'); //-> jsoq
  ```
* `.select(properties: string[])` - Extracts specific properties from all objects in array, with an option to rename keys.
  ```javascript
  jsoq.from(data).select('index'); //-> jsoq
  jsoq.from(data).select('index as i', 'isActive as a'); //-> jsoq
  ```
* `.shuffle()` - Changes the order of all properties in array randomaly.
  ```javascript
  jsoq.from(data).shuffle(); //-> jsoq
  ```

## Comments
* All methods which return jsoq are chainable, hence `.json()` should be called when you're ready to get the output.
* `first`, `last` and `nth` functions return `jsoq` and not a single object by default, to enable chaining and for the sake of consistency.
* Check __tests__ directory for examples.
