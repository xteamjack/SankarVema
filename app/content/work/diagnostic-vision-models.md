---
title: "Diagnostic Vision Models for Medicine and Agriculture"
slug: diagnostic-vision-models
domain: industrial-vision
role: ML Architect
context: Applied ML engagements
scale: Fine-tuned models, high-stakes classification
year: 2022-2023
status: shipped
impact: Fine-tuned detectors for tumors, skin cancer and crop disease
stack: [Deep Learning, Medical Imaging, Model Fine-Tuning, Image Classification]
tags: [build, vision, ml, healthcare, agriculture]
hero: Fine-tuned image models for high-stakes diagnosis, from brain-tumor and skin-cancer detection in medical imaging to plant-disease detection across crops.
draft: false
---

## The mandate

I built and fine-tuned deep-learning models for diagnosis across two domains where a
missed positive is the expensive error: medical imaging (brain-tumor and skin-cancer
detection) and agriculture (plant-disease detection). Different fields, same discipline:
a model whose mistakes have a real-world cost.

## The problem

Diagnosis from images is a classification problem where the two kinds of error are not
equal. In tumor and skin-cancer detection a false negative can be a life. In crop-disease
detection a missed outbreak can be a season. A model tuned to maximize headline accuracy
will happily trade away the exact errors that matter, because the rare, dangerous case is
underrepresented in the data. Getting this right is about the loss you optimize and the
data you curate, not the size of the network.

## The system

- **Fine-tuned detectors.** Models adapted to each diagnostic task rather than trained from
  scratch, so limited labeled data goes further.
- **Cost-aware evaluation.** Tuned and measured against the error that hurts, sensitivity to
  the dangerous class weighted above raw accuracy.
- **Domain-honest data curation.** Careful handling of class imbalance and edge cases, because
  in diagnosis the rare case is the whole point.

## What it proves

The same engineering discipline moves across medicine and agriculture: understand which
mistake is unacceptable, then build and evaluate the model around that, not around a
leaderboard. High-stakes classification is where that discipline shows.
