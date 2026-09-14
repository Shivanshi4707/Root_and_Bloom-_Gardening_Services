import React from 'react';

// Reliable botanical fallback SVG data URLs and helper for Root & Bloom

export const BOTANICAL_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A3828"/>
      <stop offset="100%" stop-color="#2A5C43"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bgGrad)"/>
  <circle cx="300" cy="180" r="70" fill="#FAF8F5" fill-opacity="0.12"/>
  <path d="M300,120 C340,160 340,220 300,240 C260,220 260,160 300,120 Z" fill="#8FE388"/>
  <path d="M300,160 L300,230" stroke="#1A3828" stroke-width="4" stroke-linecap="round"/>
  <path d="M300,190 Q320,180 325,170" stroke="#1A3828" stroke-width="3" fill="none"/>
  <path d="M300,205 Q280,195 275,185" stroke="#1A3828" stroke-width="3" fill="none"/>
  <text x="300" y="290" text-anchor="middle" font-family="serif" font-size="20" font-weight="bold" fill="#FAF8F5" letter-spacing="1">ROOT &amp; BLOOM</text>
  <text x="300" y="315" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#A7F3D0" letter-spacing="2">BOTANICAL LIVING</text>
</svg>
`)}`;

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== BOTANICAL_PLACEHOLDER) {
    target.src = BOTANICAL_PLACEHOLDER;
  }
};
