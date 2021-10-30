
const express = require('express')
const app = express()

//app.use(require('./login'));
//app.use(require('./register'));
app.use(require('./usuarios'));
app.use(require('./productos'));
app.use(require('./ventas'));

module.exports = app;