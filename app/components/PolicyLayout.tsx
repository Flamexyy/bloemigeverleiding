export default function PolicyLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-8 text-red-400">{title}</h1>
      <div className="prose max-w-none">
        {children}
      </div>
    </div>
  );
} 