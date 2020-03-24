const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');

router.get('/', comicController.homePage);
router.get('/nextpage', comicController.nextPage);
router.get('/previouspage', comicController.previousPage);
router.get('/xml', comicController.readXML);
// Something to just load in a file if I want...
router.get('/comic/:id', comicController.changeComic);

module.exports = router;