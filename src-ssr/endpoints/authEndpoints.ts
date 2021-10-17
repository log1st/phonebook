import { User } from 'src/models/User';
import { SignInPayload } from 'src/hooks/useAuth';
import { Router } from 'express';
import { ApiContext } from '../middlewares/api';

export default ({
  dbConnection,
  crypter,
}: ApiContext) => (router: Router) => {
  router.post('/auth/sign-out', async (req, res, next) => {
    if (!req.user) {
      res.status(401).send({
        error: 'Вы не авторизованы',
      });
      return;
    }

    await dbConnection.table('tokens').where({
      id: req.token.id,
    }).update({
      isActive: false,
    });

    res.status(200).send({
      message: 'Успешная деавторизация',
    });

    next();
  });

  router.post('/auth/sign-in', async (req, res, next) => {
    if (req.user) {
      res.status(403).send({
        error: 'Вы уже авторизованы',
      });
      return;
    }

    const body = req.body as SignInPayload;
    const user = await dbConnection
      .table<User>('users')
      .where({
        login: body.login,
      })
      .first();
    if (!user) {
      res.status(401).send({
        login: ['Пользователь не найден'],
      });
      return;
    }

    if (crypter(body.password).toString() !== user.password) {
      res.status(401).send({
        login: ['Пользователь не найден'],
      });
      return;
    }

    const token = crypter(`${body.login}-${Date.now()}`).toString();

    await dbConnection.table('tokens').insert({
      token,
      userId: user.id,
    });

    res.status(200).send({
      data: (({ password, ...u }) => u)(user),
      token,
    });
  });

  return router;
};
