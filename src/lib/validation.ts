import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'Titill má ekki vera tómur').max(255, 'Titill má ekki vera lengri en 255 stafir'),
});

export const updateTodoSchema = z.object({
  title: z.string().trim().min(1, 'Titill má ekki vera tómur').max(255, 'Titill má ekki vera lengri en 255 stafir'),
  finished: z.string().optional(),
});