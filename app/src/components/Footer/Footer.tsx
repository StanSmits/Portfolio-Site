import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Footer() {
  return (
    <>
      <footer className="bg-primary flex drop-shadow-footer z-50 items-center fixed bottom-0 w-full max-w-screen">
        <span className="justify-start w-full ml-4 p-3">
          &copy; Stan Smits | 2023 - {new Date().getFullYear()}
        </span>
      </footer>
    </>
  );
}

export default Footer;
