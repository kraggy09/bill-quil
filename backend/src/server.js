import connection from "./db/dbConfig.js";
import app from "./app.js";
const url = process.env.MONGO_URI;
connection(url);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running at", PORT);
});
