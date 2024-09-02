const contenders = [];
let id = 1;

module.exports = {
  getContenders: (req, res) => {
    res.status(200).send(contenders);
  },
  chooseContenders: (req, res) => {
    const { contender } = req.body;

    contender.id = id;
    id++;

    contenders.push(contender);
    res.status(200).send(contenders);
  },
  editName: (req, res) => {
    const { id } = req.params,
      { name } = req.body;

    const contender = contenders.find((e) => e.id === +id);
    contender.name = name;
    res.status(200).send(contenders);
  },
  replaceContender: (req, res) => {
    const { id } = req.params;

    const contenderIndex = contenders.findIndex((e) => e.id === +id);
    contenders.splice(contenderIndex, 1);
    res.status(200).send(contenders);
  },
  clearContender: (req, res) => {
    contenders.splice(0, contenders.length);
    res.status(200).send(contenders);
  },
};
