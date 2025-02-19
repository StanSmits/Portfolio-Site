import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadingSpinner } from "./components/LoadingSpinner/LoadingSpinner";
import { Footer } from "./components/Footer/Footer";
import { BackgroundGradient } from "./components/BackgroundGradient/BackgroundGradient";
import { LanguagePrompt } from "./components/LanguagePrompt/LanguagePrompt";
import TOD from "./components/Tools/ToeslagenOnregelmatigeDienst/TOD";
import { ToolsList } from "./components/Tools/ToolsList";

// Lazy loaded components
const Hero = React.lazy(() => import("./components/Hero/Hero"));
const ExperienceSection = React.lazy(
  () => import("./components/Experience/ExperienceSection")
);
const EducationSection = React.lazy(
  () => import("./components/Education/EducationSection")
);
const ContactSection = React.lazy(
  () => import("./components/Contact/ContactSection")
);
const ToolsLayout = React.lazy(() => import("./layouts/ToolsLayout"));
const Calculator = React.lazy(() => import("./components/Tools/Calculator"));
const NotFound = React.lazy(() => import("./components/NotFound/NotFound"));

function App() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [latestCommit, setLatestCommit] = React.useState<{
    sha: string;
    html_url: string;
  } | null>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  React.useEffect(() => {
    const fetchLatestCommit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.github.com/repos/StanSmits/Portfolio-Site/commits"
        );
        const data = await response.json();
        const latestCommit = data[0];
        setLatestCommit({
          sha: latestCommit.sha,
          html_url: latestCommit.html_url,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching latest commit:", error);
        setIsLoading(false);
      }
    };

    fetchLatestCommit();
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen text-white" role="main">
        {isLoading && <LoadingSpinner />}
        <BackgroundGradient mousePosition={mousePosition} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Suspense fallback={<LoadingSpinner />}>
                  <Hero mousePosition={mousePosition} />
                  <EducationSection />
                  <ExperienceSection mousePosition={mousePosition} />
                  <ContactSection />
                </Suspense>
              </>
            }
          />
          <Route
            path="/tools"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ToolsLayout />
              </Suspense>
            }
          >
            <Route index element={<ToolsList />} />
            <Route
              path="calculator"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Calculator />
                </Suspense>
              }
            />
            <Route
              path="tod"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TOD />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
        <Footer latestCommitNumber={latestCommit} />
        <LanguagePrompt />
      </div>
    </Router>
  );
}

export default App;