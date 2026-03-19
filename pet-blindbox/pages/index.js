import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Link href="/cat" className="flex-1 bg-purple-50 flex flex-col items-center justify-center hover:flex-[1.2] transition-all no-underline">
        <span className="text-6xl mb-4">🐱</span>
        <h2 className="text-4xl font-black text-purple-900">猫咪空间</h2>
        <div className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-full">进入</div>
      </Link>
      <Link href="/dog" className="flex-1 bg-blue-50 flex flex-col items-center justify-center hover:flex-[1.2] transition-all no-underline">
        <span className="text-6xl mb-4">🐶</span>
        <h2 className="text-4xl font-black text-blue-900">狗狗乐园</h2>
        <div className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full">进入</div>
      </Link>
    </div>
  );
}