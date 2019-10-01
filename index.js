const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");

let initialEditorValue = id => ({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: `Hello, you're in group _${id}_`
          }
        ]
      }
    ]
  }
});

const groupData = {};

io.on("connection", function(socket) {
  socket.on("new-operations", function(data) {
    groupData[data.groupId] = data.value;
    io.emit(`new-remote-operations-${data.groupId}`, data);
  });
});

app.use(
  cors({
    origin: [
      "https://google-docs-clone.herokuapp.com",
      "http://localhost:3000"
    ]
  })
);

app.get("/groups/:id", (req, res) => {
  const { id } = req.params;
  if (!(id in groupData)) {
    groupData[id] = initialEditorValue(id);
  }

  res.send(groupData[id]);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("web/build"));
}

http.listen(process.env.PORT || 4000, () => {
  console.log("listening on port 4000");
});
