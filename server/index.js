const chooseYourCtrl = require('./controllers/chooseYourCtrl');

const express = require('express'),
      fightersCtrl = require('./controllers/allFightersCtrl'),
      chooseCtrl = require('./controllers/chooseYourCtrl'),
      port = 4002,
      app = express();

app.use(express.json());

app.get('/api/fighters', fightersCtrl.getRandFighters);
app.get('/api/all-fighters', fightersCtrl.getAllFighters);

app.get('/api/contenders', chooseCtrl.getContenders);
app.post('/api/contenders', chooseCtrl.chooseContenders);
app.put('/api/contenders/:id', chooseCtrl.editName);
app.delete('/api/contenders/:id', chooseCtrl.replaceContender);
app.get('/api/clear-contenders/', chooseCtrl.clearContender);

app.listen(port, console.log(`Server is listening on port ${port}`));