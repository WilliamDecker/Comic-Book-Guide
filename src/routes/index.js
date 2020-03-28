const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');
const h = require('../helpers');

router.get('/', comicController.homePage);
router.get('/xml', comicController.readXML);

// This is no longer needed after cleaning up soon...
router.get('/nextpage', comicController.nextPage);
router.get('/previouspage', comicController.previousPage);

// Comic File Loaders...
router.get('/comics/', comicController.comics);
router.get('/comics/:folder', comicController.changeComic);
router.get('/comics/:comic/:issue', comicController.readIssue);

// Temp builder 
// TODO build proper admin page
router.get('/builder', (req, res) => {
  console.log('Building cover list...');
  res.render('builder', { title: `Builder`});
})

router.get('/folder', (req, res) => {
  res.redirect('/comics');
});

module.exports = router;