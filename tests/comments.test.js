const request = require("supertest");

const initApp = require("../server");
const mongoose = require("mongoose");
const postModel = require("../models/post");
const commentModel = require("../models/comment");

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
let commentId = "";
describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const responsePost = await request(app).post("/posts").send({
      title: "Test Post",
      content: "Test Content",
      senderID: "TestOwner"
    })
    postId = responsePost.body._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
    const response = await request(app).post("/comments").send({
      postsID: postId,
      content: "Test the comment",
      senderID: "TestOwner"
    }); 
    commentId = response.body._id
    expect(response.statusCode).toBe(201);
    expect(response.body.postsID).toBe(postId)
    expect(response.body.content).toBe("Test the comment");
    expect(response.body.senderID).toBe("TestOwner");
  });

  test("Test get Comments by post ID", async () => {
    const response = await request(app).get("/comments/post/"+postId);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].postsID).toBe(postId)
    expect(response.body[0].content).toBe("Test the comment");
    expect(response.body[0].senderID).toBe("TestOwner");
  });

  test("Test get Comment by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.postsID).toBe(postId)
    expect(response.body.content).toBe("Test the comment");
    expect(response.body.senderID).toBe("TestOwner");
  });

  test("Test update Comment", async () =>{
    const response2 = await request(app).put("/comments/" + commentId).send({
      content: "wow this is amazing",
    });
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe("wow this is amazing");
  })

  test("Test update non exists Comment", async () =>{
    const response = await request(app).put("/comments/1234").send({
      content: "wow this is amazing",
    });
    expect(response.statusCode).toBe(400);
  })

  test("Test update Comment with wrong parmeters", async () =>{
    const response = await request(app).put("/comments" + commentId).send({
      title: "wow this is amazing",
    });
    expect(response.statusCode).toBe(404);
  })

  test("Test Create Comment 2", async () => {
    const response = await request(app).post("/comments").send({
      postsID: postId,
      content: "Test the comment 2",
      senderID: "TestOwner2"
    });
    expect(response.statusCode).toBe(201);
  });

  test("Test get all 2 Comment", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Create Comment fail", async () => {
    const response = await request(app).post("/comments").send({
      title: "Test Post 2",
      content: "Test Content 2",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test delete Comment", async () => {
    const response = await request(app).delete("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    const getResponse = await request(app).get("/comments/" + commentId);
    expect(getResponse.statusCode).toBe(404);
  });

  test("Test delete non exists Comment", async () => {
    const response = await request(app).delete("/comments/1234");
    expect(response.statusCode).toBe(500);
  });
});