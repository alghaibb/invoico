// Helper to convert Node.js ReadableStream to Web ReadableStream
function nodeStreamToWeb(stream: NodeJS.ReadableStream) {
  return new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => controller.enqueue(chunk));
      stream.on("end", () => controller.close());
      stream.on("error", (err) => controller.error(err));
    },
  });
}

export { nodeStreamToWeb };
