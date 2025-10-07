#!/bin/bash

for file in *.mov; do
  # Get filename without extension
  filename="${file%.*}"
  
  # Convert to mp4
  ffmpeg -i "$file" \
    -vf "scale='if(gt(a,1),720,-2)':'if(gt(a,1),-2,720)'" \
    -c:v libx264 -preset slow -crf 23 \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    "${filename}.mp4"
done
