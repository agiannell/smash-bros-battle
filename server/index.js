const chooseYourCtrl = require('./controllers/chooseYourCtrl');

const express = require('express'),
      fightersCtrl = require('./controllers/allFightersCtrl'),
      chooseCtrl = require('./controllers/chooseYourCtrl'),
      port = 4002,
      app = express();

app.use(express.json());

app.get('/api/fighters', fightersCtrl.getAllFighters);

app.get('/api/contenders', chooseYourCtrl.getContenders);
app.post('/api/contenders', chooseYourCtrl.chooseContenders);
app.put('/api/contenders/:id', chooseYourCtrl.editName);
app.delete('/api/contenders/:id', chooseYourCtrl.replaceContender);
app.get('/api/clear-contenders/', chooseYourCtrl.clearContender);

app.listen(port, console.log(`Server is listening on port ${port}`));