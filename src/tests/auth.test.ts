import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

const baseUrl = "/auth";

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  email: "test@user.com",
  userName: "tests user",
  password: "testpassword",
  fullname: "john lenon",
};

describe("Auth Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test register fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "sdsdfsd",
      });
    expect(response.statusCode).not.toBe(200);
    const response2 = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "",
        password: "sdfsd",
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test login", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  test("Check tokens are not the same", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });

  test("Auth test login fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: testUser.email,
        password: "sdfsd",
      });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app)
      .post(baseUrl + "/login")
      .send({
        email: "dsfasd",
        password: "sdfsd",
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test me", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      owner: "sdfSd",
    });
    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "sdfSd",
      });
    expect(response2.statusCode).toBe(201);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Double use refresh token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response.statusCode).toBe(200);
    const refreshTokenNew = response.body.refreshToken;

    const response2 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response2.statusCode).not.toBe(200);

    const response3 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: refreshTokenNew,
      });
    expect(response3.statusCode).not.toBe(200);
  });

  test("Test logout", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .post(baseUrl + "/logout")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response3.statusCode).not.toBe(200);
  });

  jest.setTimeout(10000);
  test("Test timeout token ", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response2 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "sdfSd",
      });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app)
      .post(baseUrl + "/refresh")
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response3.statusCode).toBe(200);
    testUser.accessToken = response3.body.accessToken;

    const response4 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        title: "Test Post",
        content: "Test Content",
        owner: "sdfSd",
      });
    expect(response4.statusCode).toBe(201);
  });
  test("Auth test register missing fields", async () => {
    const response = await request(app).post(baseUrl + "/register").send({});
    expect(response.statusCode).toBe(400);
  });

  test("Auth test register invalid email format", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({ ...testUser, email: "invalidEmail" });
    expect(response.statusCode).toBe(400);
  });

  test("Auth test login missing fields", async () => {
    const response = await request(app).post(baseUrl + "/login").send({});
    expect(response.statusCode).toBe(400);
  });

  test("Auth test login with unregistered email", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({ email: "unknown@user.com", password: "password" });
    expect(response.statusCode).toBe(400);
  });

  test("Auth test login invalid password", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({ email: testUser.email, password: "wrongpassword" });
    expect(response.statusCode).toBe(400);
  });

  test("Auth refresh token invalid token", async () => {
    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({ refreshToken: "invalidtoken" });
    expect(response.statusCode).toBe(400);
  });

  test("Auth logout missing refresh token", async () => {
    const response = await request(app).post(baseUrl + "/logout").send({});
    expect(response.statusCode).toBe(400);
  });

  test("Auth middleware server error without TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app)
      .get("/posts")
      .set({ authorization: `JWT ${testUser.accessToken}` });

    process.env.TOKEN_SECRET = originalTokenSecret;

    expect(response.statusCode).toBe(500);
  });

  test("Auth refresh server error without TOKEN_SECRET", async () => {
    const originalTokenSecret = process.env.TOKEN_SECRET;
    delete process.env.TOKEN_SECRET;

    const response = await request(app)
      .post(baseUrl + "/refresh")
      .send({ refreshToken: testUser.refreshToken });

    process.env.TOKEN_SECRET = originalTokenSecret;

    expect(response.statusCode).toBe(400);
  });

});
