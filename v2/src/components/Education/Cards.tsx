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
  ended_at: string;
  html_url?: string;
}

function getDataFromAPI(): CardInfo[] {
  const [data, setData] = useState<CardInfo[]>([]);

  useEffect(() => {
    axios.get("http://139.162.162.34:8080/education").then((response) => {
      setData(response.data);
    });
  }, []);

  return data;
}

function Cards({ title }: { title: string }) {
  let resultFromAPI = getDataFromAPI();

  return (
    <>
      <div className="flex flex-column items-center justify-center mb-10">
        <h2 className="text-6xl text-dark dark:text-light font-semibold text-center transition-all duration-500">
          Education
        </h2>
      </div>
      <div className="overflow-auto p-3">
        <Card cardInfo={resultFromAPI} />
      </div>
    </>
  );
}

export default Cards;
