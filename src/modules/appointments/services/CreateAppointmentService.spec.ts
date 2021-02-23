import FakeApponentsRepository from '../repositories/fakes/FakeAppointmetsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new Appointment', async () => {
        const fakeApponentsRepository = new FakeApponentsRepository();
        const createAppointment = new CreateAppointmentService(fakeApponentsRepository);

        const appointment = await createAppointment.execute({date: new Date(), provider_id: '123456789'});

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456789');
    });

    // it('should not be able to create two appointments on the same time', () => {
    //     expect(1 + 2).toBe(3);
    // })
});
