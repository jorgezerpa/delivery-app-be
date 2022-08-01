const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

require('./utils/authentication'); //passport

routerApi(app);

app.listen(port, () => {
  console.log(`App listen in port ${port}`);
});
