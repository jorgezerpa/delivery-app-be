const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
const socket = require('./socket');
const routerApi = require('./routes');
const { logErrors, errorHandler, boomErrorHandler, handleRepeatedValuesOnDB } = require('./middlewares/error.handler');
const periodicTasks = require('./utils/PeriodicTasks');

const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

  //passport
require('./utils/authentication'); 

//routes
socket.connect(server, {
  cors: {
    origin: "https://deliverify.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }
});

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
