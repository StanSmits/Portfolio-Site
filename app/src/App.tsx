import "./App.css";
import Footer from "./components/Footer/Footer";
import Title from "./components/Title/Title";
import CardsBody from "./components/CardsBody/CardsBody";

function App() {
  return (
    <div className="bg-primary min-h-screen text-white">
      <Title
        title="Stan Smits"
        span="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quibusdam, amet illo consequatur sit ab ratione, unde ipsa eligendi ut quo? Laborum distinctio qui molestias tenetur eos ipsa facilis beatae."
      ></Title>
      <CardsBody></CardsBody>
      <Footer></Footer>
    </div>
  );
}

export default App;
