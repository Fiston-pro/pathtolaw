import { useState, useEffect, useRef } from 'react';
import LawCard from './components/LawCard';
import Profile from './components/Profile';
import { UserProvider } from './context/UserContext';
import { lawsData } from './data/lawsData';
import './App.css';

function AppContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (showProfile) return; // Don't handle scroll when profile is open

    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (isScrollingRef.current) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        // Scroll down
        isScrollingRef.current = true;
        setCurrentIndex(prev => (prev + 1) % lawsData.length);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      } else if (e.deltaY < 0) {
        // Scroll up
        isScrollingRef.current = true;
        setCurrentIndex(prev => (prev - 1 + lawsData.length) % lawsData.length);
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    };

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isScrollingRef.current) return;

      touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up
          isScrollingRef.current = true;
          setCurrentIndex(prev => (prev + 1) % lawsData.length);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 800);
        } else {
          // Swipe down
          isScrollingRef.current = true;
          setCurrentIndex(prev => (prev - 1 + lawsData.length) % lawsData.length);
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 800);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, showProfile]);

  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">⚖️</span>
          <h1 className="logo-text">PathToLaw</h1>
        </div>
        <p className="tagline">Polskie prawo na TikTok</p>
        <button className="profile-icon-btn" onClick={() => setShowProfile(true)}>
          👤
        </button>
      </header>

      <div
        className="cards-container"
        ref={containerRef}
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {lawsData.map((law, index) => (
          <LawCard
            key={law.id}
            law={law}
            isActive={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
