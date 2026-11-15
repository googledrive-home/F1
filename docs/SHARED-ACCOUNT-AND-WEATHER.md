# Shared Home account and dynamic weather

This document covers the F1 Simulator changes on the `shared-account-integration` branch.

## Shared Home account

The existing driver-profile panel now includes a Home gaming account connection.

When F1 is launched from a signed-in Google Drive Home session:
1. Home requests a short-lived one-time code from `POST /account/bridge`.
2. Home opens `https://f1.gokart.games/#home_code=<code>`.
3. F1 reads the code from the URL fragment and removes it from browser history.
4. F1 exchanges it with `POST /account/bridge/exchange`.
5. F1 stores the returned account session in `sessionStorage` and loads `GET /account/me`.

The hand-off code is single-use and expires after two minutes. The long-lived bearer session is not put in the URL. Players can also connect manually in the driver-profile panel using their Home username and password. The resulting token is kept for the current browser tab only.

The existing local driver portrait remains local to the device. The Home account supplies the player identity and displays level, XP and Credits.

## Dynamic weather

The weather control cycles through:
- Dynamic
- Dry
- Cloudy
- Light rain
- Heavy rain

Dynamic weather progresses with simulation time through clear conditions, cloud, light rain, heavier rain and drying conditions. The current mode is also selectable with the `weather` query parameter.

Weather modifies the track surface callback passed into the existing race physics. Wetness reduces base road grip and is included in each tyre contact. Tyre compounds now include:
- Soft, medium and hard (dry compounds)
- Intermediate
- Wet

Dry compounds lose grip as the surface gets wetter; intermediate and wet compounds gain relative grip. The player's pit-request cycle (B) includes the new compounds. AI drivers request medium, intermediate or wet tyres as the track wetness changes, when a pit lane is available.

Rain uses a small quality-scaled Three.js particle field. Cloud coverage, lighting and fog respond to rain while retaining the existing sky and time-of-day system.

Weather grip coefficients are illustrative game parameters, not measured vehicle or tyre data. Tests are in `test/weather.test.mjs`.


## Career and championship progression

The existing main menu adds Quick Race, Career Season and Championship modes. Career and championship modes use a five-round calendar built from existing circuit definitions (Bahrain, Monaco, Silverstone, Spa-Francorchamps and Monza, rotated between seasons).

After all drivers finish or retire, the player and AI classification is recorded:
- Race position and finish status.
- Points using a configurable 25–18–15–12–10–8–6–4–2–1 scale.
- Wins and podiums.
- Best lap and total race time where available.
- Weather conditions for the round.
- Per-driver season standings.

Career mode keeps lifetime starts, wins, podiums, points, championships and best lap. A completed career season is archived, and a new season can be started. Championship mode runs a separate series.

Progress is stored locally and, when a Home account is connected, in the existing private `/account/saves/f1-simulator` cloud-save slot. The Home website reads that save to show F1 career statistics and the team name on the player dashboard.

**Race results in this first version are client-reported career records. They are not independently validated by the Home server and do not yet award platform XP or Credits.** A trusted race-result validation service is needed before competitive rewards or verified F1 leaderboards can use them.

## Custom racing team

The driver-profile panel includes a custom team editor for team name, primary car colour, accent colour and helmet colour. The selected livery is applied to the player's car at the next simulator reload and saved with the Home cloud career when signed in. The existing car model and materials are reused; the opponent liveries remain unchanged.


## Race replay

A completed session can be reviewed from the pause menu. The recorder captures compact car pose, body movement, wheel speed, steering, DRS and weather snapshots at approximately 8 Hz, retaining up to eight minutes in memory.

The replay viewer supports play/pause, timeline scrubbing, 0.5×/1×/2×/4× speed and the simulator's existing camera controls. It reuses the live Three.js car models and track rather than recording video files. Replay data is currently session-memory only and is not uploaded to Home cloud storage.


## Replay recording finish boundary

Replay recording stops after capturing the first snapshot in which every driver has finished or retired. The eight-minute in-memory buffer therefore does not keep filling with post-race movement.
