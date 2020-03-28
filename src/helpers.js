/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

const fs = require('fs');
const path = require('path');

counter = 0;
pageNum = 0;

exports.siteName = `Comic Book Guide`;
exports.basePath = process.env.COMICS_DIR;
exports.comicsList = fs.readdirSync(process.env.COMICS_DIR);
exports.comicFolder = (folder) => process.env.COMICS_DIR + folder;
exports.fileList = (comicFolder) => fs.readdirSync(process.env.COMICS_DIR + comicFolder);
exports.filterList = (list) => list.filter(file => file.endsWith('.cbz'));
exports.removeExtension = (string) => string.split('.').slice(0, -1).join('.');
