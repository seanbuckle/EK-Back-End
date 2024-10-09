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

describe("Endpoint Testing", () => {
  describe("GET: /api", () => {
    it("should return api endpoints", () => {
      return request(app).get("/api").expect(200);
    });
    it("should handle an error when URL is not correct", async () => {
      await request(app)
        .get(`/ap`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("URL not found");
        });
    });
  });
  describe("GET: /api/users", () => {
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
    it("should return an individual user by ID", async () => {
      await request(app)
        .get(`/api/users/60c72b2f9b1e8a4f10b7b1f1`)
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
    it("should handle error when username does not exist", async () => {
      await request(app)
        .get(`/api/user/peteiing`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("invalid username");
        });
    });
    it("should handle error when id is wrong or does not exist", async () => {
      await request(app)
        .get(`/api/users/asdasdoj`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Not a valid ID");
        });
    });
  });
  describe("GET: /api/items", () => {
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
    it("should return an individual item by ID", async () => {
      await request(app)
        .get(`/api/items/60c72b2f9b1e8a4f10b7b1f6`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("likes");
          expect(body).toHaveProperty("description");
          expect(body).toHaveProperty("img_string");
        });
    });
    it("should handle an error when item id is not correct", async () => {
      await request(app)
        .get(`/api/items/60c72b2f9b1e8a4f10b7`)
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Not a valid ID");
        });
    });
  });
  describe("GET: /api/:username/items", () => {
    it("should return the items for a give user", async () => {
      await request(app)
        .get(`/api/peteisking/items`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("length");
        });
    });
    it("should handle an error when URL is not correct", async () => {
      await request(app)
        .get(`/api/peteiskig/iems`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("URL not found");
        });
    });
  });
  describe("GET: /api/likes/user_id", () => {
    it("should return an array of a users likes based on their ID", async () => {
      await request(app)
        .get(`/api/likes/60c72b2f9b1e8a4f10b7b1f1`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("length");
          expect(body[0].item_name).toBe("table");
        });
    });
    it("should handle an error when user id is not correct", async () => {
      await request(app)
        .get(`/api/likes/60c72b2f9b1e8a4f10b`)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Cannot Find Matching ID");
        });
    });
  });
});
