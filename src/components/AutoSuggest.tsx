"use client";
// AutoSuggest.js
import React, { useState, useRef } from "react";

const AutoSuggest = () => {
  const [text, setText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBracket, setSelectedBracket] = useState(null); // [start, end
  const textareaRef = useRef(null);

  // Function to apply styles to the selected bracket
  const applyStyles = (content, start, end) => {
    return (
      content.substring(0, start) +
      '<span style="color: red;">' +
      content.substring(start, end + 1) +
      "</span>" +
      content.substring(end + 1)
    );
  };

  // Function to handle variable selection from suggestions
  const handleVariableSelection = (variable) => {
    setText((prevText) => prevText + `${variable}}}`);
    setShowSuggestions(false);
  };

  // Function to handle textarea input change
  const handleInputChange = (event) => {
    const newText = event.target.value;
    setText(newText);

    // Show suggestions only when "{{" is typed
    setShowSuggestions(newText.endsWith("{{"));
  };

  // Sample list of variables for suggestions
  const variableSuggestions = [
    "variable1",
    "variable2",
    "variable3",
    "varieie tes t sid sdfd bggds sdfsadf ",
  ];

  const handleMouseClick = (e) => {
    const cursorPosition = e.target.selectionStart;
    const variableRegex = /\{\{(.*?)\}\}/g;
    // console.log(cursorPosition, "match");
    // Find all matches of {{...}} in the content
    const matches = [...text.matchAll(variableRegex)];

    // Check if the cursor is inside any of the {{...}} brackets
    const isInsideBrackets = matches.some((match) => {
      const startOffset = match.index + 1;

      const endOffset = startOffset + match[0].length - 1;
      return cursorPosition >= startOffset && cursorPosition <= endOffset;
    });

    if (isInsideBrackets) {
      console.log(
        "Cursor is inside >-----------------{{}}---------------< brackets:",
        cursorPosition
      );

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
      //selected bracket
      const selectedBracket = getSelectedBracket(bracketsLength);

      setShowSuggestions(true);
      setSelectedBracket(selectedBracket);
    } else {
      console.log("Cursor is outside {{}} brackets:", cursorPosition);
    }
  };

  console.log(selectedBracket);

  return (
    <div>
      <textarea
        onClick={handleMouseClick}
        value={text}
        onChange={handleInputChange}
        placeholder="Type {{ to see suggestions..."
        // dangerouslySetInnerHTML={{
        //   __html: applyStyles(
        //     text,
        //     selectedBracket?.startIndex,
        //     selectedBracket?.endIndex
        //   ),
        // }}
      ></textarea>
      <div>
        {showSuggestions &&
          variableSuggestions.map((variable) => (
            <span
              key={variable}
              onClick={() => handleVariableSelection(variable)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            >
              {"{{ " + variable + " }}"}
            </span>
          ))}
      </div>
    </div>
  );
};

export default AutoSuggest;
