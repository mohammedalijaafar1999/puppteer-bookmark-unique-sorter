const fs = require("fs");

var files = fs.readdirSync("./", { withFileTypes: true });

for (let index = 0; index < files.length; index++) {
  const file = files[index];
  if (file.name.indexOf(".html") !== -1) {
    if (file.name !== "uniqueBookmarks.html") {
      console.log(file.name);
    }
  }
}

// files.forEach((file) => {
//   if (file.name.indexOf(".html") !== -1) {
//     if (file.name !== "uniqueBookmarks.html") {
//       console.log(file.name);
//     }
//   }
// });
