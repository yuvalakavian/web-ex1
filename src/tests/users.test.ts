import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import UserModel, { IUser } from "../models/users_model";
import { Express } from "express";

let app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  email: "test@user.com",
  userName: "testuser",
  password: "testpassword",
  fullname: "John Doe",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await UserModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("User Controller Tests", () => {
  let userId = "";

  test("Get all users (empty)", async () => {
    const response = await request(app)
      .get("/users")
      .set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1); // Includes the registered testUser
  });

  test("Create a user", async () => {
    const response = await request(app)
      .post("/users")
      .set({ authorization: `JWT ${testUser.token}` })
      .send({
        username: "johndoe",
        email: "john.doe@example.com",
        fullname: "John Doe",
        password: "test pass",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe("johndoe");
    expect(response.body.email).toBe("john.doe@example.com");
    expect(response.body.fullname).toBe("John Doe");
    userId = response.body._id;
    console.log(userId);
    
  });

  test("Get user by ID", async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("johndoe");
    expect(response.body.email).toBe("john.doe@example.com");
    expect(response.body.fullname).toBe("John Doe");
  });

  test("Get user by ID failed", async () => {
    const response = await request(app)
      .get(`/users/1234`)
      .set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(400);
  });

  test("Update user", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` })
      .send({
        fullname: "John Updated",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.fullname).toBe("John Updated");
  });

  test("Update user failed", async () => {
    const response = await request(app)
      .put(`/users/1234`)
      .set({ authorization: `JWT ${testUser.token}` })
      .send({
        fullname: "John Updated",
      });
    expect(response.statusCode).toBe(400);
  });

  test("Get all users (non-empty)", async () => {
    const response = await request(app)
      .get("/users")
      .set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1); // Includes the new user
    expect(response.body.some((u: User) => u.fullname === "John Updated")).toBe(
      false
    );
  });

  test("Delete user", async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(200);

    const getResponse = await request(app)
      .get(`/users/${userId}`)
      .set({ authorization: `JWT ${testUser.token}` });
    expect(getResponse.statusCode).toBe(404);
  });

  test("Create user fail (missing fields)", async () => {
    const response = await request(app)
      .post("/users")
      .set({ authorization: `JWT ${testUser.token}` })
      .send({});
    expect(response.statusCode).toBe(400);
  });
});
