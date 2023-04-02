import express from "express";
const PORT = process.env.PORT || 3500;
import bodyParser from "body-parser";
import upload_file from "./routes/uploadfile.js";
import nft from "./routes/nft.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(fileUpload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set routes
app.use("/file/upload", upload_file);
app.use('/nft', nft);

app.listen(PORT, () => {
  console.info("Server running on server " + PORT);
});
