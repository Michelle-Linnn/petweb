import React from 'react';
import { themes } from '../data/themeConfig';
import AuthButton from './Auth';

export default function SubscriptionPage({ type }) {
  const config = themes[type];
  if (!config) return <div className="p-20 text-center font-sans text-gray-500">Loading Configuration...</div>;

    // 在 handleSubscribe 函数中全选替换：
    const handleSubscribe = async () => {
    try {
        const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: config.stripePriceId }),
        });

        const data = await response.json();
        if (data.url) {
        window.location.href = data.url; // 🚀 跳转到 Stripe 支付页面
        }
    } catch (err) {
        console.error('支付失败:', err);
    }
    };
        

  return (
    <div className={`min-h-screen ${config.primaryColor} font-sans selection:bg-white`}>
      <nav className="p-8 flex justify-between max-w-7xl mx-auto items-center">
        <h1 className={`text-2xl font-black tracking-tighter ${config.textColor}`}>PETSURPRISE</h1>
        <AuthButton />
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        {/* 左侧文字区 */}
        <div>
          <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white ${config.textColor} shadow-sm mb-6`}>
            Monthly Surprise Box
          </span>
          <h2 className={`text-6xl font-black leading-tight ${config.textColor} mb-6`}>{config.title}</h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">{config.subtitle}</p>
          
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-white inline-block w-full">
            <div className="flex items-end gap-2 mb-8">
              <span className="text-6xl font-black">${config.price}</span>
              <span className="text-gray-400 font-bold mb-2">/ 每月订阅</span>
            </div>
            
            {/* 🌟 核心：按钮绑定点击事件 */}
            <button 
              onClick={handleSubscribe}
              className={`w-full py-5 rounded-2xl text-white font-black text-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 ${config.accentColor}`}
            >
              立即开启惊喜 / Subscribe Now
            </button>
            <p className="text-center mt-4 text-sm text-gray-400 font-bold tracking-widest uppercase">🛡️ 随时取消 • 免运费</p>
          </div>
        </div>

        {/* 右侧：产品清单内容 */}
        <div className="grid grid-cols-2 gap-4">
          {config.features.map((item, idx) => (
            <div key={idx} className="bg-white/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-white flex flex-col items-center text-center hover:bg-white transition-all shadow-sm hover:shadow-xl">
              <span className="text-4xl mb-4">{['🍖', '🧶', '🧴', '📺'][idx]}</span>
              <p className={`font-bold ${config.textColor}`}>{item}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}