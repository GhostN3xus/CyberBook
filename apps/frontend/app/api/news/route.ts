import { NextResponse } from 'next/server';
import { getSanitizedNewsFeed } from '../../../lib/news-feed';

export function GET() {
  const items = getSanitizedNewsFeed();

  return NextResponse.json(
    { items },
    {
      headers: {
        'Cache-Control': 'no-store'
      }
    }
  );
}
