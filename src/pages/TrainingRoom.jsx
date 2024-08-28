import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import MultiLevelDropdown from "../ui/MultiLevelDropdown";
import TutorialList from "../features/TutorialList";
import QuizList from "../features/QuizList";

// Styled-components for layout and design
const TopBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.7rem;
  background: var(--color-grey-0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const NavItem = styled.li`
  text-align: center;
  cursor: pointer;
  padding: 10px;
  border-bottom: 3px solid transparent;
  position: relative;

  &:hover,
  &.active {
    border-bottom-color: var(--color-primary);
  }

  &:focus {
    outline: 2px solid var(--color-primary);
  }
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-top: 20px;
`;

// Fallback content when no topic/method is selected
const DefaultContent = () => (
  <div>
    <p>Please select a topic and learning method to get started.</p>
  </div>
);

// Memoized NavItemComponent for better performance
const NavItemComponent = React.memo(
  ({
    topic,
    method,
    setActiveTopic,
    setActiveMethod,
    activeTopic,
    activeMethod,
    handleKeyDown,
  }) => (
    <NavItem
      onClick={() => {
        if (method) {
          setActiveMethod(method);
        } else {
          setActiveTopic(topic);
        }
      }}
      onKeyDown={(e) => handleKeyDown(e, topic, method)}
      className={
        method ? activeMethod === method : activeTopic === topic ? "active" : ""
      }
      tabIndex={0}
      role="menuitem"
      aria-haspopup={!!method}
      aria-expanded={method ? activeMethod === method : activeTopic === topic}
    >
      {method || topic}
    </NavItem>
  )
);

// Main component for the Training Room
function TrainingRoom() {
  const [activeTopic, setActiveTopic] = useState(""); // Track the active topic
  const [activeMethod, setActiveMethod] = useState(""); // Track the active learning method
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track if the dropdown is open
  const dropdownRef = useRef(null); // Ref for detecting outside clicks on dropdown

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if click is outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized callback to render content based on active topic and method
  const renderContent = useCallback(() => {
    if (!activeTopic || !activeMethod) {
      return <DefaultContent />;
    }

    const contentMapping = {
      "Technology & Innovation": {
        Tutorials: <TutorialList topic="Technology & Innovation" />,
        Quizzes: <QuizList topic="Technology & Innovation" />,
      },
      Languages: {
        Tutorials: <TutorialList topic="Languages" />,
        Quizzes: <QuizList topic="Languages" />,
      },
    };

    return contentMapping[activeTopic]?.[activeMethod] || <DefaultContent />;
  }, [activeTopic, activeMethod]);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e, topic, method = null) => {
    if (e.key === "Enter") {
      if (method) {
        setActiveMethod(method);
      } else {
        setActiveTopic(topic);
      }
    }
  };

  // Toggle dropdown on hover or focus
  const toggleDropdown = (state) => {
    setIsDropdownOpen(state);
  };

  return (
    <div>
      {/* Navigation bar for selecting topics */}
      <TopBarWrapper>
        <NavList>
          <NavItem
            onMouseEnter={() => toggleDropdown(true)} // Open the dropdown
            onMouseLeave={() => toggleDropdown(false)} // Close the dropdown
            onFocus={() => toggleDropdown(true)} // Open on focus
            onBlur={() => toggleDropdown(false)} // Close on blur
            ref={dropdownRef}
            tabIndex={0} // Make the item focusable for accessibility
            onKeyDown={(e) => handleKeyDown(e, "Technology & Innovation")}
            aria-haspopup="true" // Indicates that this element has a popup menu
            aria-expanded={isDropdownOpen} // Indicates whether the popup menu is open or not
          >
            <span>Technology & Innovation</span>
            {isDropdownOpen && (
              <MultiLevelDropdown
                subCategories={[
                  {
                    title: "Coding & Development",
                    subCategories: [
                      {
                        title: "Frontend Development",
                        subCategories: [
                          { title: "React", link: "/frontend/react" },
                          { title: "Vue.js", link: "/frontend/vue" },
                          { title: "Angular", link: "/frontend/angular" },
                          { title: "HTML & CSS", link: "/frontend/html-css" },
                          { title: "JavaScript", link: "/frontend/javascript" },
                        ],
                      },
                      {
                        title: "Backend Development",
                        subCategories: [
                          { title: "Node.js", link: "/backend/nodejs" },
                          { title: "Python", link: "/backend/python" },
                          { title: "Java", link: "/backend/java" },
                        ],
                      },
                      {
                        title: "Mobile Development",
                        link: "/mobile",
                      },
                      {
                        title: "Cloud & DevOps",
                        link: "/cloud-devops",
                      },
                      {
                        title: "Cybersecurity",
                        link: "/cybersecurity",
                      },
                    ],
                  },
                  {
                    title: "Artificial Intelligence (AI)",
                    subCategories: [
                      { title: "Machine Learning" },
                      { title: "Deep Learning" },
                      { title: "Natural Language Processing (NLP)" },
                      { title: "Computer Vision" },
                      { title: "AI Ethics" },
                    ],
                  },
                ]}
                onClickItem={(item) => {
                  setActiveTopic("Technology & Innovation");
                  setIsDropdownOpen(false);
                }}
              />
            )}
          </NavItem>
          {["Languages"].map((topic) => (
            <NavItemComponent
              key={topic}
              topic={topic}
              setActiveTopic={setActiveTopic}
              setActiveMethod={setActiveMethod}
              activeTopic={activeTopic}
              activeMethod={activeMethod}
              handleKeyDown={handleKeyDown}
            />
          ))}
        </NavList>

        {/* Navigation bar for selecting learning methods */}
        {activeTopic && (
          <NavList>
            {["Tutorials", "Quizzes"].map((method) => (
              <NavItemComponent
                key={method}
                topic={activeTopic}
                method={method}
                setActiveTopic={setActiveTopic}
                setActiveMethod={setActiveMethod}
                activeTopic={activeTopic}
                activeMethod={activeMethod}
                handleKeyDown={handleKeyDown}
              />
            ))}
          </NavList>
        )}
      </TopBarWrapper>

      {/* Content area to display the selected topic and method */}
      <Content>{renderContent()}</Content>
    </div>
  );
}

export default TrainingRoom;
