import express from "express";
var router = express.Router();
import { Web3Storage, getFilesFromPath } from "web3.storage";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { unlink } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/", async (req, res) => {
  // Code for user authentication will go here for future purposes

  // For now token is assigned manually     
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxQzVDMzc1NDE4Qjg4Mjc3RkY2N2ZiQzQxRkM1YzNEOTBmMDNBNDgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzcwOTM5ODM1ODAsIm5hbWUiOiJ0ZXN0In0.tl7NTO5aXSk3NrO210u8aQNtgfkaZlXhuE1l2vHx3qM";

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  let document = req.files["file"];
  console.log(document)
  let uploadPath = __dirname + "/tmp/" + document.name;
  console.log(uploadPath);

  document.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  const storage = new Web3Storage({ token });
  const files = [];

  const pathFiles = await getFilesFromPath(uploadPath);
  files.push(...pathFiles);

  console.log(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  console.log("CID : " + cid);

  unlink(uploadPath, (err) => {
    if (err) throw err;
    console.log(uploadPath + " was deleted");
  });

  res.json({ file: "https://" + cid + ".ipfs.w3s.link/" + document.name });
});

export default router;