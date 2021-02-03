import { Router } from 'express';

import AutenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const autenticateUser = new AutenticateUserService();

  const { user, token } = await autenticateUser.execute({ email, password });

  return response.json({ user, token });
});

export default sessionsRouter;
