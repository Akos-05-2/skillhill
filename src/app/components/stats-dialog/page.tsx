'use client';

import { useState, useEffect } from 'react';
import './page.css';
import Statistics from '@/app/components/statistics/statistics';

interface StatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsDialog({ isOpen, onClose }: StatsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">Kurzus Statisztikák</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="dialog-body">
          <Statistics />
        </div>

        <div className="dialog-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
}
