"use client";
import React, { useState, useMemo } from "react";
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const MentionInput = ({ onMentionChange }) => {
  const [mention, setMention] = useState("");

  const handleMentionChange = (e) => {
    const newMention = e.target.value;
    setMention(newMention);
    onMentionChange(newMention);
  };

  return (
    <input
      type="text"
      value={mention}
      onChange={handleMentionChange}
      placeholder="Type @ to mention"
    />
  );
};

const MentionElement = ({ attributes, children, element }) => {
  return (
    <span {...attributes} contentEditable={false}>
      @{element.value}
      {children}
    </span>
  );
};

const MyEditor = () => {
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Hello, mention @world!" }],
    },
  ]);

  const [mention, setMention] = useState("");

  const editor = useMemo(() => withMentions(withReact(createEditor())), []);

  const handleMentionChange = (newMention) => {
    setMention(newMention);
  };

  const renderElement = (props) => {
    switch (props.element.type) {
      case "mention":
        return <MentionElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  };

  const DefaultElement = (props) => {
    return <p {...props.attributes}>{props.children}</p>;
  };
  const handleEditorChange = (newValue) => {
    setValue(newValue);
    // Do something with the updated value, if needed
    console.log("Editor value changed:", newValue);
  };
  return (
    <div>
      <MentionInput onMentionChange={handleMentionChange} />
      <Slate
        editor={editor}
        value={value}
        initialValue={value}
        // onChange={(newValue) => setValue(newValue)}
        onChange={handleEditorChange}
      >
        <Editable renderElement={renderElement} />
      </Slate>
    </div>
  );
};

const withMentions = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  return editor;
};

export default MyEditor;

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "This example shows how you might implement a simple ",
      },
      {
        text: "@-mentions",
        bold: true,
      },
      {
        text: " feature that lets users autocomplete mentioning a user by their username. Which, in this case means Star Wars characters. The ",
      },
      {
        text: "mentions",
        bold: true,
      },
      {
        text: " are rendered as ",
      },
      {
        text: "void inline elements",
        code: true,
      },
      {
        text: " inside the document.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      { text: "Try mentioning characters, like " },
      {
        type: "mention",
        character: "R2-D2",
        children: [{ text: "", bold: true }],
      },
      { text: " or " },
      {
        type: "mention",
        character: "Mace Windu",
        children: [{ text: "" }],
      },
      { text: "!" },
    ],
  },
];
