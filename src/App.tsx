import { useState, useEffect, useMemo } from 'react';
import { getToolByPath } from './data/toolsData';
import { ToolCategory } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ToolView from './components/ToolView';
import SearchModal from './components/SearchModal';
import InfoModals, { InfoModalType } from './components/InfoModals';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p && p !== '/') return p;
      const h = window.location.hash.replace(/^#/, '');
      if (h) return h.startsWith('/') ? h : `/${h}`;
    }
    return '/';
  });

  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalType>(null);

  // Sync state with popstate (Back / Forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      setCurrentPath(p || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Primary navigation handler
  const handleNavigate = (path: string) => {
    if (path === '/' || path === '') {
      window.history.pushState(null, '', '/');
      setCurrentPath('/');
      setSelectedCategory(null);
    } else if (path.startsWith('/category/')) {
      const catId = path.replace('/category/', '') as ToolCategory;
      setSelectedCategory(catId);
      setCurrentPath('/');
      window.history.pushState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find matching tool based on current path
  const activeTool = useMemo(() => {
    return getToolByPath(currentPath);
  }, [currentPath]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Navigation Header */}
      <Header
        onNavigate={handleNavigate}
        activePath={currentPath}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Dynamic View Area */}
      <div className="flex-1">
        {activeTool ? (
          <ToolView tool={activeTool} onNavigate={handleNavigate} />
        ) : (
          <HomeView
            onNavigate={handleNavigate}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
        )}
      </div>

      {/* Global Semantic Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenModal={(modal) => setInfoModal(modal)}
      />

      {/* Search Modal Overlay */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectTool={(path) => {
          setSearchModalOpen(false);
          handleNavigate(path);
        }}
      />

      {/* Privacy, Terms, About, Contact & Sitemap Modal */}
      <InfoModals
        activeModal={infoModal}
        onClose={() => setInfoModal(null)}
        onNavigate={(path) => {
          setInfoModal(null);
          handleNavigate(path);
        }}
      />
    </div>
  );
}
