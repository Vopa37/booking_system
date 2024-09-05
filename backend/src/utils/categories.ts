import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesHelpers {
  constructor(private prisma: PrismaService) {}

  async getAllChildCategories(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!category) {
      return [];
    }

    const descendants = await this.prisma.category.findMany({
      where: { parent_category_id: id },
    });

    const descendantDescendants = await Promise.all(
      descendants.map((descendant) =>
        this.getAllChildCategories(descendant.id),
      ),
    );

    const allDescendants = descendants.concat(descendantDescendants.flat());

    return allDescendants;
  }

  async approveAllParentCategories(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (category.is_confirmed === false) {
      await this.prisma.category.update({
        where: {
          id: category.id,
        },
        data: {
          is_confirmed: true,
        },
      });
    }

    if (category.parent_category_id === null) {
      return;
    }

    const parent = await this.prisma.category.findUnique({
      where: { id: category.parent_category_id },
    });

    return await this.approveAllParentCategories(parent.id);
  }
}
