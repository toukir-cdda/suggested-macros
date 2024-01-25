const MentionElement = ({ attributes, children, element }) => {
  return (
    <span {...attributes} contentEditable={false}>
      @{element.value}
      {children}
    </span>
  );
};

export default MentionElement;
