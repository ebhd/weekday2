export function SkeletonRow() {
  const grid =
    "grid grid-cols-[80px_minmax(0,1.5fr)_minmax(0,2fr)_160px] items-center";

  return (
    <div className={`${grid} px-4 py-4 items-center animate-pulse`}>
      {/* Rank */}
      <div className="flex justify-center">
        <div className="h-8 w-8 rounded-full bg-white/10" />
      </div>

      {/* Avatar + name  */}
      <div className="text-left flex items-center justify-center gap-2">
        <div className="w-16 h-16 rounded-full bg-white/10" />
        <div className="flex flex-col gap-2 w-32">
          <div className="h-3 rounded-full bg-white/10" />
          <div className="h-3 w-3/4 rounded-full bg-white/5" />
        </div>
      </div>

      {/* Song player */}
      <div className="max-w-[380px] w-full">
        <div className="h-10 rounded-full bg-white/10" />
      </div>

      {/* Stats + like  */}
      <div className="flex justify-center gap-4">
        <div className="flex flex-col gap-2 text-left">
          <div className="h-3 w-12 rounded-full bg-white/10" />
          <div className="h-3 w-12 rounded-full bg-white/10" />
        </div>

        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
