'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

export default function ClientNavbar() {
  return <Navbar />;
}
