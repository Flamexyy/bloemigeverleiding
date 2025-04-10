export default function PolicyLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-20 pb-[200px] md:px-8">
      <h1 className="mb-8 text-3xl font-bold text-red-400">{title}</h1>
      <div className="prose max-w-none">{children}</div>
    </div>
  );
}
