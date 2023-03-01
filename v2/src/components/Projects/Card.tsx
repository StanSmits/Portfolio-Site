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
      <div className="m-3">
        <h2 className="text-lg mb-2 font-semibold text-light m-4">
          {cardInfo.name}
          <span className="text-sm text-teal-800 font-thin bg-teal-100 inline rounded-full px-2 align-top float-right animate-pulse text-light">
            {stringTimeToDate(cardInfo.created_at)} - {stringTimeToDate(cardInfo.ended_at)}
          </span>
        </h2>
        <p className="mx-4 my-2 font-thin text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 text-light">
          {cardInfo.description}
        </p>
        <button className="font-primary text-sm text-light bg-card-secondary-blue p-2 m-2 rounded-lg">
          <a href={cardInfo.html_url}>
            Learn more <i className="mx-2 fa-solid fa-arrow-right"></i>
          </a>
        </button>
      </div>
    </div>
  );
}

export default Card;
