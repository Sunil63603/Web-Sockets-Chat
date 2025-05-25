// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("chat-app-db");

db.users.insertMany([
  { _id: ObjectId(), name: "Alice" },
  { _id: ObjectId(), name: "Bob" },
  { _id: ObjectId(), name: "Charlie" },
]);

db.createCollection("chats");
db.createCollection("messages");

const users = db.users.find().toArray();
const user1 = users[0]._id;
const user2 = users[1]._id;
const user3 = users[2]._id;

db.chats.insertOne({
  chatName: "Group Project",
  isGroupChat: true,
  users: [user1, user2, user3],
  messages: [],
  latestMessage: null,
  groupAdmin: user1,
});
