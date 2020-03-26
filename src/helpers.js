/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

const fs = require('fs');
const path = require('path');

// TODO put these in env items
exports.basePath = process.env.COMICS_DIR;
exports.comicsList = fs.readdirSync(process.env.COMICS_DIR);
exports.comicFolder = (folder) => process.env.COMICS_DIR + folder;
exports.fileList = (comicFolder) => fs.readdirSync(process.env.COMICS_DIR + comicFolder);

exports.filterList = (list) => list.filter(file => file.endsWith('.cbz'));

exports.pageFilter = (list) => list.filter(file => file.startsWith('P00001'));
