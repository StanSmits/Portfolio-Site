import { useEffect } from "react";
import cute_guy from "../../assets/images/cute_guy.png";
import header_bg_blob from "../../assets/svg/header_bg_blob.svg";
import shapes_svg from "../../assets/svg/shapes.svg";

const ImageWithShapes = () => {
  return (
<figure className="relative group transition-all duration-300">
  <div className="w-full justify-center self-center transition-all duration-300">
    <img
      src={cute_guy}
      alt="Stan Smits"
      className="w-full h-full drop-shadow-2xl rounded-full"
    />
  </div>
  <div className="image-background transition-all duration-300"></div>
  <div className="transition-all duration-300 item-shapes hidden lg:block group-hover:animate-wiggle group-hover:animate-infinite group-hover:animate-duration-[2500ms] group-hover:animate-ease-in-out"></div>
</figure>

  );
};

export default ImageWithShapes;
