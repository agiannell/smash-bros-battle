const axios = require('axios');

module.exports = {
    getAllFighters: (req, res) => {
        const allFightersArr = [],
              randomFightersArr = [];
              let id = 1;
              
              axios.get('https://www.amiiboapi.com/api/amiibo/?amiiboSeries=0x00')
              .then(response => {
                  allFightersArr.push(response.data.amiibo);
                  allFightersArr[0].forEach(e => {

                    e.id = id
                    id++
                })
                for(let i = 1; i <= 5; i++){
                    const rand1 = Math.ceil(Math.random() * allFightersArr[0].length),
                          fighter = allFightersArr[0].find(e => e.id === rand1);

                    randomFightersArr.push(fighter);
                }
                res.status(200).send(randomFightersArr)
            })
            .catch(err => res.status(500).send(err));
        }
}