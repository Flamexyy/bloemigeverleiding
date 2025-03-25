export function SkeletonItem({ className = "" }: { className?: string }) {
  return <div className={`bg-accent/30 rounded animate-pulse ${className}`}></div>;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-square bg-accent/30 rounded-2xl"></div>
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="h-5 bg-accent/30 rounded w-3/4"></div>
        <div className="h-5 bg-accent/30 rounded w-1/3"></div>
      </div>
      <div className="h-10 bg-accent/30 rounded-[100px] w-full"></div>
    </div>
  );
}

export function OrderSkeleton() {
  return (
    <div className="border border-text/20 rounded-2xl p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 bg-accent/30 rounded w-40"></div>
          <div className="h-4 bg-accent/30 rounded w-32"></div>
        </div>
        <div className="h-6 bg-accent/30 rounded-[50px] w-24"></div>
      </div>
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-accent/30 rounded-xl shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-accent/30 rounded w-2/3"></div>
          <div className="h-4 bg-accent/30 rounded w-1/4"></div>
          <div className="h-4 bg-accent/30 rounded w-1/5"></div>
        </div>
      </div>
      <div className="pt-4 border-t border-text/20">
        <div className="flex justify-between">
          <div className="h-5 bg-accent/30 rounded w-16"></div>
          <div className="h-5 bg-accent/30 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
} 