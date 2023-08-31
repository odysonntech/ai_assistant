import express from 'express'
import exphbs from 'express-handlebars'
import path  from 'path'
import morgan from 'morgan'
import Handlebars from 'handlebars'
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access'
import methodOverride from 'method-override'
import flash from 'connect-flash'
import session from 'express-session'
import passaport from 'passport'
import passport  from 'passport'
import bodyParser  from 'body-parser'
import { fileURLToPath } from 'url';
import indexCtrl from './routes/index.route.js'
import config from './config.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//inicializaciones
const app = express();

//settings
app.set('port',process.env.PORT || config.SERVER_BACK);
app.set('views',path.join(__dirname,'/views'));
app.engine('.hbs',exphbs.engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');

var jsonParser = bodyParser.json({limit:1024*1024*10, type:'application/json'}); 
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*10,type:'application/x-www-form-urlencoded' });
app.use(jsonParser);
app.use(urlencodedParser);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user=req.user || null;
    next();
});



//route
app.use(indexCtrl);


//static files
app.use(express.static(path.join(__dirname,'/public')));


export default app;
