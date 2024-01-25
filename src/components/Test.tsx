"use client";
import React, { useEffect, useRef, useState } from "react";

function getCaret(el) {
  let caretAt = 0;
  const sel = window.getSelection();

  if (sel.rangeCount == 0) {
    return caretAt;
  }

  const range = sel.getRangeAt(0);
  const preRange = range.cloneRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.endContainer, range.endOffset);
  caretAt = preRange.toString().length;

  return caretAt;
}

function setCaret(el, offset) {
  let sel = window.getSelection();
  let range = document.createRange();

  range.setStart(el.childNodes[0], offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function Test() {
  const contentRef = useRef();
  const caretPos = useRef();
  const [state, setState] = useState("test");
  const [selectedBracket, setSelectedBracket] = useState(null);
  const [suggestions, setSuggestions] = useState([
    "variable1",
    "variable2",
    "variable3",
  ]);

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setCaret(contentRef.current, caretPos.current);
    contentRef.current.focus();
    // Show suggestions only when "{{" is typed
    setShowSuggestions(state.endsWith("{{"));
  }, [state]);

  const handleSuggestionSelect = (suggestion) => {
    setState((prevText) => prevText + `${suggestion}}}`);
    setShowSuggestions(false);
  };

  const handleMouseClick = (event) => {
    const cursorPosition = window.getSelection()?.focusOffset;
    const variableRegex = /\{\{(.*?)\}\}/g;
    // Find all matches of {{...}} in the state
    const matches = [...state.matchAll(variableRegex)];

    // Check if the cursor is inside any of the {{...}} brackets
    const isInsideBrackets = matches.some((match) => {
      const startOffset = match.index + 1;
      const endOffset = startOffset + match[0].length - 1;
      return cursorPosition >= startOffset && cursorPosition <= endOffset;
    });
    if (isInsideBrackets) {
      console.log("Cursor is inside {{}} brackets:", cursorPosition);

      //get the startIndex and endIndex of all the matches
      const getBracketLength = (matches) => {
        return matches.map((match) => {
          const startIndex = match.index;
          const endIndex = startIndex + match[0].length - 1;
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

      //   setShowSuggestions(true);
      setSelectedBracket(selectedBracket);
      //   setInsideBrackets(true);
    } else {
      console.log("Cursor is outside {{}} brackets:", cursorPosition);
      //   setInsideBrackets(false);
      setSelectedBracket(null);
    }
  };

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
        ref={contentRef}
        suppressContentEditableWarning={true}
        contentEditable={true}
        dangerouslySetInnerHTML={{
          __html: selectedBracket
            ? applyStyles(
                state,
                selectedBracket?.startIndex,
                selectedBracket?.endIndex
              )
            : state,
        }}
        onClick={handleMouseClick}
        onInput={(e) => {
          caretPos.current = getCaret(contentRef.current);
          setState(e.target.textContent);
        }}
      >
        {/* {state} */}
      </div>
      {/* {showSuggestions && (
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
      )} */}
    </div>
  );
}

export default Test;
