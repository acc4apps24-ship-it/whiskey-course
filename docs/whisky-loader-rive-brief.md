# Whisky Journey Rive Loader Brief

## Goal

Create a premium animated loading screen that feels like opening a bottle before
a tasting, not like waiting for an app.

## Art Direction

Make an illustration, not a photograph. The visual style should feel like a
premium magazine illustration inspired by Scottish whisky advertising from the
1940s-1960s.

Composition:

- Mobile-first vertical scene, recommended working size 1080x1920.
- Foreground: crystal tumbler with amber whisky on a wooden table.
- Top edge: only the neck of a collectible bottle enters the frame.
- A slow whisky stream pours from the bottle into the glass.
- Lighting: theatrical still life, one warm light source.
- Background: almost black, with soft bokeh and no clear objects.
- Mood: quiet ritual, anticipation, warmth, restraint.

## Animation

Loop duration: 4 seconds.

Motion should be subtle:

- Continuous whisky stream.
- Gentle liquid surface movement.
- Rare glass highlights.
- A final small drop or ripple near the end of the loop.
- No camera movement.
- No moving table, glass position, or background objects.

Timeline:

- 0.0-0.8s: whisky stream appears and starts flowing smoothly.
- 0.8-2.5s: liquid level rises slightly, surface moves.
- 2.5-3.2s: final drop and small ripple.
- 3.2-4.0s: stream becomes thinner, small gold highlight passes across glass.

## Required Layers

Separate layers for animation:

- `background`: black bokeh and light spot, static.
- `table`: wooden table, static.
- `bottle`: bottle neck and glass highlights, static or near-static.
- `pour_stream`: animated whisky stream.
- `whisky_liquid`: liquid inside glass.
- `surface_ripples`: subtle waves/ripples.
- `glass`: crystal tumbler lines and refractions.
- `ice`: optional single cube, very subtle.
- `fx_highlights`: rare gold and glass glints.

## Rive Contract

File path in the app:

```text
public/rive/whisky-journey-loader.riv
```

Artboard:

```text
Loader
```

State machine:

```text
LoaderLoop
```

Animation:

```text
PourLoop
```

The animation must autoplay and loop without requiring inputs.

## Palette

- Background: `#080A09`
- Shadows: `#171310`
- Wood: `#5C3820`
- Whisky: `#C97914`
- Warm highlight: `#E5B24A`
- Glass highlight: `#F8EED9`

## Technical Requirements

- Format: `.riv`
- Target: mobile web, Safari and Chrome on iPhone 12+
- Keep file light; avoid unnecessary meshes or heavy bitmap textures.
- Prefer vector shapes and gradients.
- 60 FPS should feel smooth, but motion must remain quiet.
- Must look acceptable on dark background before the rest of the app loads.
- Do not include text inside the Rive file; the app renders text separately.

