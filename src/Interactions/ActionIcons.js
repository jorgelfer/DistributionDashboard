import cursorImg from "../assets/cursor.png";
import brushImg from "../assets/brush.png";
import plusImg from "../assets/plus.png";

export default function ActionIcons(action) {

  switch (action) {
    case "cursor":
      return cursorImg;
    case "brush":
      return brushImg;
    case "plus":
      return plusImg;
    default:
      return null;
  };

};