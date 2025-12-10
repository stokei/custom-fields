import { ApiParam } from '@nestjs/swagger';

export const ApiDocContextParam = () =>
  ApiParam({
    name: 'context',
    required: true,
    description:
      'A string that identifies the context where the fields belong. You define this value freely.',
    schema: {
      type: 'string',
    },
    examples: {
      users: {
        value: 'USERS',
        summary: 'Fields related to users',
      },
      tickets: {
        value: 'TICKETS',
        summary: 'Fields related to support tickets',
      },
      anyCustomContext: {
        value: 'ANY_STRING_YOU_WANT',
        summary: 'You can use any custom context name you need',
      },
    },
  });
