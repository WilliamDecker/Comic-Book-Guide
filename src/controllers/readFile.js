const StreamZip = require('node-stream-zip');
const Jimp = require('jimp');
const fs = require('fs');
const parser = require('xml2json');
const h = require('../helpers');

exports.nextPage = () => {
	return (pageNum += 1);
};

exports.previousPage = () => {
	return (pageNum -= 1);
};

// The meat and potatoes, reads the page of a comic and saves it to the cache...
exports.readPage = (comicName, page) => {
	const zip = new StreamZip({
		file: comicName,
		storeEntries: true
	});
	// Handle errors

	zip.on('error', (err) => {
		console.error(err.message);
	});

	// TODO
	// 1. Put pages into memory for use with length

	pages = [];

	zip.on('ready', () => {
		for (const entry of Object.values(zip.entries())) {
			const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
			if (entry.name != 'ComicInfo.xml') {
				// Put all the pages into an array
				pages.push(entry.name);
			}
		}

		// Load binary data of the page into a variable...
		const data = zip.entryDataSync(pages[page]);

		//And then write it to a file...
		fs.writeFile('../public/cache/page.jpg', data, 'binary', function(err) {
			if (err) throw err;
		});
		// Do not forget to close the file once you're done
		zip.close();
	});
};

// Read XML file from zip and then parse into JSON

exports.buildCovers = (folderName) => {
	// TODO: Scrub the folder name to take out special characters.  It's causing issues.

	// Filter the file list because even if you can't see it there is a Thumbs.db, even with hidden files exposed...wtf?
	const filteredFileList = h.filterList(h.fileList(folderName));

	// This takes a while...I think it's being done synchronously?  Eats up a bunch of memory for large datasets.
	// TODO: Check if the file exists, if it does, skip it.  Put an option to force a rebuild if required.
	console.log('Building cover list...');
	const zip = new StreamZip({
		file: h.comicFolder(folderName) + '\\' + filteredFileList[0],
		storeEntries: true
	});

	// Handle errors
	zip.on('error', (err) => {
		console.error(err.message);
	});

	zip.on('ready', () => {
		pages = [];

		// I'm sure there is a way to just stream the data of the first file, but that's for another day
		// TODO: Fix this mess.
		for (const entry of Object.values(zip.entries())) {
			const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
			if (entry.name != 'ComicInfo.xml') {
				// Put all the pages into an array
				pages.push(entry.name);
			}
		}

		// TODO: I'm sure this isn't needed, but it works for now.  Need to rewrite the above.
		const data = zip.entryDataSync(pages[0]);

		// JIMP to handle some of the file resizing
		Jimp.read(data, (err, data) => {
			if (err) throw err;
			data
				.resize(250, Jimp.AUTO) // resize
				.quality(50)
				.write(`../public/cache/${folderName}.jpg`); // save
		});

		zip.close();
	});
};
