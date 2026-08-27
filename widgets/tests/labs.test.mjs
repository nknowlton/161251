import test from 'node:test';
import assert from 'node:assert/strict';

import { fUpperTail, makePoints, ols, pointInPolygon } from '../js/labs.js';

test('makePoints is deterministic for a fixed seed', () => {
  const first = makePoints(8, 1, 2, 0.4, 17, 'clean');
  const second = makePoints(8, 1, 2, 0.4, 17, 'clean');
  assert.deepEqual(first, second);
});

test('ordinary least squares recovers an exact line', () => {
  const points = [
    { x: -2, y: 3 },
    { x: -1, y: 5 },
    { x: 0, y: 7 },
    { x: 1, y: 9 },
    { x: 2, y: 11 }
  ];
  const fit = ols(points);
  assert.ok(Math.abs(fit.intercept - 7) < 1e-12);
  assert.ok(Math.abs(fit.slope - 2) < 1e-12);
  assert.ok(Math.abs(fit.rss) < 1e-12);
  assert.ok(Math.abs(fit.r2 - 1) < 1e-12);
});

test('weighted least squares gives a higher-weight point more influence', () => {
  const points = [
    { x: 0, y: 0, weight: 1 },
    { x: 1, y: 0, weight: 1 },
    { x: 2, y: 10, weight: 1 }
  ];
  const ordinary = ols(points);
  const weighted = ols(points, 'weight');
  points[2].weight = 20;
  const emphasised = ols(points, 'weight');
  assert.ok(emphasised.slope > ordinary.slope);
  assert.ok(emphasised.slope > weighted.slope);
});

test('sample size changes density without changing the synthetic x range', () => {
  const small = makePoints(12, 0, 1, 0.5, 12, 'clean');
  const large = makePoints(70, 0, 1, 0.5, 12, 'clean');
  assert.equal(small[0].x, large[0].x);
  assert.equal(small.at(-1).x, large.at(-1).x);
  assert.equal(small.length, 12);
  assert.equal(large.length, 70);
});

test('diagnostic generators create a fan and serial dependence', () => {
  const fan = makePoints(200, 0, 1, 1, 22, 'fan', 1.2);
  const leftSpread = fan.slice(0, 40).reduce((sum, p) => sum + Math.abs(p.error), 0) / 40;
  const rightSpread = fan.slice(-40).reduce((sum, p) => sum + Math.abs(p.error), 0) / 40;
  assert.ok(rightSpread > leftSpread * 2);

  const serial = makePoints(200, 0, 1, 1, 22, 'autocorrelation', 1.1).map(p => p.error);
  const lagProduct = serial.slice(1).reduce((sum, value, i) => sum + value * serial[i], 0);
  const variance = serial.reduce((sum, value) => sum + value * value, 0);
  assert.ok(lagProduct / variance > 0.65);
});

test('F upper-tail probabilities are calibrated and decrease with F', () => {
  assert.ok(Math.abs(fUpperTail(4.9646, 1, 10) - 0.05) < 0.0002);
  assert.ok(fUpperTail(8, 3, 28) < fUpperTail(2, 3, 28));
});

test('lasso polygon identifies points inside its boundary', () => {
  const polygon = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }];
  assert.equal(pointInPolygon({ x: 5, y: 5 }, polygon), true);
  assert.equal(pointInPolygon({ x: 12, y: 5 }, polygon), false);
});
