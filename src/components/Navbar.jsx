export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">🏡 Real Estate Portal</h1>
        <a href="/" className="hover:underline">Properties</a>
      </div>
    </nav>
  );
}
