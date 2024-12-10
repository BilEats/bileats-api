aaa
const express = require("express");
const axios = require("axios");
const iconv = require("iconv-lite");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Bileats API!");
});

app.get("/menu/:day", async (req, res) => {
  try {
    const response = await axios.get(
      "http://kafemud.bilkent.edu.tr/monu_eng.html#fiks",
      {
        responseType: "arraybuffer",
      }
    );
    const html = iconv.decode(Buffer.from(response.data), "windows-1254");

    const $ = cheerio.load(html);

    const menu = {
      ogle: [],
      lunch: [],
      aksam: [],
      dinner: [],
      secmeli: [],
      alternative: [],
    };

    // Ogle/Lunch
    for (let i = 4; i <= 8; i++) {
      // 85 olması lazım
      for (let j = 1; j <= 2; j++) {
        const row = $(
          `.MsoNormalTable tr:nth-of-type(2) .MsoNormalTable tr:nth-of-type(${i}) td:nth-of-type(${j}) p span`
        )
          .text()
          .replace(/\s+/g, " ")
          .trim();

        if (j === 1) {
          menu.ogle.push(row);
        } else {
          menu.lunch.push(row);
        }
      }
    }

    // Aksam/Dinner
    for (let i = 10; i <= 14; i++) {
      // 85 olması lazım
      for (let j = 1; j <= 2; j++) {
        const row = $(
          `.MsoNormalTable tr:nth-of-type(2) .MsoNormalTable tr:nth-of-type(${i}) td:nth-of-type(${j}) p span`
        )
          .text()
          .replace(/\s+/g, " ")
          .trim();

        if (j === 1) {
          menu.aksam.push(row);
        } else {
          menu.dinner.push(row);
        }
      }
    }

    // Secmeli/Alternative
    for (let i = 2; i <= 13; i++) {
      // 85 olması lazım bunun da
      for (let j = 1; j <= 2; j++) {
        const row = $(
          `body > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-of-type(${i}) td:nth-of-type(${i === 2 ? j + 1 : j})`
        )
          .text()
          .replace(/\s+/g, " ")
          .trim();
        
        if ((i === 2 && (j + 1) === 2) || (i !== 2 && j === 1)) {
          menu.secmeli.push(row);
        } else {
          menu.alternative.push(row);
        }
        
      }
    }

    res.json(menu);
  } catch (error) {
    console.error("Error fetching or parsing the menu: ", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

