'use client';

import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/utils/createEmotionCache';
import { useState } from 'react';

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [emotionCache] = useState(() => createEmotionCache());

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}

