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
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function Card({ cardInfo }: { cardInfo: CardInfo[] }) {
  cardInfo.sort((a, b) => {
    return parseInt(a.created_at) - parseInt(b.created_at);
  });

  return cardInfo.length > 0 ? (
    <>
      <ol className="items-center sm:flex opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards animate-delay-200">
        {cardInfo.map((card, index) => (
          <li className="relative mb-6 sm:mb-0 w-full self-start min-w-[50%]" key={index}>
            <div className="flex items-center">
              <div className="z-10 flex items-center justify-center w-6 h-6 bg-secondary rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                <svg
                  aria-hidden="true"
                  className="w-3 h-3 text-blue-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="hidden sm:flex w-full bg-secondary h-0.5"></div>
            </div>
            <div className="mt-3 sm:pr-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {card.name}
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {stringTimeToDate(card.created_at)} - {stringTimeToDate(card.ended_at) == "Geen datum beschikbaar" ? "Heden" : stringTimeToDate(card.ended_at)}
              </time>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                {card.description || "Geen beschrijving beschikbaar"}
              </p>
              {card.html_url ? (
                <a
                  href={card.html_url || "#"}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 mt-2 bg-primary border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700"
                >
                  Learn more{" "}
                  <svg
                    className="w-3 h-3 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              ) : (
                <span></span>
              )}
            </div>
          </li>
        ))}
        <li className="relative mb-6 sm:mb-0 w-full self-start">
          <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-secondary rounded-full ring-0 ring-white sm:ring-8 shrink-0">
              <svg
                aria-hidden="true"
                className="w-3 h-3 text-blue-800"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </li>
      </ol>
    </>
  ) : (
    <div className="flex flex-col items-start justify-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Geen projecten beschikbaar
      </h1>
    </div>
  );
}

export default Card;
