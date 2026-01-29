'use client';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessIdea, setBusinessIdea] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !businessIdea) {
      alert('이메일, 연락처, 사업 아이디어를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, businessIdea }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        // 폼 초기화
        setName('');
        setEmail('');
        setPhone('');
        setBusinessIdea('');
      } else {
        alert('분석 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Business Architect</h1>
          <p className="text-xl text-gray-300">AI 사업계획 구조 진단 (전문가 심사 전 필수)</p>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">이름</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">연락처</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border rounded-lg" required />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">사업 핵심 구조 및 내용</label>
              <textarea 
                value={businessIdea} 
                onChange={(e) => setBusinessIdea(e.target.value)} 
                className="w-full px-4 py-3 border rounded-lg h-64" 
                placeholder="AI가 내용을 분석할 수 있도록, 아이디어와 수익 모델을 최대한 자세히 적어주세요."
                required 
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  분석 중...
                </>
              ) : 'AI 진단 실행'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">🔍 AI가 사업계획서를 분석하고 있습니다</h3>
            <p className="text-gray-600">잠시만 기다려주세요 (약 10-20초 소요)</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4">진단 결과</h2>
            <div className="whitespace-pre-wrap">{analysis}</div>
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4">전문가 상담 신청</h3>
              <p className="text-gray-600 mb-4">
                진단 결과를 바탕으로 실제 제출 가능한 사업계획서를 만들고 싶으신가요?
              </p>
              <div className="space-y-3">
                <a 
                  href="tel:010-4484-0158"
                  className="block text-center bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700"
                >
                  📞 전화 상담: 010-4484-0158
                </a>
                <a 
                  href="mailto:songjiun@me.com"
                  className="block text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700"
                >
                  📧 이메일 상담: songjiun@me.com
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}