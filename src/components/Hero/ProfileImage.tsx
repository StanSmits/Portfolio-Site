import React from 'react';

export const ProfileImage: React.FC = () => {
  return (
    <div className="relative aspect-square overflow-hidden rounded-full left-0">
      <img
        src="./images/image.png"
        alt="Stan Smits mug shot"
        className="h-full w-full object-cover"
      />
    </div>
  );
};