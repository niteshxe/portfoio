import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Index from './pages/Index'
import About from './pages/About'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import Preloader from './pages/components/Preloader'
import SystemOffline from './pages/components/SystemOffline'
import { DataProvider, usePortfolioData } from './utils/DataContext'
import { Analytics } from '@vercel/analytics/react'

// A small utility component to handle smooth scroll resets on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppContent = () => {
  const { error, refetchData } = usePortfolioData();

  if (error) {
    return <SystemOffline error={error} onRetry={refetchData} />;
  }

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <DataProvider>
      <AppContent />
      <Analytics />
    </DataProvider>
  )
}

export default App
