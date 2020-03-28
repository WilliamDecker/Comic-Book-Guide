const readFile = require('./readFile');
const path = require('path');
const h = require('../helpers');

pageNum = 0;
requestNumber = 0;

// Take this out
comic = 'fightingman.cbz'; // Public domain comic
index = path.join(__dirname, '../', 'index.html');

// Take this out
exports.homePage = (req, res) => {
	readFile.readPage(comic, 0);
	res.sendFile(index);
	pageNum = 0;
};

// Take this out
exports.nextPage = (req, res) => {
	readFile.nextPage();
	readFile.readPage(comic, pageNum);
	res.sendFile(index);
};

// Take this out
exports.previousPage = (req, res) => {
	if (pageNum > 0) {
		readFile.previousPage();
		readFile.readPage(comic, pageNum);
	}
	res.sendFile(index);
};

exports.comics = (req, res) => {
	res.render('comics', { title: `Comics` });
	console.log('Someone is looking at the comics folder...');
};

exports.changeComic = (req, res) => {
	const comic = req.params.folder;
	console.log('Someone is looking at: ' + comic);
	res.render('comicFolder', { title: `${comic}`, comic });
};

exports.readIssue = (req, res) => {
	let book = {};

	// Pass in the data in an array, I think this is best, page is optional
	book.comic = req.params.comic;
	book.issue = req.params.issue;
	book.page = req.query.page;

	readFile.readComic(book);

	// I don't get the previous fs.writefile done before I need it in the following?  Am I mistaken?
	res.render('readIssue', { title: `${book.issue}`, book });
	console.log("Someone is looking at: " + book.comic + " Issue: " + book.issue + " Page: " + book.page);
};

exports.readXML = (req, res) => {
	res.response(readFile.readXML(comic));
};
