const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

app.use(cors());

const apiRouter = require("./routes/api.routes");

app.use("/api", apiRouter);

export default app;
