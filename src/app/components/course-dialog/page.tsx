'use client';

import { useState } from 'react';
import './page.css';

interface CourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: { course_name: string; description: string }) => void;
}

export default function CourseDialog({ isOpen, onClose, onSubmit }: CourseDialogProps) {
  const [formData, setFormData] = useState({
    course_name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ course_name: '', description: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2 className="dialog-title">Új Kurzus Létrehozása</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="course_name">Kurzus Neve</label>
            <input
              type="text"
              id="course_name"
              value={formData.course_name}
              onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
              required
              placeholder="pl. Web Fejlesztés Alapok"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Kurzus Leírása</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Írja le a kurzus tartalmát..."
              rows={4}
            />
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Mégse
            </button>
            <button type="submit" className="btn btn-primary">
              Létrehozás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
