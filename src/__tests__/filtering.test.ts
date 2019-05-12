import jsoq from '../index';
const json = require('./data.json');

test('between', () => {
  expect(
    jsoq
      .from(json)
      .between('age', [10, 20])
      .count(),
  ).toBe(0);
  expect(
    jsoq
      .from(json)
      .between('age', [10, 30])
      .count(),
  ).toBe(3);
  expect(
    jsoq
      .from(json)
      .between('name', ['A', 'C'])
      .count(),
  ).toBe(1);
});

test('distinct', () => {
  expect(
    jsoq
      .from(json)
      .distinct()
      .toJSON().length,
  ).toBe(6);
  expect(
    jsoq
      .from(json)
      .distinct('gender')
      .toJSON().length,
  ).toBe(2);
});

test('first', () => {
  expect(
    jsoq
      .from(json)
      .first()
      .toJSON().length,
  ).toBe(1);
  expect(
    jsoq
      .from(json)
      .first(2)
      .toJSON().length,
  ).toBe(2);
});

test('ilike', () => {
  expect(
    jsoq
      .from(json)
      .ilike('name', ['%ro%'])
      .toJSON().length,
  ).toBe(2);

  expect(
    jsoq
      .from(json)
      .ilike('name', 'sha%')
      .toJSON().length,
  ).toBe(1);
});

test('in', () => {
  expect(
    jsoq
      .from(json)
      .in('age', [31, 37])
      .toJSON().length,
  ).toBe(2);
});

test('last', () => {
  expect(
    jsoq
      .from(json)
      .last()
      .toJSON().length,
  ).toBe(1);
  expect(
    jsoq
      .from(json)
      .last(2)
      .toJSON().length,
  ).toBe(2);
});

test('like', () => {
  expect(
    jsoq
      .from(json)
      .like('name', ['%ro%'])
      .toJSON().length,
  ).toBe(1);

  expect(
    jsoq
      .from(json)
      .like('name', 'sha%')
      .toJSON().length,
  ).toBe(0);
});

test('nth', () => {
  expect(
    jsoq
      .from(json)
      .nth(1)
      .toJSON()[0].index,
  ).toBe(1);
});

test('skip', () => {
  expect(
    jsoq
      .from(json)
      .skip(2)
      .toJSON().length,
  ).toBe(4);
});

test('where', () => {
  expect(
    jsoq
      .from(json)
      .where({ gender: 'male' })
      .toJSON().length,
  ).toBe(3);
  expect(
    jsoq
      .from(json)
      .where('isActive')
      .toJSON().length,
  ).toBe(2);
  expect(
    jsoq
      .from(json)
      .where((o: any) => o.eyeColor === 'green' || o.age === 37)
      .toJSON().length,
  ).toBe(2);
});
