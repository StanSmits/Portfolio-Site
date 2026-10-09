import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SkipLink } from './components/A11y/SkipLink';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { ScrollManager } from './components/layout/ScrollManager';
import { LanguagePrompt } from './components/LanguagePrompt/LanguagePrompt';
import { PageFallback } from './components/LoadingSpinner/LoadingSpinner';
import HomePage from './pages/HomePage';
import { ToolsList } from './components/Tools/ToolsList';
// The tool pages are a few kilobytes; loading them eagerly avoids layout shift from nested fallbacks.
import ToolsLayout from './layouts/ToolsLayout';
import Calculator from './components/Tools/Calculator';
import TOD from './components/Tools/ToeslagenOnregelmatigeDienst/TOD';

const NotFound = lazy(() => import('./components/NotFound/NotFound'));

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollManager />
      <SkipLink />
      <SiteHeader />
      <div className="grain" aria-hidden="true" />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsLayout />}>
            <Route index element={<ToolsList />} />
            <Route path="calculator" element={<Calculator />} />
            <Route path="tod" element={<TOD />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <SiteFooter />
      <LanguagePrompt />
    </Router>
  );
}

export default App;
