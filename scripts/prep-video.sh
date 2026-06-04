#!/usr/bin/env bash
# Transcode Carolina's hero "Medusa" videos into web-optimized cuts + posters.
#
# Sources (probed 2026-05-21):
#   01 Medusas horizontal dark 2.0.mp4   2560x1440 30fps  8.0s  h264+aac
#   01 Medusas horizontal light 2.0.mp4  2560x1440 30fps 13.8s  h264+aac
#   02 Medusa Vertical Dark.mp4          1440x2560 30fps  8.0s  h264+aac
#   02 Medusa Vertical Light.mp4         1440x2560 30fps 12.3s  h264+aac
#
# Output: public/video/{hero-h-dark,hero-h-light,hero-v-dark,hero-v-light}.mp4 (+ -poster.jpg)
# Horizontal downscaled to max 1920w (1080p); vertical to max 1080w. Audio dropped (-an).
# Metadata stripped with exiftool (privacy rule).
set -euo pipefail

SRC="${1:-/home/jorius/Downloads/wetransfer_finales_2026-05-21_0231/FINALES}"
OUT="public/video"
mkdir -p "$OUT"

transcode () { # $1 source filename  $2 output basename  $3 max width
  ffmpeg -y -i "$SRC/$1" -an -vf "scale='min($3,iw)':-2" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset medium -movflags +faststart \
    "$OUT/$2.mp4"
  ffmpeg -y -ss 0.5 -i "$OUT/$2.mp4" -frames:v 1 -q:v 4 "$OUT/$2-poster.jpg"
  exiftool -all= -overwrite_original "$OUT/$2.mp4" "$OUT/$2-poster.jpg" >/dev/null
}

transcode "01 Medusas horizontal dark 2.0.mp4"  hero-h-dark  1920
transcode "01 Medusas horizontal light 2.0.mp4" hero-h-light 1920
transcode "02 Medusa Vertical Dark.mp4"         hero-v-dark  1080
transcode "02 Medusa Vertical Light.mp4"        hero-v-light 1080

echo "=== output sizes ==="
ls -lh "$OUT"
