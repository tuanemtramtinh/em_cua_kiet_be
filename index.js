const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { routes } = require('./routes/index.route');
const { connectDB } = require('./configs/database');

require('dotenv').config();

const app = express();
const PORT  = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

app.listen(PORT, () => {
  console.log("Server is listening on PORT " + PORT);
})
