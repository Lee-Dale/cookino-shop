#!/usr/bin/env bash
set -euo pipefail

# Deploy built Vite app to S3 and invalidate CloudFront
# Usage: ./scripts/deploy-to-s3.sh <BUCKET> <CLOUDFRONT_ID> <API_URL> [AWS_PROFILE]
# Example: ./scripts/deploy-to-s3.sh my-bucket ABCDEFGHIJKL https://api.example.com default

if [ "$#" -lt 3 ]; then
  echo "Usage: $0 <S3_BUCKET> <CLOUDFRONT_ID> <API_URL> [AWS_PROFILE]"
  exit 2
fi

S3_BUCKET="$1"
CLOUDFRONT_ID="$2"
API_URL="$3"
AWS_PROFILE="${4:-default}"

echo "Building production bundle with VITE_API_BASE_URL=${API_URL}"
# Set env var for Vite build
export VITE_API_BASE_URL="${API_URL}"

npm run build

# Upload files to S3. Use long cache for assets, but prevent caching of index.html
echo "Syncing files to s3://${S3_BUCKET}"
# Upload all files with far-future caching
aws s3 sync dist/ s3://${S3_BUCKET} \
  --profile "${AWS_PROFILE}" \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "index.html"

# Upload index.html with no-cache so new deploys are picked up immediately
aws s3 cp dist/index.html s3://${S3_BUCKET}/index.html \
  --profile "${AWS_PROFILE}" \
  --cache-control "no-cache, max-age=0, must-revalidate"

# Create CloudFront invalidation so users get latest files immediately
if [ -n "${CLOUDFRONT_ID}" ]; then
  echo "Creating CloudFront invalidation for distribution ${CLOUDFRONT_ID}"
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_ID}" \
    --paths "/*" \
    --profile "${AWS_PROFILE}"
fi

echo "Deploy complete."
