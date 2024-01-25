"use client";
import React, { useMemo, useState } from "react";

import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const SlateComponent = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Test input" }],
    },
  ]);
  return (
    <div>
      SlateComponent
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable className="input" />
      </Slate>
    </div>
  );
};

export default SlateComponent;
