import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import { HeroSection } from './components/HeroSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { ProgramsSection } from './components/ProgramsSection';
import { PricingSection } from './components/PricingSection';
import { PlacementCTASection } from './components/PlacementCTASection';
import { LearningProcessSection } from './components/LearningProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { RegistrationModal } from './components/RegistrationModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleStartTest = () => {
    navigate('/placement-test');
  };

  const handleExploreCourses = () => {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-0 bg-white">
      {/* 2. Hero */}
      <HeroSection
        onStartTest={handleStartTest}
        onExploreCourses={handleExploreCourses}
      />

      {/* 3. Why Choose Us */}
      <WhyChooseUsSection />

      {/* 4. Programs */}
      <ProgramsSection
        onSelectCourse={(course) => setSelectedCourse(course)}
        onStartPlacementTest={handleStartTest}
      />

      {/* 5. Pricing */}
      <PricingSection onStartTest={handleStartTest} />

      {/* 6. Placement Test CTA */}
      <PlacementCTASection onStartTest={handleStartTest} />

      {/* 7. Learning Process */}
      <LearningProcessSection onStartTest={handleStartTest} />

      {/* 8. Testimonials */}
      <TestimonialsSection />

      {/* 9. FAQ */}
      <FAQSection />

      {/* 10. Contact */}
      <ContactSection />

      {/* Registration / Program Detail Modal */}
      {selectedCourse && (
        <RegistrationModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onStartTest={handleStartTest}
        />
      )}
    </div>
  );
};

