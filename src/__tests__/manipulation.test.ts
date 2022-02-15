import jsoq from '../index';
const json = require('./data.json');
const json2 = require('./data2.json');

test('group', () => {
  expect(Object.keys(jsoq.from(json).group('gender')).length).toBe(2);
});

test('join', () => {
  const firstObject = jsoq.from(json).join(json2, 'index').first().json()[0];

  expect(firstObject).toHaveProperty('country');

  expect(firstObject.country).toEqual('Saint Vincent and The Grenadines');

  expect(jsoq.from(json).join(json2, 'index').count()).toBe(4);
});

test('leftJoin', () => {
  const firstObject = jsoq.from(json).leftJoin(json2, 'index').nth(1).json()[0];

  expect(firstObject).toHaveProperty('country');

  expect(firstObject.country).toEqual('Nepal');

  expect(jsoq.from(json).leftJoin(json2, 'index').count()).toBe(6);
});

test('order', () => {
  expect(jsoq.from(json).order('index asc').json()[0].index).toBe(0);
  expect(jsoq.from(json).order('index desc').json()[0].index).toBe(5);
  expect(jsoq.from(json).order('gender asc', 'age desc').json()[0].age).toBe(47);
});

test('random', () => {
  expect(typeof jsoq.from(json).random()).toBe('object');
  expect(Object.keys(jsoq.from(json2).random()).length).toBe(5);
});

test('rightJoin', () => {
  expect(jsoq.from(json).rightJoin(json2, 'index').first().json()[0]).toHaveProperty('country');

  expect(jsoq.from(json).rightJoin(json2, 'index').count()).toBe(4);
});

test('select', () => {
  expect(Object.keys(jsoq.from(json).select('bla').json()[0]).length).toBe(0);
  expect(Object.keys(jsoq.from(json).select('index', 'picture').first().json()).length).toBe(1);
  expect(Object.keys(jsoq.from(json).select('index', 'picture').first().json()[0]).join('|')).toEqual('index|picture');
  expect(Object.keys(jsoq.from(json).select('index as i', 'picture as p').first().json()[0]).join('|')).toEqual('i|p');
});

test('shuffle', () => {
  expect(jsoq.from(json).shuffle().count()).toBe(json.length);
});
