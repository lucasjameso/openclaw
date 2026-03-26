#!/usr/bin/env node

'use strict';

// Pricing verified on 2026-03-25 from:
// https://claude.com/pricing
// https://www.anthropic.com/news/claude-opus-4-6

const MODELS = {
  sonnet46: {
    name: 'Claude Sonnet 4.6',
    inputPerMTok: 3,
    outputPerMTok: 15,
  },
  opus46: {
    name: 'Claude Opus 4.6',
    inputPerMTok: 5,
    outputPerMTok: 25,
  },
};

const STANDARD_REQUEST = {
  inputTokens: 10_000,
  outputTokens: 2_000,
};

const TYPICAL_LIGHT_REQUEST = {
  inputTokens: 6_000,
  outputTokens: 1_500,
};

const TIERS = [
  {
    name: 'Free',
    price: 0,
    pools: {
      sonnet46: { inputTokens: 50_000, outputTokens: 10_000 },
    },
  },
  {
    name: 'Starter',
    price: 19,
    pools: {
      sonnet46: { inputTokens: 1_000_000, outputTokens: 200_000 },
    },
  },
  {
    name: 'Builder',
    price: 49,
    pools: {
      sonnet46: { inputTokens: 2_000_000, outputTokens: 400_000 },
      opus46: { inputTokens: 500_000, outputTokens: 100_000 },
    },
  },
  {
    name: 'Operator',
    price: 99,
    pools: {
      sonnet46: { inputTokens: 3_000_000, outputTokens: 600_000 },
      opus46: { inputTokens: 1_500_000, outputTokens: 300_000 },
    },
  },
];

function round(value) {
  return Math.round(value * 100) / 100;
}

function costForPool(model, pool) {
  return (
    (pool.inputTokens / 1_000_000) * model.inputPerMTok +
    (pool.outputTokens / 1_000_000) * model.outputPerMTok
  );
}

function costForRequest(model, request) {
  return (
    (request.inputTokens / 1_000_000) * model.inputPerMTok +
    (request.outputTokens / 1_000_000) * model.outputPerMTok
  );
}

function standardQuestions(pool, request) {
  return Math.floor(Math.min(
    pool.inputTokens / request.inputTokens,
    pool.outputTokens / request.outputTokens
  ));
}

function buildTierSummary(tier) {
  let includedCost = 0;
  const pools = {};

  for (const [modelKey, pool] of Object.entries(tier.pools)) {
    const model = MODELS[modelKey];
    const poolCost = costForPool(model, pool);
    includedCost += poolCost;
    pools[modelKey] = {
      ...pool,
      costUsd: round(poolCost),
      standardQuestions: standardQuestions(pool, STANDARD_REQUEST),
    };
  }

  const grossMarginPct = tier.price > 0
    ? round(((tier.price - includedCost) / tier.price) * 100)
    : null;

  return {
    name: tier.name,
    priceUsd: tier.price,
    includedCostUsd: round(includedCost),
    grossMarginPct,
    pools,
  };
}

const requestCosts = Object.fromEntries(
  Object.entries(MODELS).map(([key, model]) => [
    key,
    {
      model: model.name,
      standardRequestCostUsd: round(costForRequest(model, STANDARD_REQUEST)),
      typicalLightRequestCostUsd: round(costForRequest(model, TYPICAL_LIGHT_REQUEST)),
    },
  ])
);

const tiers = TIERS.map(buildTierSummary);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  pricingSourceDate: '2026-03-25',
  standardRequest: STANDARD_REQUEST,
  typicalLightRequest: TYPICAL_LIGHT_REQUEST,
  requestCosts,
  tiers,
}, null, 2));
