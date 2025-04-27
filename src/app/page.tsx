'use client';

import React from 'react';
import './page.css';
import HeroSection from './components/main/HeroSection';
import FeatureSection from './components/main/FeatureSection';
import CtaSection from './components/main/CtaSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <CtaSection />
    </>
  );
}