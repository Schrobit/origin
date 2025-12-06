const express = require('express');
const app = express();
const db = require('./utils/dbUtil');
const userRoutes = require('./routes/userRoute');
const telemetryRoutes = require('./routes/telemetryRoute');
const statusRoutes = require('./routes/statusRoute');
const mqService = require('./services/mqService');


const bodyParser = require('body-parser');
const logger = require('morgan');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('views'));

app.use(userRoutes)
app.use(telemetryRoutes)
app.use(statusRoutes)



app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
  mqService.receive();
});