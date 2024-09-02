import Contenders from "./Contenders";

const Battlefield = (props) => {
  const { contenders, editNameFn, replaceFn, battleFn } = props;
  return (
    <section>
      {contenders.length === 0 ? (
        <section className="battlefield">
          <div className="init">
            <h1 className="flyRight">Choose Your Character!</h1>
          </div>
        </section>
      ) : (
        <section className="battlefield">
          <div className="battlefield-div">
            {contenders.map((e, i) => (
              <Contenders
                key={i}
                contender={e}
                length={contenders.length}
                editNameFn={editNameFn}
                replaceFn={replaceFn}
              />
            ))}
          </div>
          {contenders.length === 2 ? (
            <button
              className="battle-button fadeInDelay"
              onClick={battleFn}
            ></button>
          ) : null}
        </section>
      )}
    </section>
  );
};

export default Battlefield;
