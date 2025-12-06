"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100">Loading Map...</div>
});

export default function MapCaller() {
  return <MapComponent />;
}
