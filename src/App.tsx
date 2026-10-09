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

const ToolsLayout = lazy(() => import('./layouts/ToolsLayout'));
const Calculator = lazy(() => import('./components/Tools/Calculator'));
const TOD = lazy(() => import('./components/Tools/ToeslagenOnregelmatigeDienst/TOD'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

function App() {
  return (
    <Router>
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
