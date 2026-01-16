export default function NavigationBar({ title }: { title: string }) {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <h1 className="text-xl font-bold">{title}</h1>
    </nav>
  );
}
