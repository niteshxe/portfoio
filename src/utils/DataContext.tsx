import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchData } from './api';

interface DataContextType {
  hero: any;
  about: any;
  projects: any;
  resume: any;
  contact: any;
  ticker: any;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hero, setHero] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [projects, setProjects] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [ticker, setTicker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData('all');

      setHero(data.hero);
      setAbout(data.about);
      setProjects(data.projects);
      setResume(data.resume);
      setContact(data.contact);
      setTicker(data.ticker);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to initialize kernel data:', err);
      setError(err?.message || 'CRITICAL_SYSTEM_ERROR: DATAFETCH_FAILED');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <DataContext.Provider value={{ hero, about, projects, resume, contact, ticker, loading, error, refetchData: loadAllData }}>
      {children}
    </DataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('usePortfolioData must be used within a DataProvider');
  }
  return context;
};
