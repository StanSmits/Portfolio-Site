import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
    </div>
  );
};