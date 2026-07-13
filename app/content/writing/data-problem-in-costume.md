---
title: Your AI Problem Is a Data Problem Wearing a Costume
slug: data-problem-in-costume
date: 2026-07-19
tags: [enterprise, data, strategy]
excerpt: The model is almost never why an enterprise AI program stalls. The data is. And no model recovers from data that was never made ready.
draft: false
---

Every stalled AI program I am asked to look at arrives with the same framing:
we need a better model. A different vendor. More fine-tuning. Almost none of
them have a model problem. They have a data problem wearing a model's costume.

The tell is consistent. The pilot worked beautifully on a clean, hand-picked
slice of data. Then it met production, where the data is fragmented across a
dozen systems, half of it is stale, the definitions disagree between
departments, and nobody owns the pipeline that would keep it current. The
model did not get worse. It finally saw the real inputs.

## Why the data layer is where programs die

A model is a function of its inputs. If the inputs are incomplete,
inconsistent, or out of date, no amount of prompt engineering, fine-tuning, or
vendor-switching recovers the output. You are not one model away from success.
You are one data platform away, and that is a much larger and much less
glamorous project.

This is the part that never makes the board deck. "We will stand up a modern
data foundation" does not demo. "Watch the AI answer this question" does. So
programs get funded on the demo and starved on the foundation, and then
everyone is surprised when the thing that worked in the room falls apart at
scale.

## The honest sequencing

The uncomfortable truth is that data readiness is often 60 to 80 percent of
the real work in an enterprise AI program, and it has to come first. You
cannot promise a model win on top of plumbing you have not built. When a
leadership team asks me to accelerate an AI roadmap, the first question is
rarely about models. It is this: is the data this depends on actually ready,
owned, and current? If the answer is no, that is the roadmap, whether anyone
wanted it to be or not.

## What to actually do

Three moves before you approve another model-centric plan:

1. **Run a data-readiness check first.** For each use case, ask where the data
   lives, who owns it, how fresh it is, and whether the definitions are agreed.
   If those answers are shaky, the use case is not ready, no matter how good
   the model is.
2. **Fund the foundation as its own line, not a footnote.** The data platform
   is not overhead on the AI project. For most enterprises it is the project.
   Budget it like one.
3. **Sequence to where the data already is.** The fastest AI win is almost
   always the use case sitting on data that is already clean, owned, and
   current. Start there, earn the credibility, then fund the harder
   foundations with the trust you built.

The teams that ship are not the ones with the best models. They are the ones
that were honest, early, about the state of their data, and did the
unglamorous work before they promised the demo.

So before the next model debate: is this an AI problem, or a data problem
wearing a costume?
