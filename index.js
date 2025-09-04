const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const { routes } = require('./routes/index.route');
const { connectDB } = require('./configs/database');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const option = require('./swagger');
const responseHelper = require('./middlewares/response');
const multer = require('multer');
const upload = multer();

require('dotenv').config();

const app = express();
const PORT  = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseHelper);

routes(app);

const specs = swaggerJSDoc(option);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));


app.listen(PORT, () => {
  console.log("Server is listening on PORT " + PORT);
})
