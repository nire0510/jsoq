import jsoq from '../index';
const json = require('./data.json');

test('avg', () => {
  expect(jsoq.from(json).avg('index')).toBe(2.5);
});

test('count', () => {
  expect(jsoq.from(json).count()).toBe(6);
});

test('max', () => {
  expect(jsoq.from(json).max('index', true)).toBe(5);
  expect(Object.keys(jsoq.from(json).max('index').json()[0]).length).toBeGreaterThan(1);
});

test('min', () => {
  expect(jsoq.from(json).min('index', true)).toBe(0);
  expect(Object.keys(jsoq.from(json).min('index').json()[0]).length).toBeGreaterThan(1);
});

test('sum', () => {
  expect(jsoq.from(json).sum('index')).toBe(15);
});
