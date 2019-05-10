import jsoq from '../index';
const json = require('./data.json');
const json2 = require('./data2.json');

// test('join', () => {
//   expect(
//     Object.keys(jsoq
//       .from(json)
//       .join(json2, 'index')
//     ).length).toBe(2);
// });

test('group', () => {
  expect(
    Object.keys(jsoq
      .from(json)
      .group('gender')
    ).length).toBe(2);
});

test('order', () => {
  expect(
    jsoq
      .from(json)
      .order('index asc')
      .toJSON()[0].index,
  ).toBe(0);
  expect(
    jsoq
      .from(json)
      .order('index desc')
      .toJSON()[0].index,
  ).toBe(5);
  expect(
    jsoq
      .from(json)
      .order('gender asc', 'age desc')
      .toJSON()[0].age,
  ).toBe(37);
});

test('select', () => {
  expect(
    Object.keys(
      jsoq
        .from(json)
        .select('bla')
        .toJSON()[0],
    ).length,
  ).toBe(0);
  expect(
    Object.keys(
      jsoq
        .from(json)
        .select('index', 'picture')
        .toJSON()[0],
    ).length,
  ).toBe(2);
});
