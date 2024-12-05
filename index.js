const express = require("express");
const axios = require("axios");
const iconv = require("iconv-lite");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Bileats API!");
});

app.get("/menu", async (req, res) => {
  try {
    const response = await axios.get(
      "http://kafemud.bilkent.edu.tr/monu_eng.html",
      {
        responseType: "arraybuffer",
      }
    );
    const html = iconv.decode(Buffer.from(response.data), "windows-1254");

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (error) {
    res.status(500).send({ error: "failed to fetch the kafemud site" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
