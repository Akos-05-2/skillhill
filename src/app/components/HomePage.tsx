'use client';

import React from 'react';
import HeroSection from './main/HeroSection';
import FeatureSection from './main/FeatureSection';
import CtaSection from './main/CtaSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureSection />
      <CtaSection />
    </div>
  );
} 