import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";

let app: Express;

type User = IUser & { token?: string };
const testUser: User = {
  email: "test@user.com",
  userName: "test user",
  password: "testpassword",
  fullName: "john lenon",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentModel.deleteMany();
  await userModel.deleteMany();

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

let commentId = "";
const commentTest = {
  postsId: "677c5747e850a45522b6691f",
  content: "Test the comment",
  senderId: "TestOwner",
};

describe("Comments Tests with Authentication", () => {
  test("Comments test get all (empty)", async () => {
    const response = await request(app)
      .get("/comments")
      .set({ authorization: `JWT ${testUser.token}` })
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: `JWT ${testUser.token}` })
      .send(commentTest);
    commentId = response.body._id;
    expect(response.statusCode).toBe(201);
    expect(response.body.postsId).toBe(commentTest.postsId);
    expect(response.body.content).toBe(commentTest.content);
    expect(response.body.senderId).toBe(commentTest.senderId);
  });

  test("Test get Comment by ID", async () => {
    const response = await request(app)
      .get(`/comments/${commentId}`)
      .set({ authorization: `JWT ${testUser.token}` })
    expect(response.statusCode).toBe(200);
    expect(response.body.postsId).toBe(commentTest.postsId);
    expect(response.body.content).toBe(commentTest.content);
    expect(response.body.senderId).toBe(commentTest.senderId);
  });

  test("Test update Comment", async () => {
    const response = await request(app)
      .put(`/comments/${commentId}`)
      .set({ authorization: `JWT ${testUser.token}` })
      .send({
        content: "wow this is amazing",
      });
    expect(response.statusCode).toBe(200);
    const getResponse = await request(app).get(`/comments/${commentId}`).set({ authorization: `JWT ${testUser.token}` });
    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.body.content).toBe("wow this is amazing");
  });

  test("Test Create the second Comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: `JWT ${testUser.token}` })
      .send({
        postsId: commentTest.postsId,
        content: "Test the comment 2",
        senderId: "TestOwner2",
      });
    expect(response.statusCode).toBe(201);
  });

  test("Test get all Comments", async () => {
    const response = await request(app).get("/comments").set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test delete Comment", async () => {
    const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set({ authorization: `JWT ${testUser.token}` });
    expect(response.statusCode).toBe(200);

    const getResponse = await request(app)
      .get(`/comments/${commentId}`)
      .set({ authorization: `JWT ${testUser.token}` })
    expect(getResponse.statusCode).toBe(404);
  });
});
