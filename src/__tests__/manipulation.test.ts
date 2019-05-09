import jsoq from '../index';
const json = require('./data.json');

test('order', () => {
  expect(jsoq.from(json).order('index asc').json[0].index).toBe(0);
  expect(jsoq.from(json).order('index desc').json[0].index).toBe(5);
  expect(jsoq.from(json).order('gender asc', 'age desc').json[0].age).toBe(37);
});

test('select', () => {
  expect(Object.keys(jsoq.from(json).select('bla').json[0]).length).toBe(0);
  expect(Object.keys(jsoq.from(json).select('index', 'picture').json[0]).length).toBe(2);
});
