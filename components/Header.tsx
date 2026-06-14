'use client';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Careem wordmark + badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00b140]">
            <span className="text-white font-black text-lg leading-none">C</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#00b140] uppercase tracking-widest leading-none">
              Careem
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              Decision Brief Generator
            </h1>
          </div>
        </div>

        {/* Byline */}
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400">Built for Careem Challenge</p>
          <p className="text-sm font-semibold text-gray-600">Azaan Nabi Khan</p>
        </div>
      </div>
    </header>
  );
}
