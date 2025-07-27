import { z } from 'zod';
import validateSchema from './utils/validate-schema';
import dotenv from 'dotenv';
dotenv.config();


const ENVSchema = z.object({
  POSTGRES_URI: z.string({
    required_error: 'POSTGRES_URI is required',
    invalid_type_error: 'POSTGRES_URI must be a string',
  }),
  NODE_ENV: z.string({
    required_error: 'NODE_ENV is required',
    invalid_type_error: 'NODE_ENV must be a string',
  }),
  REDIS_URL: z.string({
    required_error: 'REDIS_URL is required',
    invalid_type_error: 'REDIS_URL must be a string',
  }),
  ANTHROPIC_KEY: z.string({
    required_error: 'ANTHROPIC_KEY is required',
    invalid_type_error: 'ANTHROPIC_KEY must be a string',
  }),

});
const { data, message } = validateSchema(ENVSchema, process.env);
if (!data) {
  console.trace(message);
  process.exit(1);
}

export const env = data;

