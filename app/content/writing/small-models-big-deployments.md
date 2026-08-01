---
title: Small Models, Big Deployments
slug: small-models-big-deployments
date: 2026-08-01
tags: [ai, architecture, cost]
excerpt: The default reflex is to reach for the biggest model available. For a lot of real enterprise work, that is the expensive, slow, and less private choice.
draft: true
---

There is a reflex in most AI projects: reach for the biggest, most capable model
available, and route everything through it. It feels safe. It is often the wrong
call. A large share of real enterprise work does not need frontier intelligence.
It needs a competent model that is small, fast, cheap, and running somewhere you
control.

## The case nobody makes in the demo

Demos are built to impress, so they use the largest model. Production is built to
survive, and production has different priorities: latency, cost per call, data
residency, and reliability under load. On every one of those, a well-chosen small
model, sometimes running on your own hardware or even on the device, quietly wins.

Classifying a document, extracting fields, routing a ticket, drafting a
templated reply, checking a form: these are high-volume, bounded tasks. A small
model fine-tuned on your data does them faster and cheaper than a giant
general-purpose model, and it does not send your sensitive data to someone
else's cloud to do it.

## Why this matters more now

Two forces make small models a serious strategy, not a compromise. Small models
have become genuinely capable, closing much of the gap on narrow tasks. And the
cost and privacy pressures of running everything through a frontier API have
become real line items on the P&L and real questions from your risk committee.

The mature architecture is not "one big model for everything." It is a portfolio:
a small model for the routine high-volume work, a large model reserved for the
genuinely hard reasoning, and a router that sends each request to the cheapest
model that can do the job.

## What to do now

1. **Audit your traffic.** Most requests are routine. Measure what share truly
   needs frontier reasoning. It is usually smaller than the team assumes.
2. **Default small, escalate to large.** Make the big model the exception you
   reach for, not the default you pay for on every call.
3. **Treat privacy as architecture.** For sensitive data, a model you run is not
   a nice-to-have. It is the difference between a yes and a no from compliance.

Bigger is not a strategy. It is a default, and defaults are where money and trust
quietly leak.

So before your next model decision: how much of your workload is paying frontier
prices for routine work?
