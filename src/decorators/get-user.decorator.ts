import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;

    if (data == 'id') return Number(user.id);

    return data ? user?.[data] : user;
  },
);
