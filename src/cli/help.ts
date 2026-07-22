export const HELP = `SumiJS — lightweight ASCII art for text and images

Usage:
  sumijs "HELLO" [options]
  sumijs --text "HELLO" [options]
  sumijs --image ./logo.png --width 60 [options]
  echo "HELLO" | sumijs

Text options:
  --font <name>              block, slant, shadow, mini, three-d
  --layout <mode>            full, fitted, smushed
  --align <mode>             left, center, right
  --width <columns>          exact output width
  --max-width <columns>      maximum output width
  --overflow <mode>          preserve, clip, wrap
  --line-spacing <count>
  --letter-spacing <count>

Image options:
  --image <file-or-url>
  --charset <name>           minimal, standard, detailed, blocks, binary
  --characters <ramp>
  --width <columns>
  --height <rows>
  --sampling <mode>          average, nearest
  --invert --grayscale --color
  --background <color>
  --contrast <number> --brightness <number> --gamma <number>
  --dither --cell-ratio <number>

Style and output:
  --color <color>
  --gradient <a,b,...>
  --gradient-direction <horizontal|vertical|diagonal>
  --color-level <0|1|2|3>
  --border <single|double|rounded|heavy>
  --padding <count> --margin <count>
  --frame-title <text> --frame-title-align <mode>
  --format <plain|ansi|html|svg|json>
  --out <file> --force --mkdir --final-newline

Utilities:
  --list-fonts
  --preview-font <name>
  --help
  --version

Examples:
  sumijs "HELLO" --font slant --gradient "#00c6ff,#7c3aed,#ec4899"
  sumijs "SUMI" --format svg --out logo.svg
  sumijs --image ./logo.png --width 60 --color

Image decoding in Node uses the optional sharp package. Install it with:
  npm install sharp

Exit codes: 0 success, 1 invalid input or rendering failure, 2 output-file conflict.
`
