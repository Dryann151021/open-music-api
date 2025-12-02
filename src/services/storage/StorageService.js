// const fs = require('fs');

// class StorageService {
//   constructor(folder) {
//     this._folder = folder;

//     if (!fs.existsSync(folder)) {
//       fs.mkdirSync(folder, { recursive: true });
//     }
//   }

//   writeFile(file, meta) {
//     const filename = +new Date() + meta.filename;
//     const path = `${this._folder}/${filename}`;

//   }
// }

// module.exports = StorageService;
