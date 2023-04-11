const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

// middle ware
app.use(express.static("public"));
app.use(cors());
app.use(fileUpload());

app.post("/upload", async (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  if (!req.files.file?.[0]) {
    const myFile = req.files.file;
    const name =
      Date.now().toString() + "-" + myFile.name?.replaceAll(" ", "-");
    // Use the mv() method to place the file somewhere on your server
    myFile.mv(`${__dirname}/public/${name}`, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "fuck eroor" });
      }
      return res.json({ status: 1, image: [`http://localhost:4500/${name}`] });
    });
  } else {
    const promiseImage = req.files.file?.map(async (myFile) => {
      const name =
        Date.now().toString() + "-" + myFile.name?.replaceAll(" ", "-");
      await myFile.mv(`${__dirname}/public/${name}`);
      return `http://localhost:4500/${name}`;
    });
    Promise.all(promiseImage).then((data) =>
      res.json({ status: 1, image: data })
    );
  }
});

app.listen(4500, () => {
  console.log("server is running at port 4500");
});
