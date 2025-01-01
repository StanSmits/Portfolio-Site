import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const tools = [
  { name: 'Select a tool', value: '' },
  { name: 'Calculator', value: 'calculator' },
] as const;

export const ToolsDropdown: React.FC = () => {
  const navigate = useNavigate();

  const handleToolChange = (value: string) => {
    if (value) {
      navigate(`/tools/${value}`);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="group relative">
        <select
          onChange={(e) => handleToolChange(e.target.value)}
          className="appearance-none rounded-lg bg-gray-900/50 px-4 py-2 pr-8 text-sm text-gray-300 transition-colors hover:bg-gray-900/70 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          defaultValue=""
        >
          {tools.map((tool) => (
            <option key={tool.value} value={tool.value}>
              {tool.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};