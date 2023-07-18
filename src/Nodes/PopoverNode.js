import React, { useState } from "react";
import "./CustomNode.css";

const PopoverNode = ({ id, label, popoverContent }) => {
  const [showPopover, setShowPopover] = useState(false);

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  return (
    <div
      className="custom-node"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {label}
      {showPopover && <div className="popover">{popoverContent}</div>}
    </div>
  );
};

export default PopoverNode.popoverContent;
