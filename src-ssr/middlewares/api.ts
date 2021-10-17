import bodyParser from 'body-parser';
import knex, { Knex } from 'knex';
import CryptoJS from 'crypto-js';
import { SsrMiddlewareParams } from '@quasar/app';
import { Token, User } from 'src/models/User';
import { Router } from 'express';
import authEndpoints from '../endpoints/authEndpoints';
import bookEndpoints from '../endpoints/bookEndpoints';

export interface ApiContext {
  dbConnection: Knex;
  crypter: typeof CryptoJS.SHA256;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
      token: Token;
    }
  }
}

export default ({ app, resolve }: Pick<SsrMiddlewareParams, 'app' | 'resolve'>) => {
  const dbConnection = knex(require('../../knexfile'));
  const crypter = CryptoJS.SHA256;

  const router = Router();
  router.use(bodyParser.json());

  router.use(async (req, res, next) => {
    const tokenString = req.headers.authorization?.toLowerCase().replace('bearer ', '').trim();

    if (!tokenString) {
      return next();
    }
    const token = await dbConnection.table('tokens').where({
      token: tokenString,
      isActive: true,
    }).first<Token>();

    if (!token) {
      return next();
    }

    const user = await dbConnection.table('users').where({
      id: token.userId,
    }).first<User>();

    if (!user) {
      return next();
    }
    req.user = user;
    req.token = token;

    next();
  });

  authEndpoints({ dbConnection, crypter })(router);
  bookEndpoints({ dbConnection, crypter })(router);

  app.use(resolve.urlPath('/api'), router);
};
