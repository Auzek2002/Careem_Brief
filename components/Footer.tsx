export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-[#00b140]">Decision Brief Generator</span>
        </p>
        <p>
          Developed by{' '}
          <span className="font-semibold text-gray-600">Azaan Nabi Khan</span>
        </p>
      </div>
    </footer>
  );
}
