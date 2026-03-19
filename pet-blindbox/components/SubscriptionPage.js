import { themes } from '../data/themeConfig';
import AuthButton from './Auth';

export default function SubscriptionPage({ type }) {
  const config = themes[type];
  if (!config) return <div>Loading...</div>;

  return (
    <div className={`min-h-screen ${config.primaryColor} font-sans`}>
      <nav className="p-6 flex justify-between max-w-7xl mx-auto items-center">
        <h1 className={`text-2xl font-black ${config.textColor}`}>PETSURPRISE</h1>
        <AuthButton />
      </nav>
      <main className="max-w-4xl mx-auto pt-20 text-center px-6">
        <h2 className={`text-6xl font-black mb-6 ${config.textColor}`}>{config.title}</h2>
        <div className="bg-white p-12 rounded-[3rem] shadow-xl inline-block">
          <p className="text-5xl font-black mb-8">${config.price}<span className="text-xl text-gray-400">/mo</span></p>
          <button className={`px-12 py-4 rounded-2xl text-white font-bold text-xl ${config.accentColor}`}>立即订阅</button>
        </div>
      </main>
    </div>
  );
}