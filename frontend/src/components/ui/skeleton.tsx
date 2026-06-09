export function Skeleton({ className }: { className?: string }) {
  return <div className={className ?? 'bg-slate-200 rounded-md animate-pulse'} />;
}

export default Skeleton;
