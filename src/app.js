const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

let renderHTML = path.resolve(__dirname, './public/index.html');

app.get('/', function (req, res) {
  res.sendFile(renderHTML);
})

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

//routes
app.use(require('./routes/index'));

//static files
app.use(express.static(path.join(__dirname, 'public')))


module.exports = app; 