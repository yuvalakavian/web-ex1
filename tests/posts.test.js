const request = require("supertest");
const initApp = require("../server");
const mongoose = require("mongoose");
const PostModel = require("../models/post");

var app;
beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await PostModel.deleteMany();
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
      senderID: "TestOwner",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.senderID).toBe("TestOwner");
    postId = response.body._id;
  });

  test("Get post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.senderID).toBe("TestOwner");
  });

  test("Get posts by senderID", async () => {
    const response = await request(app).get("/posts?sender=TestOwner");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
    expect(response.body[0].senderID).toBe("TestOwner");
  });

  test("Create another post", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post 2",
      content: "Test Content 2",
      senderID: "TestOwner2",
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

  test("Get updated post by ID", async () => {
    const response = await request(app).get(`/posts/${postId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Test Post");
    expect(response.body.content).toBe("Updated Content");
  });
});
