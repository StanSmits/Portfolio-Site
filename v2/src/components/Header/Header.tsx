import ImageWithShapes from "./ImageWithShapes";
import TopWave from "../Dividers/TopWave";
import BottomWave from "../Dividers/BottomWave";

function Header() {
  return (
    <>
      <div className="container mx-auto">
        <div className="w-full flex flex-row justify-start p-4 pb-12 z-10 relative transition-all duration-500">
          <div className="container p-5 w-lg">
            <div>
              <span className="text-dark dark:text-light text-6xl font-semibold transition-all duration-500 inline-block pr-2 customcss__wave">
                👋
              </span>
              <h2 className="text-6xl font-semibold transition-all duration-500 customcss__header_text inline-block text-wrap whitespace-normal">
                Hi I’m Stan Smits
              </h2>
            </div>
            <p className="text-dark dark:text-light text-xl md:text-2xl lg:text-3xl text-clip max-w-xl font-thin transition-all duration-500">
              Stan Smits is a 19-year-old software engineer currently studying
              at Hogeschool Leiden. With a passion for problem-solving and
              innovation, Stan utilizes his technical expertise to develop and
              maintain cutting-edge software solutions. His strong work ethic,
              attention to detail, and collaborative approach make him a
              valuable asset to any team. Through his work at Hogeschool Leiden
              and beyond, Stan is committed to creating technology that not only
              meets the needs of today but also paves the way for a brighter
              future.
            </p>
            <div className="flex flex-row justify-start items-center mt-5 font-primary">
              <a
                href="#projects"
                className="transition-all duration-500 bg-card-secondary-blue dark:bg-card-secondary-blue text-light dark:text-light rounded-full py-2 px-6 hover:customcss__header_link hover:text-dark hover:dark:text-dark"
              >
                Learn More
              </a>
              <a
                className="text-dark m-4 dark:text-light hover:customcss__header_text transition-all duration-300"
                href="mailto:contact@stansmits.nl"
              >
                Contact me!
              </a>
            </div>
          </div>

          <div className="w-full h-full justify-center self-center hidden lg:flex">
            <ImageWithShapes />
          </div>
        </div>
      </div>
      <div className="w-screen z-0 relative">
        <TopWave />
      </div>
    </>
  );
}

export default Header;
