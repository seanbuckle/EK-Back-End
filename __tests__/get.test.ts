import request from "supertest";
import app from "../index";

describe("GET: Test GET endpoint", () => {
  it("should return all users with nested documents", async () => {
    await request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("length");
        expect(body[0]).toHaveProperty("name");
        expect(body[0]).toHaveProperty("username");
      });
  });
  it("should return all items in mongo database", async () => {
    await request(app)
      .get("/api/items")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("length");
        expect(body[0]).toHaveProperty("item_name");
        expect(body[0]).toHaveProperty("description");
        expect(body[0]).toHaveProperty("img_string");
      });
  });
  it("should return an individual user by ID", async () => {
    await request(app)
      .get(`/api/users/66fbc2e6d21d87957aa7876c`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("name");
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("items");
        expect(body).toHaveProperty("address");
      });
  });
  it("should return an individual item by ID", async () => {
    await request(app)
      .get(`/api/items/66fbc2e6d21d87957aa7876e`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("items");
        expect(body.items[0]).toHaveProperty("like");
        expect(body.items[0]).toHaveProperty("description");
        expect(body.items[0]).toHaveProperty("img_string");
      });
  });
});
