// Deterministic weather progression for the browser simulator.
// wetness is 0 (dry) to 1 (fully wet); intensity can be 0 to 1.5.
const clamp01 = value => Math.max(0, Math.min(1, Number(value) || 0));

const STATIC_PRESETS = Object.freeze({
  clear: Object.freeze({ wetness: 0, rain: 0, label: 'Dry' }),
  cloudy: Object.freeze({ wetness: 0.04, rain: 0, label: 'Cloudy' }),
  'light-rain': Object.freeze({ wetness: 0.38, rain: 0.38, label: 'Light rain' }),
  'heavy-rain': Object.freeze({ wetness: 0.88, rain: 0.82, label: 'Heavy rain' }),
});

const CYCLE_SECONDS = Object.freeze({ off: 0, slow: 480, normal: 240, fast: 120 });

export function weatherAtTime({ mode = 'clear', evolution = 'off', elapsed = 0, intensity = 1 } = {}) {
  const strength = Math.max(0, Math.min(1.5, Number(intensity) || 0));
  let target = STATIC_PRESETS[mode] || STATIC_PRESETS.clear;
  const cycle = CYCLE_SECONDS[evolution] ?? 0;
  if (cycle > 0) {
    const phase = ((Number(elapsed) || 0) % cycle) / cycle;
    if (phase < 0.25) target = { wetness: 0.02, rain: 0, label: 'Dry' };
    else if (phase < 0.5) target = { wetness: 0.36, rain: 0.34, label: 'Light rain' };
    else if (phase < 0.75) target = { wetness: 0.88, rain: 0.9, label: 'Heavy rain' };
    else target = { wetness: 0.52, rain: 0.42, label: 'Showers' };
  } else if (mode === 'changing') {
    target = STATIC_PRESETS['light-rain'];
  }
  return {
    wetness: Math.min(1, clamp01(target.wetness) * strength),
    rain: Math.max(0, Number(target.rain) || 0) * strength,
    label: target.label,
  };
}
