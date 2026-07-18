---
title: "Enterprise RAG and Conversational AI"
slug: enterprise-rag-conversational-ai
domain: ai-products
role: Architect
context: Multiple enterprise engagements
scale: Cross-industry, regulated domains
year: 2023-2024
status: shipped
impact: Grounded answers with citations, in finance and healthcare
stack: [RAG, Vector DB, LLM, Voicebot, Chatbot, Retrieval, Guardrails]
tags: [build, llm, rag, conversational]
hero: Retrieval-augmented assistants and voice and chat agents built for finance and healthcare, where an ungrounded answer is not a bug, it is a liability.
draft: false
---

## The mandate

I architected a set of retrieval-augmented and conversational AI systems across
enterprise engagements, several of them in finance and healthcare. The common thread
was not the model. It was building systems that could be trusted in domains where a
confident wrong answer carries real consequences.

## The problem

A raw LLM in a regulated enterprise is a fluent liability. It answers from a frozen,
generic memory, it cannot cite where an answer came from, and it will invent detail
rather than admit a gap. In finance and healthcare that is not a rough edge, it is a
reason not to ship. The work is turning a general model into a system that answers from
the enterprise's own current knowledge and can show its sources.

## The system

- **Retrieval-augmented generation.** Answers grounded in vector-indexed enterprise
  knowledge, retrieved at query time, so responses track the current corpus rather than
  the model's training snapshot.
- **Citations by construction.** Every answer carries the sources it was built from,
  which is what makes the output auditable rather than merely plausible.
- **Voice and chat surfaces.** Both voicebot and chatbot front ends over the same
  retrieval core, so the channel is a choice and the grounding is constant.
- **Guardrails for regulated use.** Refusal and escalation paths for out-of-scope or
  low-confidence queries, because in these domains a careful no beats a fluent guess.

## Key decisions and what they cost

| Decision | Why | What it traded |
|---|---|---|
| RAG over fine-tuning as the default | Freshness and citable sources | A retrieval and indexing pipeline to own and keep current |
| Citations required, not optional | Auditability in regulated domains | Extra plumbing on every answer path |
| Explicit refusal and escalation | A careful no is safer than a confident guess | Some coverage traded for trust |

## What it proves

Shipping conversational AI into finance and healthcare is a governance problem as much
as a model problem. These systems are the pattern I keep reusing: ground the answer, cite
the source, and design the failure mode on purpose.

---

**Related writing:** [The data problem in a costume](/writing/data-problem-in-costume)
