const AllFighters = (props) => {
  const { allFighters } = props;
  return (
    <section className="all-fighters-container flyDown">
      <h2>All available Fighters</h2>
      <div className="all-fighters">
        {allFighters.map((e, i) => (
          <section className="indiv-fighters" key={i}>
            <img src={e.image} alt={e.name} />
            <p>{e.name}</p>
          </section>
        ))}
      </div>
    </section>
  );
};

export default AllFighters;
