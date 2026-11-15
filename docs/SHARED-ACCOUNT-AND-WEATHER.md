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
