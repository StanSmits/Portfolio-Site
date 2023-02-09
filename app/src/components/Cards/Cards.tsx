// Get the data from the API
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface CardInfo {
  name: string;
  description: string;
  created_at: string;
  html_url?: string;
}

function getDataFromAPI(isEducation: boolean): CardInfo[] {
  const [data, setData] = useState<CardInfo[]>([]);

  if (isEducation) {
    useEffect(() => {
      axios
        .get("http://127.0.0.1:8080/education")
        .then((response) => {
          setData(response.data);
        });
    }, []);
  } else {
    useEffect(() => {
      axios
        .get("http://127.0.0.1:8080/projects")
        .then((response) => {
          setData(response.data);
        });
    }, []);
  }

  return data;
}

function Cards({
  title,
  description,
  isEducation,
}: {
  title: string;
  description: string;
  isEducation: string;
}) {
  let isEducationTrue = isEducation === "true";
  let resultFromAPI = getDataFromAPI(isEducationTrue);

  return (
    <>
      <div className="flex flex-column">
        <h1 className="font-sans text-white text-2xl font-bold">{title}</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3 h-3"
          id={title}
          date-for={title}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </div>
      {typeof description === "string" && (
        <p className="font-sans text-white text-sm font-normal mb-4 ml-1">
          {description}
        </p>
      )}
      <div className="overflow-auto p-3">
        <Card cardInfo={resultFromAPI} />
      </div>

      <ReactTooltip
        anchorId={title}
        place="right"
        content="This list displays only the last 3 items"
        className="bg-danger rounded text-white text-sm drop-shadow-sm"
      />
    </>
  );
}

export default Cards;
