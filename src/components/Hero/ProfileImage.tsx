import React, { useState, useEffect } from 'react';
import { Skeleton } from '../LoadingSpinner/Skeleton';

export const ProfileImage: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [blurDataURL, setBlurDataURL] = useState('');

  useEffect(() => {
    const img = new Image();
    img.src = '/images/secondary.jpeg'; // Absolute path from public folder
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 20;
      canvas.height = 20;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 20, 20);
        const dataURL = canvas.toDataURL();
        setBlurDataURL(dataURL);
      }
    };
    img.onerror = (err) => console.error('Image failed to load:', err);
  }, []);

  return (
    <div className="relative aspect-square overflow-hidden rounded-full">
      {!imageLoaded && <Skeleton className="absolute inset-0 rounded-full" />}
      {blurDataURL && (
        <img
          src={blurDataURL}
          alt="Blurred preview"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.2)',
            opacity: imageLoaded ? 0 : 1,
          }}
        />
      )}
      <img
        src="/images/secondary.jpeg"
        alt="Stan Smits mug shot"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => {
          setImageLoaded(true);
        }}
        onError={() => {
          console.error('Error loading image');
        }}
      />
      <div className="absolute inset-0 rounded-full ring-2 ring-purple-500/20" />
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
    </div>
  );
};
