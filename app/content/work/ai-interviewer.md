---
title: Real-time Multimodal AI Interviewer
slug: ai-interviewer
role: Architect & Lead
year: 2024
status: shipped
stack: [Pipecat, Daily.co, WebRTC, WebSocket, LLM, JSON Schema]
tags: [build, agentic, multimodal, latency]
hero: A voice-and-video AI that conducts technical, HR, and managerial screenings end-to-end — with sub-second response and structured evaluation output.
draft: true
---

## The problem

Recruiting teams burn the most expensive hour of every funnel on first-round
screenings. Most candidates don't survive that hour. The work is repetitive,
the rubric is consistent, the conversation is bounded — in other words,
a textbook job for an agent. But "textbook" hides three real problems:

1. **Latency.** Voice conversations break the moment turn-taking lag crosses
   ~700 ms. Most LLM stacks aren't built for that budget.
2. **Structure.** Hiring teams don't need transcripts — they need a
   rubric-aligned, comparable, structured evaluation per candidate.
3. **Mode.** A real interview is voice + video + screen + (sometimes) code.
   Single-mode bots feel like phone trees.

## The architecture

> _[Architecture diagram — placeholder; insert SVG]_

- **Orchestration:** Pipecat for pipeline-style agent composition (ASR ->
  reasoning -> TTS, with interruption handling).
- **Transport:** Daily.co for WebRTC video/audio + WebSocket fallback,
  selected over rolling our own to compress build time on a non-differentiating layer.
- **Reasoning core:** LLM constrained to a custom evaluation **JSON schema**
  per candidate, per round — so the output is queryable, comparable, and
  rubric-aligned at write time, not parsed after the fact.
- **Latency budget:** total round-trip target of sub-second. Optimized
  WebSocket transitions and parallelized ASR/reasoning to keep the floor low.
- **Round routing:** technical / HR / managerial flows are configuration,
  not code — recruiters compose new flows without engineering.

## Key decisions and what they cost

| Decision | Why | What it traded |
|---|---|---|
| Pipecat over a custom orchestrator | Mature interruption + barge-in semantics out of the box | Some flexibility on novel turn-taking patterns |
| Daily.co over self-hosted WebRTC | Time-to-prod | Per-minute cost above a usage threshold |
| Structured JSON output over free text | Comparability across candidates | Some loss of qualitative texture — mitigated with a `notes` field |
| Sub-second target | Conversational naturalness | Forced eager inference and parallelization — meaningful compute cost |

## What I'd do differently next

> _[To be filled. Specific lessons. The honest ones.]_

## Outcome

> _[To be filled with concrete numbers: candidates screened, time saved,
> hiring-team feedback, false-positive/negative deltas vs. human first round.]_

---

**Related writing:** [Five patterns I keep reaching for when designing agentic systems](/writing/agentic-architecture-patterns)
