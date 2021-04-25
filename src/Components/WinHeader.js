const WinHeader = (props) => {
  const { name, clearFn } = props;
  return (
    <header className="winner fadeIn">
      <button className="close" onClick={clearFn}></button>
      <img
        className="win-gif"
        src="https://media.giphy.com/media/Y0Q6qO4v3xVlD2RkZ6/source.gif"
        alt="congrats sticker"
      />
      <h1>{name} wins!</h1>
    </header>
  );
};

export default WinHeader;
