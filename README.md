# jsoq
Query and manipulate JSON arrays.

## Installation
`npm i jsoq`

## Usage
```javascript
/*** 1. Import jsoq package: ***/  
import jsoq from 'jsoq';
// or const jsoq = require('jsoq').default;

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
  .done();
//-> [ { a: 2 } ]
```

### Comments
* **manipulation** and **filtering** methods are chainable, hence `.done()` should be called when you're ready to get the output.

## Functions

### Basic
* `.done()` - Returns current state of input json array
* `.from(json: object[])` - Sets the input JSON array
* `.toString()` - Returns current state of input json array as string

### Aggregation
* `.avg(path: string)` - Computes the average value of a property in array
* `.count()` - Computes the number of objects in array
* `.max(path: string, whole?: boolean)` - Finds the maximum value of a property in array
* `.min(path: string, whole?: boolean)` - Finds the minimum value of a property in array
* `.sum(path: string)` - Computes the summation of a property in array.

### Filtering
* `.distinct(property?: string)` - Keeps only the first occurrence of a property in each object in array.
* `.first(n?: number)` - Takes n objects from the beginning of array.
* `.in(property: string, values: any[])` - Takes only the objects in array which property value exists in given array.
* `.last(n?: number)` - Takes n objects from the end of array.
* `.nth(n: number)` - Takes the nth object from array.
* `.skip(n: number)` - Takes all objects from array, except of the first n objects.
* `.where(predicate: any)` - Takes only the objects in array which match the predicate.

### Manipulation
* `.order(property: string)` - Changes the order of all properties in array.
* `.select(property: string)` - Extracts specific properties from all objects in array.