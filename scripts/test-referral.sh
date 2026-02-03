#!/usr/bin/env bash
# Test referral tracking for one person (Magic Master / MAGIC25M).
# Usage:
#   Local:  ./scripts/test-referral.sh http://localhost:8888
#   Deploy: ./scripts/test-referral.sh https://YOUR-SITE.netlify.app

BASE_URL="${1:-http://localhost:8888}"
ENDPOINT="${BASE_URL}/.netlify/functions/track-referral"

echo "Testing track-referral at: $ENDPOINT"
echo "Referral code: MAGIC25M (Magic Master)"
echo ""

curl -s -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"referral_code":"MAGIC25M","eventType":"click","amount":0}' \
  | jq . 2>/dev/null || cat

echo ""
echo "Expected: {\"success\":true,\"influencerId\":\"inf-1\",\"eventType\":\"click\"}"
