const app = require('./app');

app.listen(app.get('port'));
console.log('Server en puerto ', app.get('port'));