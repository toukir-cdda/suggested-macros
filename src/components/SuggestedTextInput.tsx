"use client";
import React, { useState, useRef, useEffect } from "react";

const SuggestedTextInput = () => {
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([
    "variable1",
    "variable2",
    "variable3",
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const textareaRef = useRef(null);
  const handleMouseClick = () => {
    const cursorPosition = textareaRef.current.selectionStart;
    const variableRegex = /\{\{(.*?)\}\}/g;
    // console.log(cursorPosition, "match");
    // Find all matches of {{...}} in the content
    const matches = [...content.matchAll(variableRegex)];

    // Check if the cursor is inside any of the {{...}} brackets
    const isInsideBrackets = matches.some((match) => {
      const startOffset = match.index;

      const endOffset = startOffset + match[0].length;
      return cursorPosition >= startOffset && cursorPosition <= endOffset;
    });

    if (isInsideBrackets) {
      console.log(
        "Cursor is inside >-----------------{{}}---------------< brackets:",
        cursorPosition
      );
    } else {
      console.log("Cursor is outside {{}} brackets:", cursorPosition);
    }
  };
  const handleKeyDown = (e) => {
    // Handle arrow key presses
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      handleMouseClick(); // Trigger the same logic as mouse click
    }

    // Handle Control + Space to trigger suggestions
    if (e.ctrlKey && e.keyCode === 32) {
      e.preventDefault();
      if (activeSection && activeSection.includes("{{}}")) {
        setShowSuggestions(!showSuggestions);
      }
    }
  };
  useEffect(() => {
    // Attach event listeners
    textareaRef.current.addEventListener("input", handleMouseClick);
    textareaRef.current.addEventListener("click", handleMouseClick);
    textareaRef.current.addEventListener("keydown", handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      textareaRef.current.removeEventListener("input", handleMouseClick);
      textareaRef.current.removeEventListener("click", handleMouseClick);
      textareaRef.current.removeEventListener("keydown", handleKeyDown);
    };
  }, [content, activeSection, showSuggestions]);

  const handleContentChange = () => {
    const newText = textareaRef.current.value;
    setContent(newText);

    // Detect '{{' and trigger suggestions
    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;

    const matches = newText.match(/{{([^{}]*)}}/g);

    if (matches) {
      const activeSectionMatch = matches.find(
        (match) =>
          selectionStart >= newText.indexOf(match) &&
          selectionEnd <= newText.indexOf(match) + match.length
      );

      setActiveSection(activeSectionMatch);
    } else {
      setActiveSection(null);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    // Insert selected variable at the active {{}} section or at the cursor position
    if (activeSection && activeSection.includes("{{}}")) {
      const startOffset = content.indexOf(activeSection);
      const endOffset = startOffset + activeSection.length;

      const beforeCursor = content.slice(0, startOffset);
      const afterCursor = content.slice(endOffset);

      const newContent = beforeCursor + `{{${suggestion}}}` + afterCursor;

      setContent(newContent);
    }

    // Move the cursor to the end of the modified content
    textareaRef.current.setSelectionRange(
      textareaRef.current.selectionStart + suggestion.length + 4,
      textareaRef.current.selectionStart + suggestion.length + 4
    );

    // Hide the suggestion box
    setShowSuggestions(false);
    setActiveSection(null);
  };

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        style={{ border: "1px solid #ccc", padding: "10px", minHeight: "50px" }}
      />

      {showSuggestions && (
        <div
          style={{ border: "1px solid #ccc", marginTop: "5px", padding: "5px" }}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              style={{ cursor: "pointer", padding: "5px" }}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedTextInput;
