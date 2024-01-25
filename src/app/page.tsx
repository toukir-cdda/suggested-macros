import AutoSuggest from "@/components/AutoSuggest";
import MentionExample from "@/components/MentionExample";
import MyTextarea from "@/components/MyTextarea";
import SlateComponent from "@/components/SlateComponent";
import Test from "@/components/Test";
import MyEditor from "@/components/TextEditor/MyEditor";
import MentionsEditor from "@/components/MentionsEditor";

export default function Home() {
  return (
    <div className="my-10 mx-10">
      {/* <h1>Hello World</h1> */}
      {/* <SuggestedTextInput /> */}
      {/* <AutoSuggest />
      <MyTextarea />
      <Test /> */}
      {/* <SlateComponent /> */}
      {/* <MentionExample /> */}
      {/* <MyEditor /> */}
      {/* mention? */}
      <h1>Write something with macros</h1>
      <MentionsEditor />
    </div>
  );
}
