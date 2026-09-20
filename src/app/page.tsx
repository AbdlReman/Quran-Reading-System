import Header from './components/Header';
import HeroSection from './components/home/HeroSection';
import AcademicsSection from './components/home/AcademicsSection';
import WelcomeSection from './components/home/WelcomeSection';
import CampusLifeSection from './components/home/CampusLifeSection';
import PopularCoursesSection from './components/home/PopularCoursesSection';
import StatsSection from './components/home/StatsSection';
import TestimonialSection from './components/home/TestimonialSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AcademicsSection />
        <WelcomeSection />
        <CampusLifeSection />
        <PopularCoursesSection />
        <StatsSection />
        <TestimonialSection />
      </main>
      <Footer />
    </>
  );
}
