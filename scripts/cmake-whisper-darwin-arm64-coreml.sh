#!/bin/bash

CURRENT_DIR="$(dirname "$0")"

WHISPER_DIR="${CURRENT_DIR}/../whisper.cpp"
BUILD_DIR="${CURRENT_DIR}/../out/build-darwin-arm64-coreml"

cmake -S "$WHISPER_DIR" -B "$BUILD_DIR" -D WHISPER_COREML=1
cmake --build "$BUILD_DIR" --config Release