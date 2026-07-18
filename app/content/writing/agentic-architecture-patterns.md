---
title: Five Patterns I Keep Reaching For When Designing Agentic Systems
slug: agentic-architecture-patterns
date: 2026-06-15
tags: [build, agentic, architecture]
excerpt: An opinionated tour of the patterns that have survived contact with production across my last five agent builds, and the ones I've stopped reaching for.
draft: true
status: outline
---

> **Status:** outline. Promote to draft once each pattern has at least one
> concrete code or diagram example pulled from a real build.

## Why this post

There's a lot of writing on what agents *are* and very little on what
*shipping* one looks like. I want this post to compress what I've learned
across the AI Interviewer, DigiHire, the no-code platform, and the digital
twin builds, the patterns I keep reaching for, why, and the ones that
sounded good in theory but never made it past the second iteration.

## The argument in one paragraph

Production agentic systems are not built around prompts. They're built around
**five primitives**: a typed contract for the agent's output, a constrained
tool surface, a deterministic orchestrator, a transparent eval harness, and a
graceful interruption model. The model you pick matters less than whether
these five exist. If they don't, scaling the prompt makes the system worse,
not better.

## Pattern 1: Output as schema, not as text

- Why: comparability, queryability, eval-ability all live in structured output.
- How: schema-constrained decoding, structured outputs APIs, JSON-mode + validator + retry loop.
- When NOT to: when the task is genuinely generative (writing, summarization),
  schema is harm.
- Example from the AI Interviewer: rubric-aligned JSON per round, not transcripts.

## Pattern 2: Tools are the API surface, treat them like one

- Why: an agent with too many tools is an agent with no tools.
- How: 5 to 9 tools, named like product features, with explicit pre- and
  postconditions in their descriptions. Version them.
- The mistake: exposing the database schema as 40 micro-tools.

## Pattern 3: Deterministic orchestration around non-deterministic reasoning

- Why: the LLM should choose *what* to do, not *how the system runs*.
- How: state machines, pipelines, or workflow engines on the outside;
  reasoning calls on the inside.
- Reference: Pipecat-style pipelines in the AI Interviewer.

## Pattern 4: Eval harness before scale, not after

- Why: every model swap, prompt edit, and tool change is a silent regression
  risk. Without an eval, you find out from users.
- How: a fixed eval set per agent capability, golden outputs, semantic-diff
  scoring, run-on-PR.
- The honest cost: this takes longer to set up than the agent itself. Do it
  anyway.

## Pattern 5: Interruption is a first-class concern

- Why: real users don't take turns politely. Especially in voice and chat.
- How: barge-in handling, cancellable tool calls, partial-output replay,
  state checkpoints.
- Lesson from the AI Interviewer: this was the difference between "demo" and
  "deploy."

## Patterns I've stopped reaching for

- **Pure ReAct loops with unlimited horizon**, impressive in benchmarks,
  unwieldy in production. Cap the steps; orchestrate the rest.
- **One mega-prompt with everything in it**, readable for a week, then a
  liability forever.
- **"Let the agent decide" as a UX choice**: users want predictability.
  Agents are an implementation detail of the product, not its surface.

## What this implies for teams

- Hire (or grow) a platform engineer before the second model swap.
- Budget for the eval harness like you'd budget for tests, because that's
  what it is.
- Pick a battle-tested orchestrator before you pick a clever model.

---

**Related:** [Real-time Multimodal AI Interviewer](/work/ai-interviewer) · [Enterprise Digital Twin](/work/enterprise-digital-twin)
