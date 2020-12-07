# Comic Book Guide
Worst. App. Ever.

## Introduction

Comic Book Guide organizes all of your comic books so you can read them from any device without the need to sync files.

## Requirements

- [Node.js](https://nodejs.org)

## Installation

For best use, be sure to scrape and save all metadata using ComicRack.  For existing .CBZ files I recommend converting to .CB7 and then again back to .CBZ to ensure file consistency (removal of all internal folders, file name modifications ie: P00001.jpg -> P00035.jpg, saving of ComicInfo.xml).

- run `npm install` within base directory to install all the required dependencies.
- place a `.cbz` comic book into the `/src` folder.
- update `comic = 'fightingman.cbz';` in `/src/comicControler.js` to the .cbz of your choice.

## Usage

To start the program run `node start` within the /src/ folder to start the application on `port:3000`.

Once it's started, navigate to [http://localhost:3000](http://localhost:3000) in your web browser (or whatever machine you are hosting it on).
