import { useState, useEffect } from "react";
import axios from "axios";
import BottomWave from "../Dividers/BottomWave";
import Card from "./Card";

interface CardInfo {
  name: string;
  description: string;
  created_at: string;
  ended_at: string;
  html_url?: string;
}

function getDataFromAPI(): CardInfo[] {
  const [data, setData] = useState<CardInfo[]>([]);

  useEffect(() => {
    axios.get("http://139.162.162.34:8080/projects").then((response) => {
      setData(response.data);
    });
  }, []);

  return data;
}
function Projects() {
  let resultFromAPI = getDataFromAPI();

  return (
    <>
      <div className="transition-all duration-500 bg-off-grey dark:bg-off-blue pb-10 rounded-b-lg">
        <div className="flex flex-col items-center relative">
          <BottomWave />
          <h2
            id="projects"
            className="transition-all duration-500 text-6xl text-dark dark:text-light font-semibold absolute top-2/3"
          >
            Projects
          </h2>
        </div>
        <div className="container mt-4 mx-auto ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {resultFromAPI.map((card, index) => {
              return (
                <Card
                  cardInfo={{
                    name: card.name,
                    description: card.description,
                    created_at: card.created_at,
                    ended_at: card.ended_at,
                    html_url: card.html_url,
                  }}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
