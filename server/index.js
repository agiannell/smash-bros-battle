
const express = require('express'),
      fightersCtrl = require('./controllers/allFightersCtrl'),
      port = 4002,
      app = express();

app.use(express.json());

app.get('/api/fighters', fightersCtrl.getAllFighters);



app.listen(port, console.log(`Server is listening on port ${port}`));