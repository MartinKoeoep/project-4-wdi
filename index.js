const express = require('express');
const app = express();
const port = 4000;
const errorHandler = require('./lib/errorHandler');


const router = require('./config/routes');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


app.use(express.static(`${__dirname}/public`));


app.get('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

<<<<<<< HEAD
app.use(errorHandler);
=======
app.use('/api', router);
>>>>>>> development

app.listen(port, () => console.log(`Express running on port ${port}`));

module.exports = app;
