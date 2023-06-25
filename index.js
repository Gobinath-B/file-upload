const express = require("express");
const path = require("path");
const app = express();
const multer = require("multer");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.replace(/\.[/.]+$/) + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const maxSize = 2 * 1000 * 1000;

const upload = multer({
  storage: storage,

  limits: {
    fileSize: maxSize,
  },

  fileFliter: function (req, file, cb) {
    let filetypes = /jpg|jpeg|png/;
    let mimetypes = filetypes.test(file.mimetypes);
    let extname = filetypes.test(path.join(file.originalname).toLowerCase());

    if (mimetypes && extname) {
      return true;
    } else {
      cb("Error : upload in jpg/jpeg/png format");
    }
  },
}).single("mypic");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully uploaded");
    }
  });
});

app.listen(8000, () => {
  console.log("Running ....");
});
