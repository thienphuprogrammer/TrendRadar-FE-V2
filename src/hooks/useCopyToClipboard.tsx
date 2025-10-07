/**
 * useCopyToClipboard Hook
 * Hook for copying text to clipboard
 */

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils/helpers';

export function useCopyToClipboard(): [(text: string) => Promise<void>, boolean] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    setCopied(success);

    if (success) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return [copy, copied];
}

