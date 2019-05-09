import jsoq from '../index';

test('from', () => {
  expect(jsoq.from([{ a: 1 }])).toHaveProperty('first');
});

test('toString', () => {
  expect(jsoq.from([{ a: 1 }]).toString()).toBe('[{"a":1}]');
});
