'use client';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-10 bg-muted rounded-lg animate-pulse w-1/4" />
      <div className="h-6 bg-muted rounded-lg animate-pulse w-1/3" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-muted rounded-lg animate-pulse" />
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
