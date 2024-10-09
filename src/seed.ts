import data from "../user.json";
import model from "./models/model";

export default async function seed() {
  try {
    await model.deleteMany();
    await model.insertMany(data);
    console.log("dataInserted");
  } catch (error) {
    console.log(error);
  }
}
