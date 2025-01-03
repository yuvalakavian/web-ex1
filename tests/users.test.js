const request = require("supertest");
const initApp = require("../server");
const mongoose = require("mongoose");
const UserModel = require("../models/user");

var app;
beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await UserModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("User Controller Tests", () => {
  let userId = "";

  test("Get all users (empty)", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create a user", async () => {
    const response = await request(app).post("/users").send({
      username: "johndoe",
      email: "john.doe@example.com",
      fullname: "John Doe",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe("johndoe");
    expect(response.body.email).toBe("john.doe@example.com");
    expect(response.body.fullname).toBe("John Doe");
    userId = response.body._id;
  });

  test("Get user by ID", async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("johndoe");
    expect(response.body.email).toBe("john.doe@example.com");
    expect(response.body.fullname).toBe("John Doe");
  });

  test("Update user", async () => {
    const response = await request(app).put(`/users/${userId}`).send({
      fullname: "John Updated",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.fullname).toBe("John Updated");
  });

  test("Get all users (non-empty)", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].fullname).toBe("John Updated");
  });

  test("Delete user", async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    const getResponse = await request(app).get(`/users/${userId}`);
    expect(getResponse.statusCode).toBe(404);
  });

  test("Create user fail (missing fields)", async () => {
    const response = await request(app).post("/users").send({});
    expect(response.statusCode).toBe(400);
  });
});