const express = require("express");
const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const cors = require("cors");

const pdfTemplate = require("./documents");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.post("/create-pdf", (req, res) => {
//   pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", (err) => {
//     if (err) {
//       res.send(Promise.reject());
//     } else {
//       res.send(Promise.resolve());
//     }
//   });
// });
app.post("/create-pdf", (req, res) => {
  pdf
    .create(pdfTemplate(req.body), {
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
    })
    .toFile("result.pdf", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send("PDF Created Successfully");
      }
    });
});

app.get("/", (req, res) => {
  res.send("pdf get");
});

app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/result.pdf`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
