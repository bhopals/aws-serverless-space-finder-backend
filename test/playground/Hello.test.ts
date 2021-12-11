import { handler } from "../../services/node-lambda/hello";
console.log("Handler Test Start...");
handler({}, {});
console.log("Handler Test Finish...");
