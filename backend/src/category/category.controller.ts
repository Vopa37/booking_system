import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserRole, User } from '@prisma/client';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtGuard } from '../auth/guard';
import { HasRole } from '../auth/decorators/has-roles.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetUser } from '../auth/decorators';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @GetUser() user: User) {
    return this.categoryService.create(createCategoryDto, user.id);
  }

  @HasRole(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Post('/confirmed')
  findAllByConfirmed(@Body('confirmed') confirmed: boolean) {
    return this.categoryService.findAllByConfirmed(confirmed);
  }

  @Get('/roots')
  findRoots() {
    return this.categoryService.findAllRoots();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get('/descendants/:id')
  findChildCategories(@Param('id') id: string) {
    return this.categoryService.getChildCategories(parseInt(id));
  }

  @Get('/descendants/all/:id')
  findAllChildCategories(@Param('id') id: string) {
    return this.categoryService.getAllChildCategories(parseInt(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Patch('/approve/:id')
  approve(@Param('id') id: string) {
    return this.categoryService.approve(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
