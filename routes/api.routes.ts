import express, { Router } from "express";
const { itemsRouter } = require("./items.routes");

const apiRoute: Router = express.Router();

apiRoute.use("/items", itemsRouter);

// apiRouter.get("/", getUsers);

module.exports = apiRoute;
