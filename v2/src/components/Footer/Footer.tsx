import axios from "axios";
import { useState, useEffect } from "react";

async function getLatestReleaseFromGithub() {
  const url =
    "https://api.github.com/repos/stansmits/Portfolio-Site/releases/latest";
  const response = await axios.get(url);
  // If there is no data, return null
  if (!response.data) {
    return null;
  }
  // If there is data, return the tag_name
  return response.data.tag_name;
}

function Footer() {
  const [version, setVersion] = useState<string | null>(null);
  getLatestReleaseFromGithub().then((data) => {
    setVersion(data);
  });

  return (
    <div className="bg-card-primary-blue w-screen">
      <div className="container mx-auto">
        <div className="w-full">
          <ul className="p-5 flex flex-col md:flex-row justify-between items-center">
            <div>
              <li className="flex flex-row gap-2">
                <p className="text-light font-primary text-md">
                  &copy; Stan Smits | 2023 - {new Date().getFullYear()}
                </p>
                {version === null ? (
                  <p></p>
                ) : (
                  <p className="text-light font-primary text-md">
                    Version: {version}
                  </p>
                )}
              </li>
            </div>
            <div className="flex flex-row">
              <li className="mx-2">
                <a href="mailto:contact@stansmits.nl">
                  <i className="fa-solid fa-envelope text-light text-xl hover:text-purple transition-all duration-300"></i>
                </a>
              </li>
              <li className="mx-2">
                <a
                  href="https://www.linkedin.com/in/stan-smits-63227b21a/"
                  target="_blank"
                >
                  <i className="fa-brands fa-linkedin text-light text-xl hover:text-purple transition-all duration-300"></i>
                </a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
