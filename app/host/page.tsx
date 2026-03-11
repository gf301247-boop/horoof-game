'use client';

import { GameProvider } from '@/lib/game-context';
import { HostDashboard } from '@/components/game/host-dashboard';

export default function HostPage() {
  return (
    <GameProvider isHost={true}>
      <HostDashboard />
    </GameProvider>
  );
}
