import { memo, useContext } from "react";
import { ThemeContext } from "../../themeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

export const DarkModeToggle = memo(() => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="h-8 w-8">
      {theme === "dark" ? (
        <FontAwesomeIcon
          icon={faSun}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className='text-light w-full h-full transition-all duration-500'
        />
      ) : (
        <FontAwesomeIcon
          icon={faMoon}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className='text-dark w-full h-full transition-all duration-500'
        />
      )}
    </div>
  );
});
