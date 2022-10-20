"use strict";

const puppeteer = require("puppeteer");
var path = require("path");
const fs = require("fs");

class Bookmark {
  constructor(text, link) {
    this.text = text;
    this.link = link;
  }
}

let pagesURLs = [];

var files = fs.readdirSync("./", { withFileTypes: true });

for (let index = 0; index < files.length; index++) {
  const file = files[index];
  if (file.name.indexOf(".html") !== -1) {
    if (file.name === "uniqueBookmarks.html" || file.name === "template.html") {
      continue;
    } else {
      pagesURLs.push(file.name);
    }
  }
}
console.log(pagesURLs);

// list of all bookmarks from the same directory
// let pagesURLs = [
//   "bookmarks_4_15_22.html",
//   "bookmarks_4_17_22.html",
//   "bookmarks_4_1_22.html",
//   "bookmarks_4_28_22.html",
//   "bookmarks_5_1_22.html",
//   "bookmarks_5_3_22.html",
//   "bookmarks_6_10_22.html",
//   "bookmarks_6_11_22.html",
//   "bookmarks_6_4_22(1).html",
//   "bookmarks_6_4_22.html",
//   "bookmarks_6_25_22.html",
// ];

let bookmarks = [];
let uniqueBookmarks = [];

(async () => {
  //read all bookmarks files in current directory only (not-recursive)

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // loop over all the pages
  for (let index = 0; index < pagesURLs.length; index++) {
    const pageURL = pagesURLs[index];
    await page.goto(`file:${path.join(__dirname, pageURL)}`);

    const links = await page.$$("dt > a");
    // loop over all the bookmarks and add them to the list
    for (let i = 0; i < links.length; i++) {
      const element = links[i];
      let text = await element.evaluate((el) => el.textContent);
      let link = await element.getProperty("href");
      let linkText = link._remoteObject.value.toString();
      bookmarks.push(new Bookmark(text, linkText));
    }
    console.log(pageURL + " - Completed!");
  }

  // sort all the bookmarks and get only the unique ones
  console.log(bookmarks.length);
  uniqueBookmarks = [
    ...new Map(bookmarks.map((item) => [item.link, item])).values(),
  ];
  console.log(uniqueBookmarks.length);

  // console.dir(uniqueBookmarks, { maxArrayLength: null });
  let outputString = "<html><head></head><body>";

  // make a file for all the unique bookmarks
  uniqueBookmarks.forEach((bookmark) => {
    outputString += `<a href="${bookmark.link}">${bookmark.text}</a><br>`;
  });

  outputString += "</body></html>";

  fs.writeFile("uniqueBookmarks.html", outputString, function (err) {
    if (err) throw err;
    console.log("File is created successfully.");
  });
})();
