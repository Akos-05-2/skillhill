'use client';

import { useState, useEffect } from 'react';
import './page.css';

interface StatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CourseStats {
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  completionRate: number;
  activeStudents: number;
  totalLessons: number;
}

export default function StatsDialog({ isOpen, onClose }: StatsDialogProps) {
  const [stats, setStats] = useState<CourseStats>({
    totalStudents: 35,
    totalCourses: 3,
    averageRating: 4.8,
    completionRate: 78,
    activeStudents: 28,
    totalLessons: 90
  });

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2 className="dialog-title">Kurzus Statisztikák</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Összes Tanuló</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{stats.totalCourses}</div>
            <div className="stat-label">Aktív Kurzusok</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
            <div className="stat-label">Átlag Értékelés</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{stats.completionRate}%</div>
            <div className="stat-label">Befejezési Arány</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{stats.activeStudents}</div>
            <div className="stat-label">Aktív Tanulók</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-value">{stats.totalLessons}</div>
            <div className="stat-label">Összes Lecke</div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Havi Aktivitás</h3>
          <div className="activity-chart">
            <div className="chart-bar" style={{ height: '60%' }}><span>Jan</span></div>
            <div className="chart-bar" style={{ height: '75%' }}><span>Feb</span></div>
            <div className="chart-bar" style={{ height: '85%' }}><span>Már</span></div>
            <div className="chart-bar" style={{ height: '70%' }}><span>Ápr</span></div>
            <div className="chart-bar" style={{ height: '90%' }}><span>Máj</span></div>
            <div className="chart-bar" style={{ height: '65%' }}><span>Jún</span></div>
          </div>
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
