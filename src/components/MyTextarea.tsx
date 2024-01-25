"use client";
import React, { useState, useRef, useEffect } from "react";

const MyTextarea = () => {
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([
    "variable1",
    "variable2",
    "variable3",
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [insideBrackets, setInsideBrackets] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Move the cursor to the end of the contentEditable div
    moveCursorToEnd();
  }, [content]);

  const moveCursorToEnd = () => {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(textareaRef.current);
    range.collapse(false); // Collapse the range to the end

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleContentChange = () => {
    const newText = textareaRef.current.innerText;
    setContent(newText);

    // Show suggestions only when "{{" is typed
    setShowSuggestions(newText.endsWith("{{"));

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(textareaRef.current);
    range.collapse(false); // Collapse the range to the end

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleKeyDown = (e) => {
    // Handle Control + Space to trigger suggestions
    if (e.ctrlKey && e.keyCode === 32) {
      e.preventDefault();
      if ((activeSection && activeSection.includes("{{}}")) || insideBrackets) {
        setShowSuggestions(!showSuggestions);
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setContent((prevText) => prevText + `${suggestion}}}`);
    setShowSuggestions(false);
  };

  const handleMouseClick = (event) => {
    const cursorPosition = window.getSelection()?.anchorOffset;
    const variableRegex = /\{\{(.*?)\}\}/g;
    // Find all matches of {{...}} in the content
    const matches = [...content.matchAll(variableRegex)];

    // Check if the cursor is inside any of the {{...}} brackets
    const isInsideBrackets = matches.some((match) => {
      const startOffset = match.index + 1;
      console.log(match.index, "matches-----------------");
      const endOffset = startOffset + match[0].length - 1;
      return cursorPosition >= startOffset && cursorPosition <= endOffset;
    });
    if (isInsideBrackets) {
      console.log("Cursor is inside {{}} brackets:", cursorPosition);

      //get the startIndex and endIndex of all the matches
      const getBracketLength = (matches) => {
        return matches.map((match) => {
          const startIndex = match.index;
          const endIndex = startIndex + match[0].length;
          return { startIndex, endIndex };
        });
      };
      //cursorPosition is greater then and equal startIndex and less then and equal endIndex then it is inside the bracket and selectedBracket is {startIndex, endIndex}
      const getSelectedBracket = (bracketsLength) => {
        for (let i = 0; i < bracketsLength.length; i++) {
          if (
            cursorPosition >= bracketsLength[i].startIndex &&
            cursorPosition <= bracketsLength[i].endIndex
          ) {
            return bracketsLength[i];
          }
        }
      };
      //all brackets length
      const bracketsLength = getBracketLength(matches);
      console.log(bracketsLength, "bracketsLength-----------------");
      //selected bracket
      const selectedBracket = getSelectedBracket(bracketsLength);

      setShowSuggestions(true);
      setSelectedBracket(selectedBracket);
      setInsideBrackets(true);
    } else {
      console.log("Cursor is outside {{}} brackets:", cursorPosition);
      setInsideBrackets(false);
    }
  };

  console.log(selectedBracket);

  // Function to apply styles to the selected bracket
  const applyStyles = (content, start, end) => {
    return (
      content.substring(0, start) +
      '<span style="color: yellow;">' +
      content.substring(start, end + 1) +
      "</span>" +
      content.substring(end + 1)
    );
  };
  return (
    <div>
      <div
        ref={textareaRef}
        contentEditable={true}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onClick={handleMouseClick}
        // dangerouslySetInnerHTML={{
        //   __html: content,
        // }}
        dangerouslySetInnerHTML={{
          __html: selectedBracket
            ? applyStyles(
                content,
                selectedBracket?.startIndex,
                selectedBracket?.endIndex
              )
            : content,
        }}
        style={{ border: "1px solid #ccc", padding: "10px", minHeight: "50px" }}
      ></div>

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

export default MyTextarea;
