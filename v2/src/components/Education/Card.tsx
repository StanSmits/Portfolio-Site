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
  
  function Card({ cardInfo }: { cardInfo: CardInfo[] }) {
    cardInfo.sort((a, b) => {
      return parseInt(a.created_at) - parseInt(b.created_at);
    });
  
    return cardInfo.length > 0 ? (
      <>
      <div className="bg-card-primary-blue w-full overflow-auto rounded-3xl p-0 sm:p-10">
        <ol className="items-center sm:flex opacity-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-forwards animate-delay-200 p-10">
          {cardInfo.map((card, index) => (
            <li className="relative mb-6 sm:mb-0 w-full self-start min-w-[50%]" key={index}>
              <div className="flex items-center">
                <div className="transition-all duration-500 z-10 flex items-center justify-center w-6 h-6 bg-dark dark:bg-light rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                  <svg
                    aria-hidden="true"
                    className="w-3 h-3 text-light dark:text-dark transition-all duration-500"
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
                <div className="transition-all duration-500 hidden sm:flex w-full bg-light h-0.5"></div>
              </div>
              <div className="mt-3 sm:pr-8">
                <h3 className="text-lg font-semibold text-light">
                  {card.name}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-light">
                  {stringTimeToDate(card.created_at)} - {stringTimeToDate(card.ended_at) == "Geen datum beschikbaar" ? "Heden" : stringTimeToDate(card.ended_at)}
                </time>
                <p className="text-base font-normal text-light">
                  {card.description || "Geen beschrijving beschikbaar"}
                </p>
              </div>
            </li>
          ))}
          <li className="relative mb-6 sm:mb-0 w-full self-start pr-5">
            <div className="flex items-center">
            <div className="transition-all duration-500 z-10 flex items-center justify-center w-6 h-6 bg-dark dark:bg-light rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                  <svg
                    aria-hidden="true"
                    className="transition-all duration-500 w-3 h-3 text-light dark:text-dark"
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
        </div>
      </>
    ) : (
      <div className="flex flex-col items-start justify-center">
        <h1 className="transition-all duration-500 text-2xl font-semibold text-gray-900 dark:text-white">
          Error while fetching items
        </h1>
      </div>
    );
  }
  
  export default Card;