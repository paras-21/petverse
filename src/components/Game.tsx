'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/lib/store';
import { setMuted } from '@/lib/sfx';
import { EggScreen } from './EggScreen';
import { HomeScreen } from './HomeScreen';
import { BattleScreen } from './BattleScreen';

export default function Game() {
  const hasPet = useGame((s) => s.pet !== null);
  const muted = useGame((s) => s.muted);
  const [screen, setScreen] = useState<'home' | 'battle'>('home');

  useEffect(() => setMuted(muted), [muted]);

  useEffect(() => {
    const { tick } = useGame.getState();
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!hasPet) return <EggScreen />;
  if (screen === 'battle') return <BattleScreen onExit={() => setScreen('home')} />;
  return <HomeScreen onBattle={() => setScreen('battle')} />;
}
