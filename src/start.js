//require('dotenv').load();

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Start our app!
const app = require('./app');

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Express running → PORT 3000`);
});