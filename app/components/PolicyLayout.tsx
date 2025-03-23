export default function PolicyLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="max-w-[800px] mx-auto py-10 px-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
} 