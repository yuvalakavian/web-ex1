const request = require("supertest");
const initApp = require("../server");
const mongoose = require("mongoose");
const userModel = require("../models/user");
require("dotenv").config();

let app;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const baseUrl = "/auth";

const testUser = {
  email: "test@user.com",
  password: "testpassword",
  username: "testuser",
  fullname: "Test User",
};

describe("Auth Tests", () => {
  test("Register a user successfully", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });

  test("Fail to register a user with existing email", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(400);
  });

  test("Fail to register with invalid data", async () => {
    const response = await request(app).post(baseUrl + "/register").send({ email: "invalid" });
    expect(response.statusCode).toBe(400);
  });

  test("Login successfully", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Fail to login with wrong credentials", async () => {
    const response = await request(app).post(baseUrl + "/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Access protected route with valid token", async () => {
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${testUser.accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  test("Fail to access protected route with invalid token", async () => {
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.statusCode).toBe(401);
  });

  test("Refresh token successfully", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Fail to refresh token with invalid refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: "invalidtoken",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Logout successfully", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
  });

  test("Fail to refresh token after logout", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(400);
  });
});
