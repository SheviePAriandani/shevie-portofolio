#!/usr/bin/env bash
# Mengecilkan foto dan menghapus EXIF/GPS (butuh ImageMagick).
# Pakai: tools/optimize-images.sh foto-asli.jpg assets/images/profile/portrait.jpg
set -euo pipefail
if [ "$#" -ne 2 ]; then echo "Pakai: $0 input output"; exit 1; fi
magick "$1" -auto-orient -resize 1600x -strip -quality 82 "$2"
echo "Selesai: $2"
