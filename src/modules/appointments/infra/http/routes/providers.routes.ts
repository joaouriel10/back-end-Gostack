import { Router } from 'express';

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";
import ProvidersContoller from '../controllers/ProvidersContoller';
const providersRouter = Router();

const providersContoller = new ProvidersContoller();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersContoller.index);

export default providersRouter;
