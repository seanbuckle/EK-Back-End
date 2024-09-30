import { Types } from "mongoose";
import connection from "../db/connection";

exports.selectItems = async () => {
  const items = await connection.collection("items").find();
};
