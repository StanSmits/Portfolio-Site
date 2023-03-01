function Footer() {
  return (
    <div className="bg-card-primary-blue w-screen">
      <ul className="p-5 flex flex-col md:flex-row justify-between items-center">
        <div>
          <li>
            <p className="text-light font-primary text-md">
              &copy; Stan Smits | 2023 - {new Date().getFullYear()}
            </p>
          </li>
        </div>
        <div className="flex flex-row">
          <li className="mx-2">
            <a href="mailto:contact@stansmits.nl">
              <i className="fa-solid fa-envelope text-light text-xl hover:text-purple transition-all duration-300"></i>
            </a>
          </li>
          <li className="mx-2">
          <a href="https://www.linkedin.com/in/stan-smits-63227b21a/">
          <i className="fa-brands fa-linkedin text-light text-xl hover:text-purple transition-all duration-300"></i>
            </a>
          </li>
        </div>
      </ul>
    </div>
  );
}

export default Footer;
