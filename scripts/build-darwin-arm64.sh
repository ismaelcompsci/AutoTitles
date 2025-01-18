#!/bin/bash

echo "PWD: $(pwd)"

# tsc

rm -rf ./out/build-darwin-arm64
rm -rf ./out/build-darwin-arm64-coreml

sh ./scripts/cmake-whisper-darwin-arm64.sh
sh ./scripts/cmake-whisper-darwin-arm64-coreml.sh

# npm run rm-dist
npm run build