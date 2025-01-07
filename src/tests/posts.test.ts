import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Post Controller Tests", () => {
  let postId = "";

  test("Get all posts (empty)", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Create a post", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      senderId: "TestOwner",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.senderId).toBe("TestOwner");
    postId = response.body._id;
  });

  test("Get post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.senderId).toBe("TestOwner");
  });

  test("Get post by ID failed", async () => {
    const response = await request(app).get(`/posts/1234`);
    expect(response.statusCode).toBe(400);
  });

  test("Get posts by senderId", async () => {
    const response = await request(app).get("/posts?sender=TestOwner");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
    expect(response.body[0].senderId).toBe("TestOwner");
  });

  test("Create another post", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post 2",
      content: "Test Content 2",
      senderId: "TestOwner2",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Get all posts (non-empty)", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Create post fail (missing fields)", async () => {
    const response = await request(app).post("/posts").send({
      title: "Incomplete Post",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Update post", async () => {
    const response = await request(app).put(`/posts/${postId}`).send({
      title: "Updated Test Post",
      content: "Updated Content",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Test Post");
    expect(response.body.content).toBe("Updated Content");
  });

  test("Update post failed post doesnt exists", async () => {
    const response = await request(app).put(`/posts/1234`).send({
      title: "Updated Test Post",
      content: "Updated Content",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Get updated post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Test Post");
    expect(response.body.content).toBe("Updated Content");
  });
});
