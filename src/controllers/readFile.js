const StreamZip = require('node-stream-zip');
const fs = require('fs');
const parser = require('xml2json');

exports.nextPage = () => {
  return pageNum += 1;
}

exports.previousPage = () => {
  return pageNum -= 1;
}

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
exports.readXML = (comicName) => {
	const zip = new StreamZip({
		file: comicName,
		storeEntries: true
	});


	fs.writeFile('ComicInfo.xml', zip.entryDataSync('ComicInfo.xml'), 'binary', function(err) {
		if (err) throw err;
		fs.readFile('./ComicInfo.xml', function(err, data) {
			// Parse the XML into JSON...
			let json = parser.toJson(data);
			console.log(json);
			return json;
		});
	});

};