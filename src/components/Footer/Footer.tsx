import React, { useState } from "react";
import { NavigationLink } from "../Navigation/NavigationLink";
import { ToolsMenu } from "../Navigation/ToolsMenu";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import { useTranslation } from "react-i18next";

interface FooterProps {
  latestCommitNumber: { sha: string; html_url: string } | null;
}

export const Footer: React.FC<FooterProps> = ({ latestCommitNumber }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <footer className="border-t border-gray-800 px-4 py-6">
      <div className="container mx-auto flex items-center justify-between max-w-screen-lg">
        <nav className="flex items-center space-x-2">
          <NavigationLink to="/">{t("footer.home")}</NavigationLink>
          <span className="text-gray-600">|</span>
          <ToolsMenu />
          <span className="text-gray-600">|</span>
          <LanguageSelector />
        </nav>
        <div className="flex flex-row md:flex-col items-end relative">
          <p
            className="text-gray-400 text-right cursor-pointer"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            © {currentYear} Stan Smits
          </p>
          {latestCommitNumber && (
            <>
              {showDropdown && (
                <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-gray-900/95 p-2 shadow-lg backdrop-blur-sm md:hidden">
                  <a
                    href={latestCommitNumber.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-purple-400 hover:underline"
                  >
                    {t("footer.latestCommit") + " " + latestCommitNumber.sha.substring(0, 7)}
                  </a>
                </div>
              )}
              <a
                href={latestCommitNumber.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block text-purple-400 hover:underline"
              >
                {t("footer.latestCommit") + " " + latestCommitNumber.sha.substring(0, 7)}
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};