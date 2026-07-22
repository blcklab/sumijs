# Command-line interface

The `sumijs` executable renders text or images and writes plain text, ANSI, HTML, SVG, or JSON.

## Run without a global install

```bash
npx sumijs "HELLO"
```

Or install it in a project and use it through an npm script.

## Text input

```bash
sumijs "HELLO"
sumijs --text "HELLO"
echo "HELLO" | sumijs
```

Text options:

```text
--font <block|slant|shadow|mini|three-d>
--layout <full|fitted|smushed>
--align <left|center|right>
--width <columns>
--max-width <columns>
--overflow <preserve|clip|wrap>
--line-spacing <count>
--letter-spacing <count>
```

## Image input

```bash
sumijs --image ./logo.png --width 60 --color
```

Install `sharp` in the project that runs the command:

```bash
npm install sharp
```

Image options:

```text
--charset <minimal|standard|detailed|blocks|binary>
--characters <ramp>
--width <columns>
--height <rows>
--sampling <average|nearest>
--invert
--grayscale
--color
--background <color>
--contrast <number>
--brightness <number>
--gamma <number>
--dither
--cell-ratio <number>
```

## Style and frame options

```bash
sumijs "SUMI" \
  --font slant \
  --gradient "#00c6ff,#7c3aed,#ec4899" \
  --gradient-direction horizontal \
  --border rounded \
  --padding 1
```

## Output files

```bash
sumijs "SUMI" --format svg --out public/sumi.svg --mkdir
```

Supported formats are `plain`, `ansi`, `html`, `svg`, and `json`. When `--format` is omitted, `.txt`, `.ansi`, `.html`, `.svg`, and `.json` output extensions select the matching formatter.

Existing files are protected. Add `--force` only when replacement is intentional.

## Utilities

```bash
sumijs --list-fonts
sumijs --preview-font block
sumijs --version
sumijs --help
```

## Exit codes

- `0` — success.
- `1` — invalid input, decoding failure, or rendering failure.
- `2` — output file already exists.

Use the exit code in CI and build scripts rather than parsing error text.
