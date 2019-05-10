import jsoq from '../index';

test('toJSON', () => {
  expect(JSON.stringify(jsoq.from([{ a: 1 }]).toJSON())).toBe('[{"a":1}]');
});

test('from', () => {
  expect(jsoq.from([{ a: 1 }])).toHaveProperty('first');
});

test('toString', () => {
  expect(jsoq.from([{ a: 1 }]).toString()).toBe('[{"a":1}]');
});
