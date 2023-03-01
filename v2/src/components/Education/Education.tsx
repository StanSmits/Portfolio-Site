import Cards from "./Cards";

function Education() {
  return (
    <div className="flex flex-col self-start md:justify-center md:items-center pb-10 mx-10 mt-10">
      <div className="container">
        <div className="bg-card-bg rounded-md mb-5 p-5 max-h-sm self-center justify-center md:self-start w-full opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards transition-all duration-500">
          <Cards
            title="Education"
          ></Cards>
        </div>
      </div>
    </div>
  );
}

export default Education;
