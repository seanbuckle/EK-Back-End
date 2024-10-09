import request from "supertest";
import { app, database, server } from "../index";
import mongoose from "mongoose";
import seed from "../seed";

beforeAll(async () => {
  await seed();
});

afterAll(async () => {
  await database.close();
  server.close();
});

describe("GET: Test GET endpoint", () => {
  it.only("should return api endpoints", () => {
    return request(app).get("/api/users").expect(200);
  });
  it("should return all users with nested documents", () => {
    return request(app)
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
      .get(`/api/users/66ffc4806fb6d65dd74fb565`)
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
      .get(`/api/items/66ffc4806fb6d65dd74fb566`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("likes");
        expect(body).toHaveProperty("description");
        expect(body).toHaveProperty("img_string");
      });
  });
});
