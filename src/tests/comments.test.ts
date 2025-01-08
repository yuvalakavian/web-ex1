import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_model";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentModel.deleteMany();
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
describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app).post("/comments").send(commentTest);
    commentId = response.body._id;
    expect(response.statusCode).toBe(201);
    expect(response.body.postsId).toBe(commentTest.postsId);
    expect(response.body.content).toBe(commentTest.content);
    expect(response.body.senderId).toBe(commentTest.senderId);
  });

  test("Test get Comment by id", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.postsId).toBe(commentTest.postsId);
    expect(response.body.content).toBe(commentTest.content);
    expect(response.body.senderId).toBe(commentTest.senderId);
  });

  test("Test update Comment", async () => {
    const response2 = await request(app)
      .put("/comments/" + commentId)
      .send({
        content: "wow this is amazing",
      });
    expect(response2.statusCode).toBe(200);
    const response = await request(app).get("/comments/" + commentId);
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe("wow this is amazing");
  });

  test("Test update non exists Comment", async () => {
    const response = await request(app).put("/comments/1234").send({
      content: "wow this is amazing",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test update Comment with wrong parmeters", async () => {
    const response = await request(app)
      .put("/comments" + commentId)
      .send({
        title: "wow this is amazing",
      });
    expect(response.statusCode).toBe(404);
  });

  test("Test Create the second Comment", async () => {
    const response = await request(app).post("/comments").send({
      postsId: commentTest.postsId,
      content: "Test the comment 2",
      senderId: "TestOwner2",
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
    expect(response.statusCode).toBe(400);
  });

  // test("Test get Comments by post ID", async () => {
  //   const responseCreate = await request(app).post("/comments").send({
  //     postsId: "1234",
  //     content: "Test the comment 2",
  //     senderId: "TestOwner2",
  //   });
  //   expect(responseCreate.statusCode).toBe(200);
  //   const response = await request(app).get("/comments?post=" + "1234");
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body[0].postsId).toBe("1234");
  //   expect(response.body[0].content).toBe("Test the comment 2");
  //   expect(response.body[0].senderId).toBe("TestOwner2");
  // });
});
