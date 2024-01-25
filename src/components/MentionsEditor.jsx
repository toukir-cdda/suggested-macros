"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editor, createEditor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  useSelected,
  useFocused,
  ReactEditor,
} from "slate-react";
import { Transforms, Range } from "slate";
import { Portal } from "./Portal";

const Macros = [
  "userName",
  "userAge",
  "emailAddress",
  "isValid",
  "totalItems",
  "selectedItem",
  "maxValue",
  "minValue",
  "formattedText",
  "errorCount",
  "isLoggedIn",
  "inputValue",
  "outputResult",
  "firstName",
  "lastName",
  "isComplete",
  "elementIndex",
  "currentIndex",
  "newData",
  "fileContent",
  "tempValue",
  "apiKey",
  "statusCode",
  "queryParameters",
  "defaultTheme",
  "searchQuery",
  "isEditable",
  "errorMessage",
  "isLoading",
  "currentLocation",
  "previousValue",
  "nextElement",
  "userList",
  "selectedOption",
  "userInput",
  "roleName",
  "configOptions",
  "resultArray",
  "isActive",
  "dataObject",
  "responseText",
  "headerTitle",
  "transactionId",
  "dateOfBirth",
  "timeElapsed",
  "newInstance",
  "pendingTasks",
  "defaultLanguage",
  "accessToken",
  "counterValue",
];

const MentionsEditor = () => {
  const ref = useRef();
  const editor = useMemo(() => withMentions(withReact(createEditor())), []);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const [target, setTarget] = useState();
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(0);

  const [value, setValue] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  const macros = Macros.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10);

  const onKeyDown = useCallback(
    (event) => {
      if (target && macros.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            const prevIndex = index >= macros.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case "ArrowUp":
            event.preventDefault();
            const nextIndex = index <= 0 ? macros.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, macros[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);

            break;
        }
      }
    },
    [macros, editor, index, target]
  );

  //show portal
  useEffect(() => {
    // console.log(beforeText, "macrosListVisible");
    if (target && macros.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.pageYOffset + 24}px`;
      el.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [macros.length, editor, index, search, target]);

  console.log(value);

  return (
    <Slate
      editor={editor}
      value={value}
      initialValue={value}
      onChange={(e) => {
        const { selection } = editor;
        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          // const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          //   console.log(beforeRange, "beforeRange");
          //   console.log(beforeText, "beforeText");
          const beforeMatch = beforeText && beforeText.match(/^\{(\w+)/);
          //   console.log(beforeMatch, "beforeMatch");
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);
          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);

            return;
          }
        }
        setValue(e);
        setTarget(null);
      }}
    >
      <Editable
        onKeyDown={onKeyDown}
        className="bg-gray-700 rounded-md text-gray-100 p-2 placeholder:py-2 placeholder-gray-400"
        renderElement={renderElement}
        placeholder="start typing with { for selecting macros"
      />

      {target && macros.length > 0 && (
        <Portal>
          <div
            ref={ref}
            style={{
              top: "-9999px",
              left: "-9999px",
              position: "absolute",
              zIndex: 1,
              padding: "3px",
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 1px 5px rgba(0,0,0,.2)",
            }}
            data-cy="mentions-portal"
          >
            {macros.map((macro, i) => (
              <div
                key={macro}
                onClick={() => {
                  Transforms.select(editor, target);
                  insertMention(editor, macro);
                  setTarget(null);
                }}
                style={{
                  padding: "1px 3px",
                  borderRadius: "3px",
                  background: i === index ? "#B4D5FF" : "transparent",
                }}
              >
                {macro}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </Slate>
  );
};

export default MentionsEditor;

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "mention":
      return <Mention {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const style = {
    padding: "3px 3px 2px",
    margin: "0 1px",
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    color: "orange",
    backgroundColor: "gray",
    fontSize: "0.9em",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(" ", "-")}`}
      style={style}
      onClick={() => console.log("mention clicked")}
    >
      {`{{${element.character}}}`}
      {children}
    </span>
  );
};

const withMentions = (editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === "mention" || markableVoid(element);
  };

  return editor;
};

const insertMention = (editor, character) => {
  const mention = {
    type: "mention",
    character,
    value: "500",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
