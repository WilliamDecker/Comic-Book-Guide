const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');
//const helpers = require('../helpers');
//const readFile = require('../controllers/readFile');

router.get('/', comicController.homePage);
router.get('/nextpage', comicController.nextPage);
router.get('/previouspage', comicController.previousPage);
router.get('/xml', comicController.readXML);
// Something to just load in a file if I want...
router.get('/comic/:id', comicController.changeComic);

router.get('/folder', (req, res) => {
  res.render('folder');
  console.log('Someone is looking at the folder...')
});

router.get('/builder', (req, res) => {
  res.render('builder');  
  console.log('Someone used the builder...');
})

module.exports = router;