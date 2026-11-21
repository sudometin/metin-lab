---
title: Where does the LFP actually come from?
paper: "The origin of extracellular fields and currents — EEG, ECoG, LFP and spikes"
authors: György Buzsáki, Costas A. Anastassiou, Christof Koch
venue: Nature Reviews Neuroscience
year: 2012
tag: Signal processing
minutes: 9
summary: Synaptic currents, geometry and volume conduction explain why the field you record is not just the sum of nearby spikes. Required reading before trusting any LFP feature.
doi: 10.1038/nrn3241
concepts: [LFP, EEG, oscillations, volume conduction]
date: 2026-11-17
---

<!-- Starter note: rewrite in your own voice. -->

## Why it matters

Every feature I extract from field potentials (band power, phase, coherence) assumes something about where the signal comes from. This review lays out those sources.

## Key points

- Synaptic transmembrane currents dominate the low-frequency field.
- Cell geometry and alignment decide how much a population contributes.
- Volume conduction means "local" can be less local than you think.

## Practical takeaways

```python
# re-reference before trusting local features
lfp_bipolar = lfp[:, 1:] - lfp[:, :-1]
```
