import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({ to, children }) => (
  <Link
    to={to}
    className="px-4 py-2 text-gray-300 hover:text-purple-400 transition-colors"
  >
    {children}
  </Link>
);