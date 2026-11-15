import test from 'node:test';
import assert from 'node:assert/strict';
import { weatherGripMultiplier } from '../src/physics.mjs';
import { createRace } from '../src/race.mjs';
import { createStadiumTrack } from '../src/track.mjs';

test('dry compounds retain their normal grip on a dry track', () => {
  for (const compound of ['soft', 'medium', 'hard', 'intermediate', 'wet']) {
    assert.equal(weatherGripMultiplier(compound, 0), 1);
  }
});

test('dry tyre grip falls as the surface gets wetter', () => {
  const light = weatherGripMultiplier('medium', 0.25);
  const heavy = weatherGripMultiplier('medium', 0.8);
  assert.ok(light < 1);
  assert.ok(heavy < light);
});

test('intermediate and wet tyres gain relative grip in wet conditions', () => {
  const intermediate = weatherGripMultiplier('intermediate', 0.8);
  const wet = weatherGripMultiplier('wet', 0.8);
  assert.ok(intermediate > 1);
  assert.ok(wet > intermediate);
  assert.ok(wet > weatherGripMultiplier('medium', 0.8));
});

test('weather grip input is clamped and unknown compounds are rejected', () => {
  assert.equal(weatherGripMultiplier('medium', -1), 1);
  assert.equal(weatherGripMultiplier('wet', 2), weatherGripMultiplier('wet', 1));
  assert.throws(() => weatherGripMultiplier('unknown', 0.5), RangeError);
});

test('AI drivers request weather-appropriate tyres while player pit choice stays manual', () => {
  const track = createStadiumTrack({ halfStraight: 220, radius: 90, roadWidth: 15 });
  const race = createRace(track);
  race.setWeather(0.7);
  assert.equal(race.entries[0].pitRequest, null);
  assert.equal(race.entries[1].pitRequest, 'wet');
  race.setWeather(0.3);
  assert.equal(race.entries[1].pitRequest, 'intermediate');
  race.setWeather(0.02);
  assert.equal(race.entries[1].pitRequest, 'medium');
});
