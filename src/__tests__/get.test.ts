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
      .get(`/api/users/66fd22b19b790ad6086965fc`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("name");
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("items");
        expect(body).toHaveProperty("address");
      });
  });
  it("should return an individual user by username", async () => {
    await request(app)
      .get(`/api/user/peteisking`)
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
      .get(`/api/items/66fd22ec9b790ad608696602`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("likes");
        expect(body).toHaveProperty("description");
        expect(body).toHaveProperty("img_string");
      });
  });
});
