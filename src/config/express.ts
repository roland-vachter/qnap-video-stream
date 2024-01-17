import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded
} from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'http';
import cookieParser from 'cookie-parser';
import checkSid from '../middlewares/check-sid';
import path from 'path';
import { listFiles, listFolders, login } from '../services/qnap-api';
import { XMLParser } from 'fast-xml-parser';
import { Cookies, FileApiResponse, FolderResponse, LoginBody, LoginResponse } from '../types/types';

function initExpress(): Server {
  const app: Application = express();

  app.use('/public', express.static(path.join(__dirname, '../../public')))

  // Set Template engine to handlebars
  app.engine('hbs', exphbs());
  app.set('view engine', 'hbs');

  // Middleware
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get('/login', (req: Request, res: Response) => {
    return res.render('login');
  });

  app.post('/login', async (req: Request, res: Response) => {
    const body = req.body as LoginBody;
    if (!body || !body.username || !body.password) {
      return res.render('login', {
        error: 'Username or password invalid.'
      });
    } else {
      const xmlRes = await login(body.username, body.password);
      const parser = new XMLParser();
      const parsedRes = parser.parse(await xmlRes.text()) as LoginResponse;
      if (parsedRes.QDocRoot && parsedRes.QDocRoot.authPassed === 1 && parsedRes.QDocRoot.authSid) {
        res.cookie('sid', parsedRes.QDocRoot.authSid);
        return res.redirect('/');
      } else {
        return res.render('login', {
          error: 'Username or password invalid.'
        });
      }
    }
  });

  app.use(checkSid);

  // Example Using Handlebars Template Engine
  // More info: https://handlebarsjs.com/
  app.use(async (req: Request, res: Response) => {
    const cookies = req.cookies as Cookies;

    const foldersRes = await listFolders(req.url, cookies.sid);
    let folders: FolderResponse[] = await foldersRes.json() as FolderResponse[];

    if (!Array.isArray(folders)) {
      folders = [];
    }

    const filesRes = await listFiles(req.url, cookies.sid);
    const files: FileApiResponse = await filesRes.json() as FileApiResponse;

    return res.render('home', {
      root: req.url === '/',
      path: decodeURIComponent(req.url) + (req.url.endsWith('/') ? '' : '/'),
      sid: cookies.sid,
      nasUrl: process.env.NAS_URL,
      basePath: process.env.BASE_PATH,
      folders: folders?.map(f => f.text).filter((n: string) => !n.startsWith('@')),
      files: files?.datas?.map(f => f.filename)
    });
  });

  // Init Express
  const PORT: string | number = process.env.PORT || 8080;
  return app.listen(
    PORT,
    // eslint-disable-next-line no-console
    () => console.log(`Server started on port ${PORT}`) // tslint:disable-line
  );
}

export default initExpress;
