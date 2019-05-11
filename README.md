# jsoq
Query and manipulate JSON arrays.

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
  - `jsoq.from(data); //-> jsoq object`
* `.toJSON(flatten?: boolean)` - Returns current state of input json array.  
  - `jsoq.from(data).toJSON(); //-> [{}, {}, ...]`
  - `jsoq.from(data).first().toJSON(true); //-> {}`
* `.toString()` - Returns current state of input json array as string.  
  - `jsoq.from(data).toString(); //-> "[{}, {}, ...]"`

### Aggregation
* `.avg(property: string)` - Computes the average value of a property in array.  
  - `jsoq.from(data).avg('index'); //-> 3.5`
* `.count()` - Computes the number of objects in array.  
  - `jsoq.from(data).count(); //-> 6`
* `.max(property: string, whole?: boolean)` - Finds the maximum value of a property in array.  
  - `jsoq.from(data).max('age'); //-> 40`
  - `jsoq.from(data).max('age', true); //-> jsoq object`
* `.min(property: string, whole?: boolean)` - Finds the minimum value of a property in array.  
  - `jsoq.from(data).min('age'); //-> 21`
  - `jsoq.from(data).min('age', true); //-> jsoq object`
* `.sum(property: string)` - Computes the summation of a property in array.  
  - `jsoq.from(data).sum('age'); //-> 68`

### Filtering
* `.distinct(property?: string)` - Keeps only the first occurrence of a property in each object in array.  
  - `jsoq.from(data).distinct(); //-> jsoq object`
  - `jsoq.from(data).distinct('age'); //-> jsoq object`
* `.first(n?: number)` - Takes n objects from the beginning of array.  
  - `jsoq.from(data).first(); //-> jsoq object`
  - `jsoq.from(data).first(3); //-> jsoq object`
* `.in(property: string, values: any[])` - Takes only the objects in array which property value exists in given array.  
  - `jsoq.from(data).in('index', [1, 2]); //-> jsoq object`
* `.last(n?: number)` - Takes n objects from the end of array.  
  - `jsoq.from(data).last(); //-> jsoq object`
  - `jsoq.from(data).last(2); //-> jsoq object`
* `.nth(n: number)` - Takes the nth object from array.  
  - `jsoq.from(data).nth(4); //-> jsoq object`
* `.skip(n: number)` - Takes all objects from array, except of the first n objects.  
  - `jsoq.from(data).skip(2); //-> jsoq object`
* `.where(predicate: any)` - Takes only the objects in array which match the predicate.  
  - `jsoq.from(data).where({ age: 32 }); //-> jsoq object`
  - `jsoq.from(data).where('isActive'); //-> jsoq object`
  - `jsoq.from(data).where(o => o.age === 32 || o.isActive); //-> jsoq object`

### Manipulation
* `.group(property: string)` - Transforms array into a dictionary which composed of keys generated from the array.  
  - `jsoq.from(data).group('age'); //-> { '21': [{}, {}...], '32': [{}...] }`
* `.join(json: any[], property: string)` - Changes the order of all properties in array.  
  - `jsoq.from(data).join(data2, 'index'); //-> jsoq object`
* `.leftJoin(json: any[], property: string)` - Changes the order of all properties in array.  
  - `jsoq.from(data).leftJoin(data2, 'index'); //-> jsoq object`
* `.order(property: string)` - Changes the order of all properties in array.  
  - `jsoq.from(data).order('index'); //-> jsoq object`
* `.rightJoin(json: any[], property: string)` - Changes the order of all properties in array.  
  - `jsoq.from(data).rightJoin(data2, 'index'); //-> jsoq object`
* `.select(property: string)` - Extracts specific properties from all objects in array.  
  - `jsoq.from(data).order('index', 'age', 'isActive'); //-> jsoq object`

## Comments
* **manipulation**(\*) and **filtering** methods are chainable, hence `.toJSON()` should be called when you're ready to get the output.  
(\* - except `group` function).
* `first`, `last` and `nth` functions return `jsoq` and not a single object, to enable chaining and for the sake of consistency. 
* Check __tests__ directory for examples.