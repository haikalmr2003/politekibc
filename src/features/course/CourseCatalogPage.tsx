import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCatalog } from '../landing/components/CourseCatalog';
import { RegistrationModal } from '../landing/components/RegistrationModal';
import { Course } from '../../types';

export const CourseCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="py-8 bg-white min-h-screen">
      <CourseCatalog
        onSelectCourse={(course) => setSelectedCourse(course)}
        onStartPlacementTest={() => navigate('/placement-test')}
      />

      {selectedCourse && (
        <RegistrationModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onStartTest={() => navigate('/placement-test')}
        />
      )}
    </div>
  );
};
