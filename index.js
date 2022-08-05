const express = require('express');
const app = express();
const server = require('http').Server(app);

const dotenv = require('dotenv');
dotenv.config();
const socket = require('./socket');
const cors = require('cors');
const routerApi = require('./routes');
const { logErrors, errorHandler, boomErrorHandler, handleRepeatedValuesOnDB } = require('./middlewares/error.handler');
const periodicTasks = require('./utils/PeriodicTasks');

const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

  //passport
require('./utils/authentication'); 


//routes
socket.connect(server);

socket.socket.io.on('connection', async()=>{
  const clustersController = require('./controllers/clusters.controller');
  const clusters = await clustersController.listClusters();
  socket.socket.io.emit('clustersEvent', clusters )
})

routerApi(app); 


//error handlers
app.use(logErrors);
app.use(boomErrorHandler);
app.use(handleRepeatedValuesOnDB);
app.use(errorHandler);

//periodic tasks
periodicTasks.startMonitoring();

server.listen(port, () => {
  console.log(`App listen in port ${port}`);
});
