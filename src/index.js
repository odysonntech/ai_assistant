//require('dotenv').config();
import app from './server.js'
//require('./database');

app.listen(app.get('port'),()=>{
    console.log('server on port:',app.get('port'));
});