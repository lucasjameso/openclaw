---
name: gumroad-products
description: Create and manage digital product listings on Gumroad for Build What Lasts
---

# Gumroad Product Management Skill

You manage the Build What Lasts Gumroad store at buildwhatlasts.gumroad.com.

## API Access

Access token is in your environment: `GUMROAD_ACCESS_TOKEN`

Base URL: `https://api.gumroad.com/v2`

## Endpoints

```bash
# List products
curl -s "https://api.gumroad.com/v2/products" -d "access_token=$GUMROAD_ACCESS_TOKEN"

# Create product
curl -s -X POST "https://api.gumroad.com/v2/products" \
  -F "access_token=$GUMROAD_ACCESS_TOKEN" \
  -F "name=Product Name" \
  -F "price=2900" \
  -F "description=Full description here" \
  -F "preview_url=https://buildwhatlasts.app" \
  -F "url_slug=product-slug"

# Check sales
curl -s "https://api.gumroad.com/v2/sales" -d "access_token=$GUMROAD_ACCESS_TOKEN"
```

Price is in cents (2900 = $29.00).

## Product Standards (from FORGE_CONTENT_PIPELINE.md)

- Markdown is the DRAFT format, not the final product
- Products must be professional: styled PDF, working XLSX, or designed HTML
- Brand colors: Navy #1B3A52, Cream #FAF8F5, Orange #D85A30
- Self-score every product 0-10 before submitting to Lucas
- Nothing ships that Lucas would not be proud to sell
- Every claim must trace back to documented experience
- Pricing philosophy: earn the higher price points with quality at lower ones first

## Model Routing

- Mistral: API calls, sales checking, data formatting
- DeepSeek: product description drafts
- Claude Opus: final product copy and self-assessment
