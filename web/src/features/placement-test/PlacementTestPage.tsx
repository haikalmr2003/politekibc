import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlacementTestRunner } from './components/PlacementTestRunner';

export const PlacementTestPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PlacementTestRunner
      onGoToCourses={() => navigate('/programs')}
    />
  );
};
