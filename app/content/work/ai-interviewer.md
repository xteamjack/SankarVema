---
title: "Real-Time Audio-Video Human-Interaction Agents"
slug: ai-interviewer
domain: ai-products
role: Architect and Technical Lead
context: Brane Enterprises
scale: Production, sub-second latency budget
year: 2024
status: shipped
impact: Full voice and video screening under a one-second turn budget
stack: [Pipecat, Daily.co, WebRTC, WebSocket, LLM, JSON Schema]
tags: [build, agentic, multimodal, latency]
hero: A voice and video AI that conducts technical, HR and managerial screenings end to end, with sub-second response and structured evaluation output.
draft: false
---

## The mandate

I architected and led the build of a real-time conversational agent that had to
hold a natural voice and video conversation, and produce a structured, comparable
evaluation at the end of it. The hard part was never the language model. It was
building a system that stays conversational under a latency budget most LLM stacks
quietly break.

## The problem

Recruiting teams burn the most expensive hour of every funnel on first-round
screenings. Most candidates do not survive that hour. The work is repetitive, the
rubric is consistent, the conversation is bounded, in other words a textbook job
for an agent. But textbook hides three real problems:

1. **Latency.** Voice conversations break the moment turn-taking lag crosses
   roughly 700 ms. Most LLM stacks are not built for that budget.
2. **Structure.** Hiring teams do not need transcripts. They need a rubric-aligned,
   comparable, structured evaluation per candidate.
3. **Mode.** A real interview is voice plus video plus screen and sometimes code.
   Single-mode bots feel like phone trees.

## The architecture

- **Orchestration:** Pipecat for pipeline-style agent composition (ASR, then
  reasoning, then TTS, with interruption handling).
- **Transport:** Daily.co for WebRTC video and audio with a WebSocket fallback,
  selected over rolling our own to compress build time on a non-differentiating layer.
- **Reasoning core:** the LLM is constrained to a custom evaluation JSON schema
  per candidate and per round, so the output is queryable, comparable and
  rubric-aligned at write time, not parsed after the fact.
- **Latency budget:** a total round-trip target under one second. Optimized
  WebSocket transitions and parallelized ASR and reasoning to keep the floor low.
- **Round routing:** technical, HR and managerial flows are configuration, not
  code, so recruiters compose new flows without engineering.

## Key decisions and what they cost

| Decision | Why | What it traded |
|---|---|---|
| Pipecat over a custom orchestrator | Mature interruption and barge-in semantics out of the box | Some flexibility on novel turn-taking patterns |
| Daily.co over self-hosted WebRTC | Time to production | Per-minute cost above a usage threshold |
| Structured JSON output over free text | Comparability across candidates | Some loss of qualitative texture, contained with a notes field |
| Sub-second target | Conversational naturalness | Forced eager inference and parallelization, and real compute cost |

## Outcome

A screening agent that talks like a person and reports like a rubric. Recruiters
compose the interview flow, the system runs it, and the evaluation lands
structured and comparable across every candidate.

---

**Related writing:** [Five patterns I keep reaching for when designing agentic systems](/writing/agentic-architecture-patterns)
