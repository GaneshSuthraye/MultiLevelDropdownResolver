import React from "react";

// Placeholder component for listing tutorials
function TutorialList({ topic }) {
  return (
    <div>
      <h2>{topic} Tutorials</h2>
      <ul>
        {/* Placeholder content - Replace with actual tutorial data */}
        <li>Tutorial 1 for {topic}</li>
        <li>Tutorial 2 for {topic}</li>
        <li>Tutorial 3 for {topic}</li>
      </ul>
    </div>
  );
}

export default TutorialList;
