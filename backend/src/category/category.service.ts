import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesHelpers } from '../utils/categories';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private categoriesHelpers: CategoriesHelpers,
  ) {}
  create(createCategoryDto: CreateCategoryDto, userId: number) {
    const data = {
      name: createCategoryDto.name,
      is_confirmed: false,
      created_by: {
        connect: {
          id: userId,
        },
      },
    };

    if (createCategoryDto.parent_category_id) {
      // Vytvoříme kategorii s rodičovskou kategorií
      const newCategory = this.prisma.category.create({
        data: {
          ...data,
          parent_category: {
            connect: {
              id: createCategoryDto.parent_category_id,
            },
          },
        },
      });
      return newCategory;
    } else {
      // Vytvoříme kategorii bez rodičovské kategorie
      const newCategory = this.prisma.category.create({
        data: data,
      });
      return newCategory;
    }
  }

  findAllByConfirmed(confirmed: boolean) {
    return this.prisma.category.findMany({
      where: {
        is_confirmed: confirmed,
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  getChildCategories(id: number) {
    return this.prisma.category.findMany({
      where: {
        parent_category_id: id,
      },
    });
  }

  getAllChildCategories(id: number) {
    return this.categoriesHelpers.getAllChildCategories(id);
  }

  findAllRoots() {
    return this.prisma.category.findMany({
      where: {
        parent_category_id: null,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  approve(id: number) {
    return this.categoriesHelpers.approveAllParentCategories(id);
  }

  findAll() {
    return this.prisma.category.findMany();
  }
}
