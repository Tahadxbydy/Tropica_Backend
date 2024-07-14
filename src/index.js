import "dotenv/config";
import app from "./app.js";
import connectDb from "./db/connect_db.js";

connectDb().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
