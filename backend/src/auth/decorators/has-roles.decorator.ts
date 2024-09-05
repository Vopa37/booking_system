import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const HasRole = (...roles: UserRole[]) => SetMetadata('roles', roles);
