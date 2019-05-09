import jsoq from '../index';
const json = require('./data.json');

test('distinct', () => {
  expect(jsoq.from(json).distinct().json.length).toBe(6);
  expect(jsoq.from(json).distinct('gender').json.length).toBe(2);
});

test('first', () => {
  expect(jsoq.from(json).first().json.length).toBe(1);
  expect(jsoq.from(json).first(2).json.length).toBe(2);
});

test('in', () => {
  expect(jsoq.from(json).in('age', [31, 37]).json.length).toBe(2);
});

test('last', () => {
  expect(jsoq.from(json).last().json.length).toBe(1);
  expect(jsoq.from(json).last(2).json.length).toBe(2);
});

test('nth', () => {
  expect(jsoq.from(json).nth(1).index).toBe(1);
});

test('skip', () => {
  expect(jsoq.from(json).skip(2).json.length).toBe(4);
});

test('where', () => {
  expect(jsoq.from(json).where({ gender: 'male' }).json.length).toBe(3);
  expect(jsoq.from(json).where('isActive').json.length).toBe(2);
  expect(jsoq.from(json).where((o: any) => o.eyeColor === 'green' || o.age === 37).json.length).toBe(2);
});