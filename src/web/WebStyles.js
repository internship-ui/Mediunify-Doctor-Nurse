import { useEffect } from 'react';
import { Platform } from 'react-native';

const CSS_STYLES = `
/* MediUnify Clinician Web Application System */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #F8FAFC;
  font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #0F172A;
}

#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Custom Sleek Scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 184, 148, 0.25);
  border-radius: 999px;
  transition: background 0.2s ease;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 184, 148, 0.55);
}

/* Interactive cursor & touch adjustments */
button, [role="button"], a {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

/* Desktop card & interactive table transitions */
.desktop-interactive-card {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.desktop-interactive-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 184, 148, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

/* Hide scrollbar utility for clean mobile app feel */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

export function useInjectWebStyles() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const styleId = 'mediunify-web-global-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.type = 'text/css';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = CSS_STYLES;
  }, []);
}
