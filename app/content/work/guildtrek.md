---
title: "GuildTrek: Talent and Upskilling Platform"
slug: guildtrek
domain: ai-products
role: Product Architect
context: Zettamine
scale: Product platform
year: 2024-2025
status: building
impact: Skills modeled as a graph, not a course catalog
stack: [LLM, Skill Graph, Recommendation, RAG, Node.js, Nuxt]
tags: [build, product, llm, talent]
hero: A talent and upskilling platform that models skills as a living graph and routes each person along the path that actually closes their gap.
draft: false
---

## The mandate

I own the product architecture for GuildTrek, the talent and upskilling half of the
Zettamine product studio, and a natural companion to the hiring work in DigiHire. Where
DigiHire decides who to bring in, GuildTrek decides how the people you already have grow.

## The problem

Corporate upskilling is mostly a content problem dressed up as a learning problem. Firms
buy a course library, assign it, and measure completion instead of capability. The result
is expensive and inert: everyone finishes the module, nobody closes the gap that mattered.
The missing piece is a model of what a person can actually do, and what the role in front
of them actually needs.

## The system

- **Skill graph.** Roles, skills and evidence modeled as a graph rather than a flat
  catalog, so a gap is a real distance between where someone is and where the role needs them.
- **Personalized pathing.** LLM-driven recommendation that routes each person along the
  shortest credible path across that graph, tuned to their current level and target role.
- **Evidence over completion.** Progress is measured against demonstrated capability, not
  time spent, so the platform reports readiness instead of attendance.
- **Shared spine with the hiring stack.** The same skill model underneath sourcing,
  screening and growth, so the organization reasons about talent with one vocabulary.

## What it proves

GuildTrek and DigiHire are two products over one idea: that talent decisions get better
when skills are a model the system can reason about, not prose in a document. Architecting
both is how the studio keeps its products coherent rather than adjacent.
