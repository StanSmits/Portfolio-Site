interface CardInfo {
  name: string;
  description: string;
  created_at: string;
  ended_at: string;
  html_url?: string;
}

const stringTimeToDate = (time: string | undefined) => {
  if (!time) return "Geen datum beschikbaar";

  let formattedTime = parseInt(time) * 1000;

  return new Date(formattedTime).toLocaleDateString("nl-NL", {
    month: "long",
    year: "numeric",
  });
};

function Card({ cardInfo }: { cardInfo: CardInfo }) {
  return (
    <div className="card m-2 mt-5 rounded-lg hover:shadow-md hover:border-opacity-0 transform sm:hover:-translate-y-1 transition-all duration-200 bg-card-primary-blue">
      <div className="w-full h-full">
        <div className="h-full w-full flex justify-between flex-col p-3">
          <h2 className="text-lg mb-0 font-semibold text-light m-4">
            {cardInfo.name}
          </h2>
          <span className="text-sm text-teal-800 font-thin bg-light dark:bg-dark rounded-full p-2 mx-2 text-dark dark:text-light w-fit h-fit">
            {stringTimeToDate(cardInfo.created_at)} -{" "}
            {stringTimeToDate(cardInfo.ended_at)}
          </span>
          <p className="mx-4 my-2 font-thin text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 text-light">
            {cardInfo.description}
          </p>
          <a href={cardInfo.html_url} target="_blank" className="w-fit h-fit font-primary text-sm text-light bg-card-secondary-blue p-2 m-2 rounded-lg">
              Learn more <i className="mx-2 fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Card;
