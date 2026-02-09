#!/usr/bin/env bash
# Fire sample events for one influencer so you can test the Partner Dashboard numbers.
# Usage:
#   Local:  ./scripts/test-dashboard-stats.sh http://localhost:8888
#   Deploy: ./scripts/test-dashboard-stats.sh https://YOUR-SITE.netlify.app

BASE_URL="${1:-http://localhost:8888}"
ENDPOINT="${BASE_URL}/.netlify/functions/track-referral"

echo "Sending sample events for MAGIC25M (Magic Master) to: $ENDPOINT"
echo ""

# 3 clicks
for i in 1 2 3; do
  curl -s -X POST "$ENDPOINT" -H "Content-Type: application/json" \
    -d '{"referral_code":"MAGIC25M","eventType":"click","amount":0}' | jq -c . 2>/dev/null || true
done
echo "3 clicks sent"

# 1 unlock
curl -s -X POST "$ENDPOINT" -H "Content-Type: application/json" \
  -d '{"referral_code":"MAGIC25M","eventType":"unlock","amount":0}' | jq -c . 2>/dev/null || true
echo "1 unlock sent"

# 1 payment ($19.99 = 1999 cents)
curl -s -X POST "$ENDPOINT" -H "Content-Type: application/json" \
  -d '{"referral_code":"MAGIC25M","eventType":"payment","amount":1999}' | jq -c . 2>/dev/null || true
echo "1 payment sent ($19.99)"

echo ""
echo "Done. Log in at ${BASE_URL}/influencer-dashboard with MAGIC25M and your dashboard password to see the numbers."
