import AppError from '@shared/errors/AppError';

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

    it('should not be able to create two appointments on the same time', async () => {
        const fakeApponentsRepository = new FakeApponentsRepository();
        const createAppointment = new CreateAppointmentService(fakeApponentsRepository);

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({date: appointmentDate, provider_id: '123456'});

        expect(
            createAppointment.execute({date: appointmentDate, provider_id: '123456'}),
            ).rejects.toBeInstanceOf(AppError);
    });
});
