export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-white">
      {children}
    </div>
  );
} 