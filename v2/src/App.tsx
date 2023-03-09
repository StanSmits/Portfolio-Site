import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import Education from "./components/Education/Education";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Projects from "./components/Projects/Projects";



function App() {
  const [loadingInProgress, setLoading] = useState(true);

  useEffect(() => {
    const onPageLoad = () => {
      setLoading(false)
      // do something else
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);

  return (
    <>
     {loadingInProgress ? (
        <div className="loader-container w-screen h-screen grid place-content-center transition-all duration-500">
          <BeatLoader color={'#715DF2'} size={150} loading={loadingInProgress} />
        </div>
      ) : (
      <><Navbar /><Header /><Projects /><Education /><Footer /></>
      )}
    </>
  );
}

export default App;
