import connection from "./db/dbConfig.js";
import app from "./app.js";
const url = process.env.MONGO_URI;
// console.log(url);

connection(url);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
