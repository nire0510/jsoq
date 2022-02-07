import jsoq from '../index';

test('parse', () => {
  expect(JSON.stringify(jsoq.from([{ a: 1 }]).json())).toBe('[{"a":1}]');
});

test('from', () => {
  expect(jsoq.from([{ a: 1 }])).toHaveProperty('first');
});

test('string', () => {
  expect(jsoq.from([{ a: 1 }]).string()).toBe('[{"a":1}]');
});
