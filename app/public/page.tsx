'use client';

import { GameProvider } from '@/lib/game-context';
import { PublicView } from '@/components/game/public-view';

export default function PublicPage() {
  return (
    <GameProvider isHost={false}>
      <PublicView />
    </GameProvider>
  );
}
