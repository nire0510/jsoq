import jsoq from '../index';
const json = require('./data.json');

test('distinct', () => {
  expect(jsoq.from(json).distinct().done().length).toBe(6);
  expect(jsoq.from(json).distinct('gender').done().length).toBe(2);
});

test('first', () => {
  expect(jsoq.from(json).first().done().length).toBe(1);
  expect(jsoq.from(json).first(2).done().length).toBe(2);
});

test('in', () => {
  expect(jsoq.from(json).in('age', [31, 37]).done().length).toBe(2);
});

test('last', () => {
  expect(jsoq.from(json).last().done().length).toBe(1);
  expect(jsoq.from(json).last(2).done().length).toBe(2);
});

test('nth', () => {
  expect(jsoq.from(json).nth(1).index).toBe(1);
});

test('skip', () => {
  expect(jsoq.from(json).skip(2).done().length).toBe(4);
});

test('where', () => {
  expect(jsoq.from(json).where({ gender: 'male' }).done().length).toBe(3);
  expect(jsoq.from(json).where('isActive').done().length).toBe(2);
  expect(jsoq.from(json).where((o: any) => o.eyeColor === 'green' || o.age === 37).done().length).toBe(2);
});
