const readFile = require('./readFile');
const path = require('path');

pageNum = 0;
requestNumber = 0;
comic = 'fightingman.cbz';  // Public domain comic
index = path.join(__dirname, '../', 'index.html');

exports.homePage = (req, res) => {
  readFile.readPage(comic, 0);
	res.sendFile(index);
	pageNum = 0;
	requestNumber += 1;
	console.log('Someone hit the home ' + 'Request Number: ' + requestNumber);
};

exports.nextPage = (req, res) => {
  readFile.nextPage();
	readFile.readPage(comic, (pageNum));
	res.sendFile(index);
	requestNumber += 1;
  console.log('Someone hit the next ' + 'Request Number: ' + requestNumber);
  console.log('They are on page ' + pageNum);
}
exports.previousPage = (req, res) => {
  if (pageNum > 0) {
    readFile.previousPage();
		readFile.readPage(comic, pageNum);
	}
	res.sendFile(index);
	requestNumber += 1;
	console.log('Someone hit the previous ' + 'Request Number: ' + requestNumber);
}

exports.changeComic = (req, res) => {
  comic = req.params.id + ".cbz";
  console.log("Changed comic to... " + req.params.id)
  res.redirect('/');
}

exports.readXML = (req, res) => {
	res.response(readFile.readXML(comic));
}