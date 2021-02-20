import { Router } from 'express';

import ensureAuthenticated from "@modules/users/infra/http/middleware/ensureAuthenticated";
import AppointsmentController from '../controllers/AppointmentsController';
const appoitmentsRouter = Router();

const appoitmentsController = new AppointsmentController();

appoitmentsRouter.use(ensureAuthenticated);

// appoitmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appoitmentsRouter.post('/', appoitmentsController.create);

export default appoitmentsRouter;
