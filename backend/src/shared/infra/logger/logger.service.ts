import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  info(context: string, message: string) {
    super.log(message, context);
  }

  warn(context: string, message: string) {
    super.warn(message, context);
  }

  error(context: string, message: string, trace?: string) {
    super.error(message, trace, context);
  }
}
