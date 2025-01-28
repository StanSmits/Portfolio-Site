import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-purple-500" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-0 animate-ping rounded-full border-4 border-purple-500/10" style={{ animationDuration: '2s' }} />
      </div>
    </div>
  );
};