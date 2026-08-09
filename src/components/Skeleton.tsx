/**
 * Phase 3.6 — Skeleton Loaders
 * 
 * Shimmer blocks that match real card layouts.
 * Usage: <Skeleton variant="card" /> or <Skeleton variant="detail" />
 */

interface SkeletonProps {
  variant?: 'card' | 'detail' | 'inline';
  count?: number;
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`bg-surface-container-high rounded-lg animate-pulse ${className ?? ''}`}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="flex gap-4 p-4 border border-surface-variant/40 rounded-xl bg-surface-container-lowest">
      {/* Thumbnail */}
      <ShimmerBlock className="w-16 h-24 flex-shrink-0 rounded" />
      {/* Text lines */}
      <div className="flex flex-col justify-center gap-2 flex-1">
        <ShimmerBlock className="h-4 w-3/4" />
        <ShimmerBlock className="h-3 w-1/2" />
        <ShimmerBlock className="h-3 w-1/3 mt-1" />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Hero image */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <ShimmerBlock className="w-full max-w-sm aspect-[3/4] rounded-xl" />
        <div className="w-full flex flex-col gap-4">
          <ShimmerBlock className="h-4 w-24 rounded" />
          <ShimmerBlock className="h-8 w-3/4" />
          <ShimmerBlock className="h-5 w-1/2" />
          <div className="flex gap-12 py-6">
            <ShimmerBlock className="h-10 w-20" />
            <ShimmerBlock className="h-10 w-20" />
          </div>
          <ShimmerBlock className="h-4 w-full" />
          <ShimmerBlock className="h-4 w-5/6" />
          <ShimmerBlock className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

function InlineSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <ShimmerBlock className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <ShimmerBlock className="h-4 w-2/3" />
        <ShimmerBlock className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export default function Skeleton({ variant = 'card', count = 1 }: SkeletonProps) {
  const Component =
    variant === 'detail'
      ? DetailSkeleton
      : variant === 'inline'
        ? InlineSkeleton
        : CardSkeleton;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </>
  );
}
