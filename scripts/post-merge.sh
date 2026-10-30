#!/bin/bash
set -e

echo "[post-merge] Installing dependencies..."
pnpm install --frozen-lockfile

echo "[post-merge] Building api-server..."
pnpm --filter @workspace/api-server run build

echo "[post-merge] Building nempo-garut..."
NODE_ENV=production pnpm --filter @workspace/nempo-garut run build

echo "[post-merge] Building admin-panel..."
NODE_ENV=production pnpm --filter @workspace/admin-panel run build

echo "[post-merge] Done."
