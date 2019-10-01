import { Value } from "slate";

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "Hello, share the URL with your group to start contributing!"
          }
        ]
      }
    ]
  }
});