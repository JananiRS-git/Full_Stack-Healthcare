"use client";

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface Props {
  children: ReactNode;
}

export default function RootClientWrapper({ children }: Props) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login');

  return <>{isAuthPage ? <>{children}</> : <Layout>{children}</Layout>}</>;
}
