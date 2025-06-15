'use client';

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/utils/createEmotionCache';
import { useState } from 'react';

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const [emotionCache] = useState(() => createEmotionCache());

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
