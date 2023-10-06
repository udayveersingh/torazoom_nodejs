import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectdb.js';
import web from './routes/web.js';
import {join} from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRotues.js';
import apiRoutes from './routes/api.js';
import session from 'express-session';

dotenv.config();
const app = express();
const port = process.env.PORT || '3000';
const DATABASE_URI = process.env.DATABASE_URL;

app.use(cors());
connectDB(DATABASE_URI);

app.use(express.json());

app.use(session({
    secret: 'torzaoomvideosite',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));
  
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


// Middleware to set the global variable
app.use((req, res, next) => {
  // Construct the current site URL
  const currentSiteUrl = `${req.protocol}://${req.get('host')}`;
  const fullUrl = `${currentSiteUrl}${req.originalUrl}`;

  // Assign it to app.locals.myGlobalVariable
  app.locals.myGlobalVariable = currentSiteUrl;
  app.locals.current_path = req.path;
  app.locals.full_url = fullUrl;
  // localStorage.setItem('current_lang', 'en');
  // app.locals.current_lang = localStorage.getItem('current_lang');

  next(); // Continue processing
});

// To use req.body 

// app.use('/api/user',express.static(join(process.cwd(),"public")));
app.use('/',express.static(join(process.cwd(),"public")));
app.use('/login',express.static(join(process.cwd(),"public")));
app.use('/series',express.static(join(process.cwd(),"public")));
app.use('/topic' ,express.static(join(process.cwd(),"public")));
app.use('/series/edit' ,express.static(join(process.cwd(),"public")));
app.use('/topic/edit' ,express.static(join(process.cwd(),"public")));

app.set('view engine', 'ejs');

// app.use('/api/user', userRoutes);
app.use('/', userRoutes);
app.use('/', web);
// app.use('/api/:lang', apiRoutes);
app.use('/api', apiRoutes);



app.use('/student', web);


app.listen(port, ()=>{
    console.log(`Server listening at http://localhost:${port}`);
})