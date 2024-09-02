const DrawHeader = (props) => {
  const { clearFn } = props;
  return (
    <header className="draw fadeIn">
      <button className="close" onClick={clearFn}></button>
      <img
        className="draw-gif"
        src="https://media.giphy.com/media/JUB0s1l8yuZsXpSgY9/source.gif"
        alt="unenthused clapping"
      />
      <h1>Draw!</h1>
    </header>
  );
};

export default DrawHeader;
