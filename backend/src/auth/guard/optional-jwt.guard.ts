import { AuthGuard } from '@nestjs/passport';

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, _info, _context) {
    return user ?? undefined;
  }
}
