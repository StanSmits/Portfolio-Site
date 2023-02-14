import { Children } from "react";
import Cards from "../Cards/Cards";

function CardsBody() {
  return (
    <>
      <div className="flex flex-col self-start md:justify-center md:items-center mb-10 m-10">
        <div className="container">
          <div className="bg-card-bg rounded-md mb-5 p-5 max-h-sm self-center justify-center md:self-start w-full opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards">
            <Cards
              title="Projects"
              isEducation="false"
              description="Recent projects I worked on."
            ></Cards>
          </div>
          <div className="bg-card-bg rounded-md mb-5 p-5 max-h-sm self-center justify-center md:self-start w-full opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards">
            <Cards
              title="Education"
              isEducation="true"
              description="Education followed by me."
            ></Cards>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardsBody;
