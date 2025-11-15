const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { routes } = require("./routes/index.route");
const { connectDB } = require("./configs/database");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const option = require("./swagger");
const responseHelper = require("./middlewares/response");
const multer = require("multer");
const upload = multer();

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Cấu hình CORS chi tiết hơn
app.use(cors());

// Xử lý preflight requests một cách rõ ràng
app.options("*", cors());

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseHelper);

routes(app);

const specs = swaggerJSDoc(option);
app.set("trust proxy", 1);
app.get("/openapi.json", (req, res) => {
  const host = req.get("host");
  const proto = req.get("x-forwarded-proto") || req.protocol;
  const dynamic = { ...specs, servers: [{ url: `${proto}://${host}` }] };
  res.json(dynamic);
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.listen(PORT, () => {
  console.log("Server is listening on PORT " + PORT);
});
