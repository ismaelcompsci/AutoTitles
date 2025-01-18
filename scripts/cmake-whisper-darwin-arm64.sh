#!/bin/bash

CURRENT_DIR="$(dirname "$0")"


WHISPER_DIR="${CURRENT_DIR}/../whisper.cpp"
BUILD_DIR="${CURRENT_DIR}/../out/build-darwin-arm64"

echo "CURRDIR: $CURRENT_DIR"
echo "CURRDIR: $WHISPER_DIR"
echo "CURRDIR: $BUILD_DIR"

cmake -S "$WHISPER_DIR" -B "$BUILD_DIR"
cmake --build "$BUILD_DIR" --config Release