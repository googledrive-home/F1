import test from 'node:test';
import assert from 'node:assert/strict';
import { weatherAtTime } from '../src/weather.mjs';

test('static weather presets report dry, cloudy, light-rain and heavy-rain conditions', () => {
  assert.deepEqual(weatherAtTime({mode:'clear'}), {wetness:0,rain:0,label:'Dry'});
  assert.deepEqual(weatherAtTime({mode:'cloudy'}), {wetness:0.04,rain:0,label:'Cloudy'});
  assert.deepEqual(weatherAtTime({mode:'light-rain'}), {wetness:0.38,rain:0.38,label:'Light rain'});
  assert.deepEqual(weatherAtTime({mode:'heavy-rain'}), {wetness:0.88,rain:0.82,label:'Heavy rain'});
});

test('evolving weather passes through dry, light rain, heavy rain and showers', () => {
  const expected=['Dry','Light rain','Heavy rain','Showers'];
  const times=[0,60,120,180];
  assert.deepEqual(times.map(elapsed=>weatherAtTime({mode:'changing',evolution:'normal',elapsed}).label),expected);
});

test('changing conditions still evolve when the explicit cycle-speed setting is off', () => {
  assert.equal(weatherAtTime({mode:'changing',evolution:'off',elapsed:0}).label,'Dry');
  assert.equal(weatherAtTime({mode:'changing',evolution:'off',elapsed:60}).label,'Light rain');
  assert.equal(weatherAtTime({mode:'changing',evolution:'off',elapsed:120}).label,'Heavy rain');
});

test('weather evolution speed changes the phase duration', () => {
  assert.equal(weatherAtTime({mode:'clear',evolution:'slow',elapsed:60}).label,'Dry');
  assert.equal(weatherAtTime({mode:'clear',evolution:'normal',elapsed:60}).label,'Light rain');
  assert.equal(weatherAtTime({mode:'clear',evolution:'fast',elapsed:60}).label,'Heavy rain');
  assert.equal(weatherAtTime({mode:'clear',evolution:'off',elapsed:120}).label,'Dry');
});

test('rain intensity scales wetness and visible rainfall without exceeding full wetness', () => {
  const none=weatherAtTime({mode:'heavy-rain',intensity:0});
  const half=weatherAtTime({mode:'heavy-rain',intensity:0.5});
  const full=weatherAtTime({mode:'heavy-rain',intensity:1});
  const boost=weatherAtTime({mode:'heavy-rain',intensity:1.5});
  assert.equal(none.wetness,0);assert.equal(none.rain,0);
  assert.equal(half.wetness,0.44);assert.equal(half.rain,0.41);
  assert.equal(full.wetness,0.88);assert.equal(full.rain,0.82);
  assert.equal(boost.wetness,1);assert.equal(boost.rain,1.23);
});
