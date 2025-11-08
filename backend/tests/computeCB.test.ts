import { computeComplianceBalance } from '../src/core/application/usecases/computeCB';

test('compute CB positive surplus', () => {
  const actual = 88.0;
  const fc = 1000;
  const cb = computeComplianceBalance(actual, fc, 89.3368);
  // if actual < target => positive
  expect(cb).toBeGreaterThan(0);
});

test('compute CB negative deficit', () => {
  const actual = 95.0;
  const fc = 1000;
  const cb = computeComplianceBalance(actual, fc, 89.3368);
  expect(cb).toBeLessThan(0);
});
