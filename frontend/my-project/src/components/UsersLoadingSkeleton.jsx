function UsersLoadingSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="group relative flex items-center gap-3 p-3 rounded-xl animate-pulse"
        >
          {/* Avatar Skeleton */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-700/70" />
            {/* Online status dot skeleton */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-slate-600 border-2 border-slate-900" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              {/* Name skeleton */}
              <div className="h-4 bg-slate-700/70 rounded w-24" />
              {/* Time skeleton */}
              <div className="h-3 bg-slate-700/50 rounded w-12" />
            </div>
            
            <div className="flex items-center justify-between">
              {/* Message preview skeleton */}
              <div className="h-3 bg-slate-700/50 rounded w-40" />
              {/* Unread badge skeleton */}
              <div className="w-5 h-5 rounded-full bg-slate-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;