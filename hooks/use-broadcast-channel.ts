'use client';

import { useEffect, useCallback, useRef } from 'react';
import { GameState, HexCell, GridSize, QuestionData } from '@/lib/game-types';

export type BroadcastAction =
  | { type: 'SYNC_STATE'; payload: GameState }
  | { type: 'HEX_SELECTED'; payload: { hex: HexCell; isOpen: boolean; question: QuestionData | null } }
  | { type: 'HEX_DESELECTED' }
  | { type: 'AWARD_BLUE' }
  | { type: 'AWARD_RED' }
  | { type: 'PASS_WRONG' }
  | { type: 'CHANGE_GRID_SIZE'; payload: GridSize }
  | { type: 'PLAY_AGAIN' }
  | { type: 'REQUEST_SYNC' };

const CHANNEL_NAME = 'horoof-game-channel';

export function useBroadcastChannel(
  onMessage: (action: BroadcastAction) => void
) {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<BroadcastAction>) => {
      onMessage(event.data);
    };

    return () => {
      channel.close();
    };
  }, [onMessage]);

  const broadcast = useCallback((action: BroadcastAction) => {
    if (channelRef.current) {
      channelRef.current.postMessage(action);
    }
  }, []);

  return { broadcast };
}
