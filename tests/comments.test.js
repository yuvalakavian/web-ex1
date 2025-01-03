const request = require("supertest");

const initApp = require("../server");
const mongoose = require("mongoose");
const postModel = require("../models/post");
const commentModel = require("../models/comment")

var app;
beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentModel.deleteMany();
  await postModel.deleteMany();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const responsePost = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      senderID: "TestOwner"
    })
    postId = responsePost.body._id;
    const response = await request(app).post("/comments").send({
      postsID: postId,
      content: "Test the comment",
      senderID: "TestOwner"
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.senderID).toBe("TestOwner");
    postId = response.body._id;
  });

  test("Test get post by senderID", async () => {
    const response = await request(app).get("/posts?senderID=TestOwner");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].content).toBe("Test Content");
    expect(response.body[0].senderID).toBe("TestOwner");
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.content).toBe("Test Content");
    expect(response.body.senderID).toBe("TestOwner");
  });

  test("Test Create Post 2", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post 2",
      content: "Test Content 2",
      senderID: "TestOwner2",
    });
    expect(response.statusCode).toBe(201);
  });

  test("Posts test get all 2", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test Post 2",
      content: "Test Content 2",
    });
    expect(response.statusCode).toBe(400);
  });
});