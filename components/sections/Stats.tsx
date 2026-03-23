import type { Stat } from "@/types";

interface StatsProps {
  stats: Stat[];
}

export function Stats({ stats }: StatsProps) {
  return (
    <div
      aria-label="Estadísticas"
      className="flex flex-wrap justify-center border-t border-b border-white/10 mb-12"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex-1 min-w-[160px] text-center py-8 px-4 ${
            i < stats.length - 1 ? "border-r border-white/[0.07]" : ""
          }`}
        >
          <div className="text-gold font-serif text-4xl">{stat.value}</div>
          <div className="text-muted text-xs tracking-[0.15em] uppercase font-sans mt-1">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
