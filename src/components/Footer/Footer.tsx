import React from 'react';
import { NavigationLink } from '../Navigation/NavigationLink';
import { ToolsMenu } from '../Navigation/ToolsMenu';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 px-4 py-6">
      <div className="container mx-auto flex items-center justify-between max-w-screen-lg">
        <nav className="flex items-center space-x-2">
          <NavigationLink to="/">Home</NavigationLink>
          <span className="text-gray-600">|</span>
          <ToolsMenu />
        </nav>
        <p className="text-gray-400">© {new Date().getFullYear()} Stan Smits</p>
      </div>
    </footer>
  );
};