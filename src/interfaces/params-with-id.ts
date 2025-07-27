import * as z from 'zod';

// validate that req.params.id is a non-empty UUID string
export const ParamsWithId = z.object({
  id: z
    .string()
    .uuid({ message: 'Invalid UUID' }),
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
