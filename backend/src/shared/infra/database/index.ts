import { Provider } from '@nestjs/common';

import { PrismaClientService } from './prisma/prisma-client.service';

export const DatabaseServices: Provider[] = [PrismaClientService];
