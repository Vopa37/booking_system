import { Global, Module } from '@nestjs/common';
import { CategoriesHelpers } from './categories';

@Global()
@Module({
  providers: [CategoriesHelpers],
  exports: [CategoriesHelpers],
})
export class UtilsModule {}
