---
title: "DigiHire.ai: End-to-End AI Recruitment Platform"
slug: digihire-ai
domain: ai-products
role: Product Architect and Technology Owner
context: Zettamine
scale: Production platform, multi-account
year: 2023-2024
status: shipped
impact: Time-to-hire cut by more than 60%
stack: [LLM, Vector DB, Semantic Search, Chrome Extension, Node.js, Nuxt]
tags: [build, transform, llm, product]
hero: An AI-native recruitment platform that sources, screens and ranks candidates in one loop, and cut time-to-hire by more than 60 percent for pilot accounts.
draft: false
---

## The mandate

I own the product architecture and technology direction for DigiHire.ai, one of
the flagship products at Zettamine. The brief was not a feature bolted onto an
applicant tracking system. It was to redesign the recruitment workflow around
what AI can now do, and to ship something recruiters would trust with a decision
that is expensive to get wrong.

## The problem

Recruitment in most enterprises is three disconnected workflows pretending to be
one: sourcing on professional networks, screening through applicant tracking
systems, and evaluating in spreadsheets. The seams between them eat the bulk of
recruiter time and most of the signal. The premise of DigiHire.ai: collapse the
three into one AI-native loop where the system sources, the system screens, and
the system ranks, with humans intervening on judgment rather than janitorial work.

## Architecture

Three engines under one product.

### 1. Deep-sourcing engine
A custom Chrome extension using segmented scrolling and DOM hydration to extract
structured profile data from professional networks that expose no usable public
API, without tripping anti-bot heuristics. Output is piped into a typed candidate
model, one adapter per source.

### 2. LLM-based semantic screening
Resumes and, when available, interview transcripts are passed through an LLM with
role-specific prompts that return structured evaluations rather than free text.
Every evaluation is vector-indexed for similarity search across the candidate pool.

### 3. Ranking and recommendation
Candidates are ranked against the role profile using a hybrid of semantic
similarity, structured-criterion matching and explicit recruiter weights. Every
rank is explainable down to the contributing signals.

## Key decisions and what they cost

| Decision | Why | What it traded |
|---|---|---|
| Browser-extension sourcing over API ingestion | Coverage of networks with no public API | Brittleness when the DOM changes, contained with an adapter per source |
| Structured LLM evaluation over free text plus parsing | Trust and explainability | Higher prompt-engineering cost up front |
| Hybrid ranking (vector, criterion, weight) over pure vector | Recruiters need to steer the outcome | More moving parts, longer evaluation cycles |

## Outcome

Time-to-hire fell by more than 60 percent for pilot accounts, and every ranking
stayed auditable, which is what turned it from a demo into a system a recruiting
team would actually run.

---

**Related writing:** [The enterprise AI adoption playbook nobody writes](/writing/enterprise-ai-adoption-playbook)
