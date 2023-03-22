export default function TopWave() {
  return (
    <>
      <div className="absolute bottom-0 left-0 w-screen">
        <svg
          viewBox="0 0 1280 384"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <g clipPath="url(#clip0_24_18)">
            <path
              d="M0 314.417L53.3333 301.369C106.667 288.251 213.333 262.156 320 237.773C426.667 213.39 533.333 190.86 640 201.412C746.667 211.964 853.333 255.74 960 236.133C1066.67 216.527 1173.33 133.538 1226.67 92.1148L1280 50.6204V385.713H1226.67C1173.33 385.713 1066.67 385.713 960 385.713C853.333 385.713 746.667 385.713 640 385.713C533.333 385.713 426.667 385.713 320 385.713C213.333 385.713 106.667 385.713 53.3333 385.713H0V314.417Z"
              fill="#715DF2"
            />
          </g>
          <defs>
            <clipPath id="clip0_24_18">
              <rect width="1280" height="385" fill="white" />
            </clipPath>
          </defs>
        </svg>

        {/* // Arrow Down */}
        <a href="#projects">
          <svg
            width="24"
            height="32"
            viewBox="0 0 24 32"
            fill="none"
            className="absolute top-3/4 left-1/2 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_24_24)">
              <path
                d="M10.5875 29.4125C11.3687 30.1938 12.6375 30.1938 13.4187 29.4125L23.4187 19.4125C24.2 18.6313 24.2 17.3625 23.4187 16.5812C22.6375 15.8 21.3687 15.8 20.5875 16.5812L14 23.175V4C14 2.89375 13.1062 2 12 2C10.8937 2 9.99999 2.89375 9.99999 4V23.1688L3.41249 16.5875C2.63124 15.8062 1.36249 15.8062 0.581238 16.5875C-0.200012 17.3687 -0.200012 18.6375 0.581238 19.4188L10.5812 29.4188L10.5875 29.4125Z"
                fill="#F2F2F2"
              />
            </g>
            <defs>
              <clipPath id="clip0_24_24">
                <rect width="24" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
      </div>
    </>
  );
}
