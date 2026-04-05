'use client';

import { useState } from 'react';

type Tab = 'diagnose' | 'optimize' | 'translate' | 'match';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('diagnose');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // 诊断表单
  const [diagnoseContent, setDiagnoseContent] = useState('');
  const [diagnoseRole, setDiagnoseRole] = useState('');
  
  // 优化表单
  const [optimizeBullet, setOptimizeBullet] = useState('');
  const [optimizeRole, setOptimizeRole] = useState('');
  
  // 翻译表单
  const [translateContent, setTranslateContent] = useState('');
  const [translateFrom, setTranslateFrom] = useState<'zh' | 'en'>('en');
  const [translateTo, setTranslateTo] = useState<'zh' | 'en'>('zh');
  const [translateRegion, setTranslateRegion] = useState<'cn' | 'us'>('cn');

  const handleDiagnose = async () => {
    if (!diagnoseContent) return;
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/resume/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: diagnoseContent, 
          targetRole: diagnoseRole 
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!optimizeBullet) return;
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/resume/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bullet: optimizeBullet, 
          targetRole: optimizeRole 
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderDiagnoseTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">简历内容</label>
        <textarea
          value={diagnoseContent}
          onChange={(e) => setDiagnoseContent(e.target.value)}
          placeholder="粘贴你的简历内容..."
          className="w-full h-48 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">目标岗位（可选）</label>
        <input
          type="text"
          value={diagnoseRole}
          onChange={(e) => setDiagnoseRole(e.target.value)}
          placeholder="如：产品经理、数据分析师"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleDiagnose}
        disabled={loading || !diagnoseContent}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '诊断中...' : '开始诊断'}
      </button>
    </div>
  );

  const renderOptimizeTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">工作/项目描述</label>
        <textarea
          value={optimizeBullet}
          onChange={(e) => setOptimizeBullet(e.target.value)}
          placeholder="输入你想要优化的工作经历描述..."
          className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">目标岗位（可选）</label>
        <input
          type="text"
          value={optimizeRole}
          onChange={(e) => setOptimizeRole(e.target.value)}
          placeholder="如：软件工程师"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleOptimize}
        disabled={loading || !optimizeBullet}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '优化中...' : '开始优化'}
      </button>
    </div>
  );

  const renderTranslateTab = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">从</label>
          <select
            value={translateFrom}
            onChange={(e) => setTranslateFrom(e.target.value as 'zh' | 'en')}
            className="w-full p-3 border rounded-lg"
          >
            <option value="en">英文 → 中文</option>
            <option value="zh">中文 → 英文</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">求职地</label>
          <select
            value={translateRegion}
            onChange={(e) => setTranslateRegion(e.target.value as 'cn' | 'us')}
            className="w-full p-3 border rounded-lg"
          >
            <option value="cn">中国</option>
            <option value="us">北美</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">简历内容</label>
        <textarea
          value={translateContent}
          onChange={(e) => setTranslateContent(e.target.value)}
          placeholder="粘贴需要翻译的简历内容..."
          className="w-full h-48 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        disabled
        className="w-full py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
      >
        即将上线
      </button>
    </div>
  );

  const renderMatchTab = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">简历内容</label>
        <textarea
          placeholder="粘贴你的简历..."
          className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">岗位JD</label>
        <textarea
          placeholder="粘贴目标岗位的JD..."
          className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        disabled
        className="w-full py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed"
      >
        即将上线
      </button>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;

    // 诊断结果
    if (result.score !== undefined) {
      return (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600 mb-4">评分: {result.score}/100</div>
          
          {result.top5_problems?.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">需要改进的问题：</h3>
              {result.top5_problems.map((item: any, i: number) => (
                <div key={i} className={`p-3 rounded border-l-4 ${
                  item.priority === '高' ? 'border-red-500 bg-red-50' : 
                  item.priority === '中' ? 'border-yellow-500 bg-yellow-50' : 
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="font-medium">{item.problem}</div>
                  <div className="text-sm text-gray-600 mt-1">💡 {item.suggestion}</div>
                  <div className="text-xs mt-1">优先级: {item.priority}</div>
                </div>
              ))}
            </div>
          )}
          
          {result.missing_keywords?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">缺失关键词：</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((kw: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-200 rounded text-sm">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // 优化结果
    if (result.optimized) {
      return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-4">
          <div>
            <h3 className="font-semibold mb-2">✨ 优化后描述：</h3>
            <div className="p-3 bg-white rounded border">{result.optimized}</div>
          </div>
          
          {result.star_format && (
            <div>
              <h3 className="font-semibold mb-2">📋 STAR拆分：</h3>
              <div className="p-3 bg-white rounded border text-sm">{result.star_format}</div>
            </div>
          )}
          
          {result.keywords_added?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">🔑 植入的关键词：</h3>
              <div className="flex flex-wrap gap-2">
                {result.keywords_added.map((kw: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-green-200 rounded text-sm">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">📄 简历优化助手</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'diagnose', label: '简历诊断' },
            { id: 'optimize', label: '单条优化' },
            { id: 'translate', label: '翻译' },
            { id: 'match', label: '匹配度' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as Tab); setResult(null); }}
              className={`flex-1 py-2 rounded-lg font-medium ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'diagnose' && renderDiagnoseTab()}
          {activeTab === 'optimize' && renderOptimizeTab()}
          {activeTab === 'translate' && renderTranslateTab()}
          {activeTab === 'match' && renderMatchTab()}
          
          {renderResult()}
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          Powered by Claude • 简历内容仅用于本次分析，不会保存
        </p>
      </div>
    </div>
  );
}