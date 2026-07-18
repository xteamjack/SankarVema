---
title: DigiHire.ai — End-to-End AI Recruitment Platform
slug: digihire-ai
role: Architect & Product Lead
year: 2023–2024
status: shipped
stack: [LLM, Vector DB, Chrome Extension, Semantic Search, Node.js, Nuxt]
tags: [build, transform, llm, product]
hero: An AI-native recruitment ecosystem (sourcing, screening, ranking) that cut time-to-hire by over 60%.
draft: false
---

## The problem

Recruitment in most enterprises is three disconnected workflows pretending to
be one: sourcing on professional networks, screening through ATSes, and
evaluating in spreadsheets. The seams between them eat the bulk of recruiter
time and most of the signal. The premise of DigiHire.ai: collapse the three
into one AI-native loop where the system sources, the system screens, and the
system ranks — with humans intervening on judgment, not janitorial work.

## Architecture

Three engines under one product:

### 1. Deep-scraping sourcing engine
A custom Chrome Extension using segmented scrolling and DOM hydration to
extract structured profile data from professional networks without tripping
anti-bot heuristics. Output piped into a typed candidate model.

### 2. LLM-based semantic screening
Resumes and (when available) interview transcripts are passed through an LLM
with role-specific prompts that return structured evaluations — not free
text. Vector-indexed for similarity search across the candidate pool.

### 3. Ranking + recommendation
Candidates are ranked against the role profile using a hybrid of semantic
similarity, structured-criterion matching, and explicit recruiter weights.
Every rank is explainable down to the contributing signals.

## Key decisions and what they cost

| Decision | Why | What it traded |
|---|---|---|
| Browser-extension scraping over API ingestion | Coverage of networks without public APIs | Brittleness when DOMs change — mitigated with adapter-per-source |
| Structured LLM evaluation over free-text + parsing | Trust and explainability | Higher prompt engineering cost up front |
| Hybrid ranking (vector + criterion + weight) over pure-vector | Recruiters need to *steer* | More moving parts, longer eval cycles |

## Outcome

- **>60% reduction in time-to-hire** for pilot accounts

---

**Related writing:** [The enterprise AI adoption playbook nobody writes](/writing/enterprise-ai-adoption-playbook)
