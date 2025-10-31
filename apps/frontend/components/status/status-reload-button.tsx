'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface StatusReloadButtonProps {
  label: string;
}

export function StatusReloadButton({ label }: StatusReloadButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isPending ? '...' : label}
    </Button>
  );
}
