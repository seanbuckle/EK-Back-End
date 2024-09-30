const itemsRouter = require("express").Router();
const { getItems } = require("../controllers/items.controller");
itemsRouter.get("/", getItems);

module.exports = itemsRouter;
