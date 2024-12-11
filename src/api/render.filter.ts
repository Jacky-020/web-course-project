import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class RenderFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const next = ctx.getNext<() => void>();

    if (
      response &&
      request &&
      next &&
      request.method === 'GET' &&
      !/^\/api\b(?![.])/.test(request.url)
    ) {
      return next();
    }

    return super.catch(exception, host);
  }
}
