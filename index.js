const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const path = require("path");

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

app.use(cors());

app.get("/api/groups/:id", (req, res) => {
  const { id } = req.params;
  if (!(id in groupData)) {
    groupData[id] = initialEditorValue(id);
  }

  res.send(groupData[id]);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("web/build"));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "web", "build", "index.html"));
  });
}

http.listen(process.env.PORT || 4000, () => {
  console.log("listening on port 4000");
});
