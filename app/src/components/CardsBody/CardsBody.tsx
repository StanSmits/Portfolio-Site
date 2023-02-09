import { Children } from "react";
import Cards from "../Cards/Cards";

function CardsBody() {
  // Flexbox for the cards
  // When its mobile, it should be a column
  // When its desktop, it should be a row
  // Have the overlaying div be the color secondary
  // padding within the cards
  // margin between the cards
  // margin between the cards and the footer

  return (
    <>
      <div className="flex flex-col self-start md:justify-center md:items-center mb-10">
        <div className="container">
          <div className="bg-card-bg rounded-md mb-5 p-5 max-h-sm self-center justify-center md:self-start w-full">
            <Cards
              title="Projects"
              isEducation="false"
              description="Recent projects I worked on."
            ></Cards>
          </div>
          <div className="bg-card-bg rounded-md mb-5 p-5 max-h-sm self-center justify-center md:self-start w-full">
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
