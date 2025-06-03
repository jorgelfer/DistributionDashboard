import { useState } from "react";
import classes from "./Sidebar.module.css";

export default function Sidebar({ posts, onSelectPost, selectedPost }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={classes[`sidebar${isOpen ? ".open" : ""}`]}>
      <button onClick={toggleSidebar}>
        {isOpen ? "Configuration" : "Close"}
      </button>
      {isOpen && (
        <>
          <h2 className={classes["sidebar-text"]}> Configuration</h2>
        </>
      )}
    </aside>
  );
}
