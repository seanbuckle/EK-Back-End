import { NextFunction, Response, Request } from "express";

const { selectItems } = require("../models/items.model");

type ApiData = {
  name: string;
  endpoints: string[];
};

exports.getItems = (req: Request, res: Response, next: NextFunction) => {
  selectItems()
    .then((api: ApiData) => {
      res.status(200).send(api);
    })
    .catch(next);
};
