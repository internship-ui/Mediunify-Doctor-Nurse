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

/* ============================================================== */
/* SLIDE-OVER DRAWER & CARAMEL SCROLLBAR STYLING (AS SHOWN IN IMAGE) */
/* ============================================================== */
#doctor-slide-drawer-sheet,
div[id="doctor-slide-drawer-sheet"],
div[data-testid="doctor-slide-drawer-sheet"] {
  position: fixed !important;
  top: 0px !important;
  bottom: 0px !important;
  right: 0px !important;
  left: 50vw !important;
  width: 50vw !important;
  min-width: 50vw !important;
  max-width: 50vw !important;
  height: 100vh !important;
  max-height: 100vh !important;
  margin: 0px !important;
  padding: 0px !important;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  box-shadow: -10px 0px 40px rgba(0, 0, 0, 0.35) !important;
  z-index: 1000000 !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  background-color: #FFFFFF !important;
}

#doctor-slide-drawer-sheet,
#doctor-slide-drawer-sheet *,
[data-testid="doctor-slide-drawer-sheet"],
[data-testid="doctor-slide-drawer-sheet"] *,
div[id^="doctor-drawer-scroll-body"],
div[id^="doctor-drawer-scroll-body"] * {
  scrollbar-width: auto !important;
  scrollbar-color: #C89252 #F1F5F9 !important;
}

#doctor-slide-drawer-sheet ::-webkit-scrollbar,
[data-testid="doctor-slide-drawer-sheet"] ::-webkit-scrollbar,
div[id="doctor-slide-drawer-sheet"] ::-webkit-scrollbar,
div[id^="doctor-drawer-scroll-body"]::-webkit-scrollbar,
div[id^="doctor-drawer-scroll-body"] *::-webkit-scrollbar {
  width: 16px !important;
  height: 16px !important;
  display: block !important;
  background-color: #F1F5F9 !important;
}

#doctor-slide-drawer-sheet ::-webkit-scrollbar-track,
[data-testid="doctor-slide-drawer-sheet"] ::-webkit-scrollbar-track,
div[id="doctor-slide-drawer-sheet"] ::-webkit-scrollbar-track,
div[id^="doctor-drawer-scroll-body"]::-webkit-scrollbar-track,
div[id^="doctor-drawer-scroll-body"] *::-webkit-scrollbar-track {
  background: #F1F5F9 !important;
  border-radius: 9999px !important;
  margin: 6px 2px !important;
  border: 1px solid #E2E8F0 !important;
}

#doctor-slide-drawer-sheet ::-webkit-scrollbar-thumb,
[data-testid="doctor-slide-drawer-sheet"] ::-webkit-scrollbar-thumb,
div[id="doctor-slide-drawer-sheet"] ::-webkit-scrollbar-thumb,
div[id^="doctor-drawer-scroll-body"]::-webkit-scrollbar-thumb,
div[id^="doctor-drawer-scroll-body"] *::-webkit-scrollbar-thumb {
  background: #C89252 !important;
  border-radius: 9999px !important;
  border: 3px solid #F1F5F9 !important;
  min-height: 50px !important;
}

#doctor-slide-drawer-sheet ::-webkit-scrollbar-thumb:hover,
[data-testid="doctor-slide-drawer-sheet"] ::-webkit-scrollbar-thumb:hover,
div[id="doctor-slide-drawer-sheet"] ::-webkit-scrollbar-thumb:hover,
div[id^="doctor-drawer-scroll-body"]::-webkit-scrollbar-thumb:hover,
div[id^="doctor-drawer-scroll-body"] *::-webkit-scrollbar-thumb:hover {
  background: #B37D3E !important;
}

div[id^="doctor-drawer-scroll-body"] {
  overflow-y: scroll !important;
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

/* User specified Role Selection background with top-right radial gradient glow */
.page {
  position: relative;
  background: #fff;
  overflow: hidden;
}
.page::before {
  content: "";
  position: absolute;
  top: -180px;
  right: -120px;
  width: 620px;
  height: 420px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 40%, #f7d6ee 0%, transparent 60%),
    radial-gradient(circle at 70% 50%, #d6e4ff 0%, transparent 65%),
    radial-gradient(circle at 50% 70%, #d3f4ea 0%, transparent 60%);
  filter: blur(40px);
  opacity: .9;
  z-index: 0;
  pointer-events: none;
}
.page > * {
  position: relative;
  z-index: 1;
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
