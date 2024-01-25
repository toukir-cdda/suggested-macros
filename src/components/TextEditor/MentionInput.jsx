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
