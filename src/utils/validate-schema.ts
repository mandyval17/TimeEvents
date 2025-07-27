import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export default function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
): { data: T | null; message: string } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorMessage = fromZodError(result.error).message; // Extract user-friendly error message
    return {
      data: null,
      message: result.error.errors.at(0)?.message || errorMessage,
    };
  }

  return {
    data: result.data,
    message: 'Data validated successfully',
  };
}
