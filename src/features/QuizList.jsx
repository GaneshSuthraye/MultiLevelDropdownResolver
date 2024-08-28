import React from "react";

// Placeholder component for listing quizzes
function QuizList({ topic }) {
  return (
    <div>
      <h2>{topic} Quizzes</h2>
      <ul>
        {/* Placeholder content - Replace with actual quiz data */}
        <li>Quiz 1 for {topic}</li>
        <li>Quiz 2 for {topic}</li>
        <li>Quiz 3 for {topic}</li>
      </ul>
    </div>
  );
}

export default QuizList;
