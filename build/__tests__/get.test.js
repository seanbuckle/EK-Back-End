"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const seed_1 = __importDefault(require("../seed"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, seed_1.default)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield index_1.database.close();
    index_1.server.close();
}));
describe("GET: Test GET endpoint", () => {
    it.only("should return api endpoints", () => {
        return (0, supertest_1.default)(index_1.app).get("/api/users").expect(200);
    });
    it("should return all users with nested documents", () => {
        return (0, supertest_1.default)(index_1.app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
            expect(body).toHaveProperty("length");
            expect(body[0]).toHaveProperty("name");
            expect(body[0]).toHaveProperty("username");
        });
    });
    it("should return all items in mongo database", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get("/api/items")
            .expect(200)
            .then(({ body }) => {
            expect(body).toHaveProperty("length");
            expect(body[0]).toHaveProperty("item_name");
            expect(body[0]).toHaveProperty("description");
            expect(body[0]).toHaveProperty("img_string");
        });
    }));
    it("should return an individual user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get(`/api/users/66ffc4806fb6d65dd74fb565`)
            .expect(200)
            .then(({ body }) => {
            expect(body).toHaveProperty("name");
            expect(body).toHaveProperty("username");
            expect(body).toHaveProperty("items");
            expect(body).toHaveProperty("address");
        });
    }));
    it("should return an individual user by username", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get(`/api/user/peteisking`)
            .expect(200)
            .then(({ body }) => {
            expect(body).toHaveProperty("name");
            expect(body).toHaveProperty("username");
            expect(body).toHaveProperty("items");
            expect(body).toHaveProperty("address");
        });
    }));
    it("should return an individual item by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(index_1.app)
            .get(`/api/items/66ffc4806fb6d65dd74fb566`)
            .expect(200)
            .then(({ body }) => {
            expect(body).toHaveProperty("likes");
            expect(body).toHaveProperty("description");
            expect(body).toHaveProperty("img_string");
        });
    }));
});
