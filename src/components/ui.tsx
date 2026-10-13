'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimers() {
  const ids = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const set = ids.current;
    return () => {
      set.forEach(clearTimeout);
      set.clear();
    };
  }, []);
  const after = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
  }, []);
  const wait = useCallback((ms: number) => new Promise<void>((r) => after(r, ms)), [after]);
  return { after, wait };
}

export interface Floater {
  id: number;
  text: string;
  x: number; // % of stage
  y: number;
  color: string;
  big?: boolean;
}

export function useFloaters(after: (fn: () => void, ms: number) => void) {
  const [list, setList] = useState<Floater[]>([]);
  const next = useRef(0);
  const add = useCallback(
    (f: Omit<Floater, 'id'>) => {
      const id = ++next.current;
      setList((l) => [...l, { ...f, id }]);
      after(() => setList((l) => l.filter((x) => x.id !== id)), 1150);
    },
    [after],
  );
  return [list, add] as const;
}

export function FloaterLayer({ list }: { list: Floater[] }) {
  return (
    <>
      {list.map((f) => (
        <div
          key={f.id}
          className={`floater ${f.big ? 'text-lg' : 'text-sm'}`}
          style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.color }}
        >
          {f.text}
        </div>
      ))}
    </>
  );
}

// Pixel icon (pixelarticons, MIT) drawn as a CSS mask so it takes the text color.
export function Icon({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) {
  const mask = `url(/icons/${name}.svg) center / contain no-repeat`;
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ width: size, height: size, WebkitMask: mask, mask }}
    />
  );
}

// Segmented 8-bit meter.
export function StatBar({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const v = Math.max(0, Math.min(100, value));
  const low = v < 25;
  const filled = Math.ceil(v / 10);
  const c = low ? 'var(--accent)' : color;
  return (
    <div className="flex items-center gap-3" aria-label={`${label} ${Math.round(v)} percent`}>
      <span style={{ color: c }}>
        <Icon name={icon} size={24} />
      </span>
      <span className={`w-16 text-lg font-semibold ${low ? 'blink text-accent' : 'text-ink'}`}>{label}</span>
      <div className="flex flex-1 gap-[3px]">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="h-4 flex-1" style={{ background: i < filled ? c : 'var(--line)' }} />
        ))}
      </div>
    </div>
  );
}

export function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
      <div key={text} className="chip pop-in px-3 py-2 text-lg font-semibold text-ink">
        {text}
      </div>
    </div>
  );
}
