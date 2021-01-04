const contenders = [];
let id = 0;

module.exports = {
    getContenders: (req, res) => {
        res.status(200).send(contenders);
    },
    chooseContenders: (req, res) => {
        const {} = req.body
    },
    editName: (req, res) => {

    },
    replaceContender: (req, res) => {

    }
}