const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

  //passport
require('./utils/authentication'); 


//routes
routerApi(app);

//error handlers
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listen in port ${port}`);
});
