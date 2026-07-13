---
title: The Enterprise AI Adoption Playbook Nobody Writes (Because It's Boring)
slug: enterprise-ai-adoption-playbook
date: 2026-06-25
tags: [transform, enterprise, leadership]
excerpt: Most AI transformation programs fail not at the model, but at the second year. Here's the unglamorous structure I'd insist on if you asked me to run one.
draft: true
status: outline
---

> **Status:** outline. Promote to draft after adding two real anecdotes
> (without naming clients) that anchor each section.

## Why this post

Most public writing on enterprise AI is about *capability*: what models can
do, what frameworks exist, what demos look like. Very little is about *adoption*
— the unglamorous shape of an organization that actually consumes AI well.
After twenty years inside enterprise transformation programs, the shape is
consistent, the failures are consistent, and almost none of it is about the
model.

## The argument in one paragraph

Enterprise AI succeeds when three things are present at the same time:
**a real problem with a measurable outcome**, **a small platform team that
owns the AI substrate**, and **a feedback loop tying production output back
to model improvement**. Everything else — the model choice, the vendor
deal, the framework debate — is downstream and reversible. Most programs
get the first wrong, skip the second, and never build the third. Then they
restart with a different model.

## The five-layer reality check

### 1. Problem layer
- Real problem or board-deck problem?
- Measurable in dollars, hours, or risk — not "efficiency."
- Reversible if the experiment fails.

### 2. Data layer
- Where the program actually dies. If the data isn't ready, no model
  recovers from it.
- Don't promise model wins on top of unbuilt data plumbing.

### 3. Platform layer
- A small (5–10 person) AI platform team owning evals, model gateway,
  observability, governance, fine-tune pipelines, and the prompt registry.
- Without this, every team builds its own stack and the org has 14
  half-working AI projects.

### 4. Product layer
- AI inside an existing product workflow beats a "new AI tool."
- The mistake: standing up a separate UX for the AI capability. Adoption
  collapses.

### 5. Feedback layer
- Production output -> eval -> next version of the model or prompt.
- Skip this and the system gets quietly worse as the world changes around it.

## The org design that actually works

- **AI platform team** (central, small, owns the substrate)
- **Embedded AI engineers** per product line (consume the platform)
- **Domain SMEs** paired with engineers, not on advisory committees
- **A governance function** with veto power and explicit risk taxonomy

What does NOT work: a Center of Excellence that owns no product. A Center
of Excellence is a budget line, not a structure.

## The 18-month operating rhythm

- Months 0–3: pick one real problem, build the data layer, stand up the
  platform team.
- Months 3–9: ship the first capability inside an existing product. Build
  the eval harness in parallel.
- Months 9–18: second and third capabilities. Begin retiring tools the AI
  capabilities replace.

The shape that fails: an "AI strategy" that's really a vendor evaluation,
followed by a six-month pilot, followed by re-organizing.

## What CxOs underestimate

- **The unsexy work** — data, evals, observability, governance — is
  60% of the budget.
- **Talent dynamics** — AI engineers want to work on AI, not on data
  pipelines. Architect around that or you'll lose them.
- **Compounding** — the second year of the program creates more value
  than the first if (and only if) the platform layer exists.

## What I'd ask a board to commit to before starting

> _[List of 5–7 commitments. To be filled.]_

---

**Related:** [DigiHire.ai — AI Recruitment Platform](/work/digihire-ai) · [Enterprise Digital Twin](/work/enterprise-digital-twin)
