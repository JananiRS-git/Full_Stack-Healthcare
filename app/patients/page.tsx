"use client";

import React, { Suspense } from 'react';
import PatientsContent from './content';

export default function PatientsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading patients...</div>}>
      <PatientsContent />
    </Suspense>
  );
}
