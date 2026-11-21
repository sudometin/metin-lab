---
title: "EEGNet: small CNNs, real signals"
paper: "EEGNet: a compact convolutional neural network for EEG-based brain–computer interfaces"
authors: Vernon J. Lawhern et al.
venue: Journal of Neural Engineering
year: 2018
tag: Machine learning
minutes: 7
summary: A compact architecture built around temporal and depthwise spatial filters. A good baseline for decoding odors from field potentials, too.
doi: 10.1088/1741-2552/aace8c
concepts: [EEG, CNN, decoding]
date: 2026-11-16
---

<!-- Starter note: rewrite in your own voice. -->

## The idea

Instead of a huge network, use convolutions that mirror classic EEG processing: temporal filters (band-pass-like), then depthwise spatial filters (spatial-filter-like), then separable convolutions.

## Why I use it

It trains on small datasets, has few parameters, and its first-layer filters are interpretable. For LFP odor decoding it is my baseline before anything fancier.
