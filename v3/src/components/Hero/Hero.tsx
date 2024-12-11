import React from 'react';
import { ProfileImage } from './ProfileImage';
import { ParticleOverlay } from './ParticleOverlay';
import { ReactiveBlob } from './ReactiveBlob';

export const Hero: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => {
  return (
    <section className="relative min-h-[85vh] overflow-hidden px-4 py-12 sm:py-16">
      <ReactiveBlob mousePosition={mousePosition} />
      
      <div className="container mx-auto grid items-center gap-8 lg:grid-cols-2">
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
             <span className="text-purple-500">Stan</span> Smits
          </h1>
          <p className="mt-4 text-lg text-gray-300 sm:text-xl">
          I am a driven professional with a strong foundation in Computer Science and Web Development, specializing in creating seamless experiences for users. With a background in customer service and public engagement, I combine technical expertise with exceptional interpersonal skills to deliver innovative and personalized solutions.
          </p>
        </div>
        <div className="relative mx-auto max-w-[280px] sm:max-w-[320px] lg:max-w-[400px]">
          <ProfileImage />
          <ParticleOverlay mousePosition={mousePosition} />
        </div>
      </div>
    </section>
  );
};