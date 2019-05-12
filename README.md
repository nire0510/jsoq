# jsoq
Query and manipulate JSON arrays easily. Powered by lodash, inspired by knex and SQL in general.

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
  .toJSON();
//-> [ { a: 2 } ]
```

## Functions

### Basic
* `.from(json: object[])` - Sets the input JSON array.  
  ```javascript
  jsoq.from(data); //-> jsoq
  ```
* `.toJSON(flatten?: boolean)` - Returns current state of input json array.  
  ```javascript
  jsoq.from(data).toJSON(); //-> [{}, {}, ...]
  jsoq.from(data).first().toJSON(true); //-> {}
* `.toString()` - Returns current state of input json array as string.  
  ```javascript
  jsoq.from(data).toString(); //-> "[{}, {}, ...]"
  ```

### Aggregation
* `.avg(property: string)` - Computes the average value of a property in array.  
  ```javascript
  jsoq.from(data).avg('index'); //-> 3.5
  ```
* `.count()` - Computes the number of objects in array.  
  ```javascript
  jsoq.from(data).count(); //-> 6
  ```
* `.max(property: string, whole?: boolean)` - Finds the maximum value of a property in array.  
  ```javascript
  jsoq.from(data).max('age'); //-> 40
  jsoq.from(data).max('age', true); //-> jsoq
  ```
* `.min(property: string, whole?: boolean)` - Finds the minimum value of a property in array.  
  ```javascript
  jsoq.from(data).min('age'); //-> 21
  jsoq.from(data).min('age', true); //-> jsoq
  ```
* `.sum(property: string)` - Computes the summation of a property in array.  
  ```javascript
  jsoq.from(data).sum('age'); //-> 68
  ```

### Filtering
* `.between(property: string, range: [min: any, max: any])` - Takes only the objects which are greater than first value in range and smaller than the second.  
  ```javascript
  jsoq.from(data).between('age', [10, 20]); //-> jsoq
  jsoq.from(data).between('name', ['A', 'B']); //-> jsoq
  ```
* `.distinct(property?: string)` - Keeps only the first occurrence of a property in each object in array.  
  ```javascript
  jsoq.from(data).distinct(); //-> jsoq
  jsoq.from(data).distinct('age'); //-> jsoq
  ```
* `.first(n?: number)` - Takes n objects from the beginning of array.  
  ```javascript
  jsoq.from(data).first(); //-> jsoq
  jsoq.from(data).first(3); //-> jsoq
  ```
* `.ilike(property: string, values: string | string[])` - Takes only the objects which match at list one pattern (case insensitive).  
  ```javascript
  jsoq.from(data).ilike('name', 'sha%'); //-> jsoq
  jsoq.from(data).ilike('name', ['sha%', '%ro%']); //-> jsoq
  ```
* `.in(property: string, values: any[])` - Takes only the objects which property value exists in given array.  
  ```javascript
  jsoq.from(data).in('index', [1, 2]); //-> jsoq
  ```
* `.last(n?: number)` - Takes n objects from the end of array.  
  ```javascript
  jsoq.from(data).last(); //-> jsoq
  jsoq.from(data).last(2); //-> jsoq
  ```
* `.like(property: string, values: string | string[])` - Takes only the objects which match at list one pattern (case sensitive).  
  ```javascript
  jsoq.from(data).like('name', 'Sha%'); //-> jsoq
  jsoq.from(data).like('name', ['Sha%', '%ro%']); //-> jsoq
  ```
* `.nth(n: number)` - Takes the nth object from array.  
  ```javascript
  jsoq.from(data).nth(4); //-> jsoq
  ```
* `.skip(n: number)` - Takes all objects from array, except of the first n objects.  
  ```javascript
  jsoq.from(data).skip(2); //-> jsoq
  ```
* `.where(predicate: any)` - Takes only the objects which match the predicate.  
  ```javascript
  jsoq.from(data).where({ age: 32 }); //-> jsoq
  jsoq.from(data).where('isActive'); //-> jsoq
  jsoq.from(data).where(o => o.age === 32 || o.isActive); //-> jsoq
  ```
### Manipulation
* `.group(property: string)` - Transforms array into a dictionary which composed of keys generated from the array.  
  ```javascript
  jsoq.from(data).group('age'); //-> { '21': [{}, {}...], '32': [{}...] }
  ```
* `.join(json: any[], property: string)` - Changes the order of all properties in array.  
  ```javascript
  jsoq.from(data).join(data2, 'index'); //-> jsoq
  ```
* `.leftJoin(json: any[], property: string)` - Changes the order of all properties in array.  
  ```javascript
  jsoq.from(data).leftJoin(data2, 'index'); //-> jsoq
  ```
* `.order(property: string)` - Changes the order of all properties in array.  
  ```javascript
  jsoq.from(data).order('index'); //-> jsoq
  ```
* `.rightJoin(json: any[], property: string)` - Changes the order of all properties in array.  
  ```javascript
  jsoq.from(data).rightJoin(data2, 'index'); //-> jsoq
  ```
* `.select(property: string)` - Extracts specific properties from all objects in array.  
  ```javascript
  jsoq.from(data).order('index asc', 'age', 'isActive desc'); //-> jsoq
  ```

## Comments
* All methods which return jsoq are chainable, hence `.toJSON()` should be called when you're ready to get the output.  
* `first`, `last` and `nth` functions return `jsoq` and not a single object, to enable chaining and for the sake of consistency. 
* Check __tests__ directory for examples.