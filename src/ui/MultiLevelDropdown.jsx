import React, { useState, useRef } from "react";
import styled from "styled-components";

// Styled components for dropdown layout
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 8px;
  font-size: 1.2rem;
`;

const SubDropdownContent = styled(DropdownContent)`
  left: 100%;
  top: 0;
  z-index: 1001;
  margin-left: 1px; /* Slight margin to avoid any gaps */
`;

const DropdownItem = styled.div`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }

  &:focus {
    outline: 3px solid #ddd;
    background-color: #f1f1f1;
  }
`;

const DropdownItemWithSub = styled(DropdownItem)`
  position: relative;

  &:after {
    content: ">";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

function MultiLevelDropdown({ subCategories, onClickItem }) {
  const [showSubDropdown, setShowSubDropdown] = useState(false);
  const [activeSubCategories, setActiveSubCategories] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const timeoutRef = useRef(null);

  // Debug: Log the initial subCategories to ensure they are passed correctly
  console.log("Subcategories passed to MultiLevelDropdown:", subCategories);

  const handleMouseEnter = (subItem) => {
    clearTimeout(timeoutRef.current);

    console.log("Mouse entered:", subItem.title); // Debug: Log which item was hovered

    // Debug: Log the subcategories of the hovered item
    if (subItem.subCategories) {
      console.log(
        "Subcategories of",
        subItem.title,
        ":",
        subItem.subCategories
      );
    } else {
      console.log("No subcategories found for", subItem.title);
    }

    setActiveSubCategories(subItem.subCategories || []);
    setActiveItem(subItem);
    setShowSubDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowSubDropdown(false);
      setActiveSubCategories([]);
      setActiveItem(null);
      console.log("Mouse left, hiding sub-dropdown");
    }, 300);
  };

  const handleMouseEnterSubDropdown = () => {
    clearTimeout(timeoutRef.current);
    setShowSubDropdown(true);
    console.log("Mouse entered sub-dropdown, keeping it open");
  };

  const handleMouseLeaveSubDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setShowSubDropdown(false);
      setActiveSubCategories([]);
      console.log("Mouse left sub-dropdown, hiding it");
    }, 300);
  };

  const handleKeyDown = (e, subItem) => {
    if (e.key === "Enter") {
      onClickItem(subItem);
      setShowSubDropdown(false);
      console.log("Enter key pressed, selecting item:", subItem.title);
    }
  };

  return (
    <DropdownContainer>
      <DropdownContent show={true}>
        {subCategories.map((subItem) =>
          subItem.subCategories ? (
            <DropdownItemWithSub
              key={subItem.title}
              onMouseEnter={() => handleMouseEnter(subItem)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => handleMouseEnter(subItem)}
              onBlur={handleMouseLeave}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, subItem)}
            >
              {subItem.title}
              {showSubDropdown &&
                activeItem === subItem &&
                subItem.subCategories.length > 0 && (
                  <SubDropdownContent
                    onMouseEnter={handleMouseEnterSubDropdown}
                    onMouseLeave={handleMouseLeaveSubDropdown}
                    show={showSubDropdown}
                  >
                    {subItem.subCategories.map((nestedItem) => (
                      <DropdownItem
                        key={nestedItem.title}
                        onClick={() => {
                          onClickItem(nestedItem);
                          setShowSubDropdown(false);
                          console.log("Item clicked:", nestedItem.title);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, nestedItem)}
                        tabIndex={0}
                      >
                        {nestedItem.title}
                      </DropdownItem>
                    ))}
                  </SubDropdownContent>
                )}
            </DropdownItemWithSub>
          ) : (
            <DropdownItem
              key={subItem.title}
              onClick={() => {
                onClickItem(subItem);
                setShowSubDropdown(false);
                console.log("Item clicked:", subItem.title);
              }}
              onKeyDown={(e) => handleKeyDown(e, subItem)}
              tabIndex={0}
            >
              {subItem.title}
            </DropdownItem>
          )
        )}
      </DropdownContent>
    </DropdownContainer>
  );
}

export default React.memo(MultiLevelDropdown);
