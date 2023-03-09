import { DarkModeToggle } from "./DarkModeToggle";

function Navbar() {
    return (
        <>
            <div className="transition-all duration-500 w-full flex flex-row justify-end p-5 bg-light dark:bg-dark sticky top-0 z-50">
                <DarkModeToggle />
            </div>
        </>
    )
}

export default Navbar;