import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function Navbar() {
  return (
    <>
      <nav className="bg-primary flex shadow-secondary shadow-lg mb-10" >
        <div className="container mx-auto flex justify-end">
        </div>
      </nav>

      <ReactTooltip
        anchorId="app-navbar-email"
        place="left"
        content="Send me an email"
      />
    </>
  );
}

export default Navbar;
