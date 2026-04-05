'use client';

import React from 'react';

interface NavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'diagnose', label: '简历诊断', icon: '📋' },
  { id: 'optimize', label: '经历优化', icon: '✨' },
  { id: 'translate', label: '中英翻译', icon: '🌐' },
  { id: 'match', label: 'JD匹配', icon: '🎯' },
];

export default function Nav({ activeTab, onTabChange }: NavProps) {
  return (
    <nav className="w-56 bg-white border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">简历优化</h1>
        <p className="text-sm text-gray-500 mt-1">Resume Optimizer</p>
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Powered by Claude
        </p>
      </div>
    </nav>
  );
}