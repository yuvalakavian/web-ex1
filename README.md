# web-ex1
In this assignment, you will create a REST API using Node.js and Express. You do not need to provide unit tests, but you should specify each API request in a request.rest file.
The required API should include the following endpoints:
Add a New Post: Allows a user to add a new post to the database.
Get All Posts: Returns all posts in the database as a JSON array.
Get a Post by ID: Returns the post with the specified ID. The request URL format is:
/post/<post_id>
Get Posts by Sender: Returns all posts published by a specific sender, identified by sender ID. The request URL format is:
/post?sender=<sender_id>
Update a Post: Updates a post with new data, replacing its current content. This operation uses the PUT method, where the post ID is specified in the URL, and the new post data is included in the JSON body of the request.
Additionally, implement a full CRUD API for Comments. Comments are messages written by users on specific posts. The Comments API should include endpoints to create, read, update, and delete comments, as well as an endpoint to retrieve all comments associated with a specific post.
