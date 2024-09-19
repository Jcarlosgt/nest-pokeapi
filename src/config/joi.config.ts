import * as Joi from 'joi';

export const JoiConfig = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3000),
  DEFAULTLIMIT: Joi.number().default(6),
});
