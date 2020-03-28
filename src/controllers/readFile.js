const StreamZip = require('node-stream-zip');
const Jimp = require('jimp');
const fs = require('fs');
const parser = require('xml2json');
const h = require('../helpers');

// TODO: Clear the cache

// The meat and potatoes, reads the page of a comic and saves it to the cache...
// Finally creating the actual reader!
// Works but file write is slow vs. the page load.  Resulting in missing image!

exports.readComic = ({ comic, issue, page = 'cover' }) => {
	// TODO
	if (page == 'cover') {
		pageNum = 0;
		console.log('Home page!');
	} else if (page == 'next') {
		pageNum += 1;
		console.log('Next page... Page: ' + '(' + pageNum + ')');
	} else if (page == 'previous') {
		pageNum -= 1;
		console.log('Previous page... Page: ' + '(' + pageNum + ')');
	}

	const zip = new StreamZip({
		file: h.comicFolder(comic) + '\\' + issue + '.cbz',
		storeEntries: true
	});

	// Handle errors
	zip.on('error', (err) => {
		console.error(err.message);
	});

	// Read the page

	zip.on('ready', () => {
		pages = [];

		// I'm sure there is a way to just stream the data of the first file, but that's for another day
		// TODO: Fix this mess.  Reconsult the zip docs.
		for (const entry of Object.values(zip.entries())) {
			const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
			if (entry.name != 'ComicInfo.xml') {
				// Put all the pages into an array
				pages.push(entry.name);
			}
		}

		// Load binary data of the page into a variable...
		// Does this need to be async?

		const data = zip.entryDataSync(pages[pageNum]);

		// TODO fix the file write...this isn't correct I don't think...

		fs.writeFile(`../public/cache/${issue}.jpg`, data, 'binary', function(err) {
			if (err) throw err;
		});

		zip.close();
		console.log('Page written...');
	});
};

// Take this out.  Just for temp homepage...
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
		fs.writeFile('../public/comics/page.jpg', data, 'binary', function(err) {
			if (err) throw err;
		});
		// Do not forget to close the file once you're done
		zip.close();
	});
};

// Read XML file from zip and then parse into JSON

exports.buildCovers = (folderName) => {
	// Filter the file list because even if you can't see it there is a Thumbs.db, even with hidden files exposed...wtf?
	const filteredFileList = h.filterList(h.fileList(folderName));

	// This takes a while...I think it's being done synchronously?  Eats up a bunch of memory for large datasets.
	// TODO: Check if the file exists, if it does, skip it.  Put an option to force a rebuild if required.
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

		// Is there a way to just stream the data of the first file?
		// TODO: Fix this mess.
		for (const entry of Object.values(zip.entries())) {
			const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
			if (entry.name != 'ComicInfo.xml') {
				// Put all the pages into an array
				pages.push(entry.name);
			}
		}

		// TODO: Is this needed?  Currently works.  Likely rewrite.
		const data = zip.entryDataSync(pages[0]);

		// JIMP to handle some of the file resizing
		Jimp.read(data, (err, data) => {
			if (err) throw err;
			data
				.resize(Jimp.AUTO, 380) // resize
				.quality(50)
				.write(`../public/comics/${folderName}.jpg`); // save
		});

		progress += 1;
		zip.close();
		if (filteredFileList.length == progress) {
			console.log('Done writing files: ' + folderName);
		}
	});
};

exports.buildFileCovers = (folderName) => {
	// Track write progress of files...
	let progress = 0;

	// Filter the file list because even if you can't see it there is a Thumbs.db, even with hidden files exposed...wtf?
	const filteredFileList = h.filterList(h.fileList(folderName));

	filteredFileList.forEach((eachFile) => {
		// This takes a while...I think it's being done synchronously?  Eats up a bunch of memory for large datasets.
		// TODO: Check if the file exists, if it does, skip it.  Put an option to force a rebuild if required.
		//console.log('Building cover list...');
		const zip = new StreamZip({
			file: h.comicFolder(folderName) + '\\' + eachFile,
			storeEntries: true
		});

		// Handle errors
		zip.on('error', (err) => {
			console.error(err.message);
		});

		zip.on('ready', () => {
			pages = [];

			// Is there a way to just stream the data of the first file?
			// TODO: Fix this mess.
			for (const entry of Object.values(zip.entries())) {
				const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
				if (entry.name != 'ComicInfo.xml') {
					// Put all the pages into an array
					pages.push(entry.name);
				}
			}

			// TODO: Is this needed?  Currently works.  Likely rewrite.
			const data = zip.entryDataSync(pages[0]);

			// JIMP to handle some of the file resizing.  Async/await?
			Jimp.read(data, (err, data) => {
				if (err) throw err;
				data
					.resize(Jimp.AUTO, 380) // resize
					.quality(50)
					.write(`../public/comics/${folderName}/${h.removeExtension(eachFile)}.jpg`); // save
			});
			progress += 1;
			zip.close();
			if (filteredFileList.length == progress) {
				console.log('Done writing files: ' + folderName);
			}
		});
	});
};
