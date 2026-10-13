'use client';

import dynamic from 'next/dynamic';

const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false });

export default function Page() {
  return <Gallery />;
}
