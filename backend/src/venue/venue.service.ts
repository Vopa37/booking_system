import { Injectable } from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { PrismaService } from '../prisma/prisma.service';
import { saveImage } from '../utils/save-image';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}
  async create(
    createVenueDto: CreateVenueDto,
    image: Express.Multer.File,
    userId,
  ) {
    let imageUrl = null;
    if (image) {
      imageUrl = await saveImage(image);
    }
    return this.prisma.venue.create({
      data: {
        name: createVenueDto.name,
        city: createVenueDto.city,
        street: createVenueDto.street,
        postal_code: createVenueDto.postal_code,
        country: createVenueDto.country,
        image: imageUrl,
        description: createVenueDto.description,
        is_confirmed: false,
        created_by: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  findAll(userId) {
    return this.prisma.venue.findMany({
      where: {
        OR: [
          {
            is_confirmed: true,
          },
          {
            created_by_id: userId,
          },
        ],
      },
    });
  }

  findOne(id: number) {
    return this.prisma.venue.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    updateVenueDto: UpdateVenueDto,
    image: Express.Multer.File,
  ) {
    let imageName = null;
    if (image) {
      imageName = await saveImage(image);
    }
    return this.prisma.venue.update({
      where: {
        id,
      },
      data: {
        ...updateVenueDto,
        image: imageName,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.usersToEvents.deleteMany({
      where: {
        event: {
          venue_id: id,
        },
      },
    });

    await this.prisma.admission.deleteMany({
      where: {
        event: {
          venue_id: id,
        },
      },
    });

    await this.prisma.categoriesToEvents.deleteMany({
      where: {
        event: {
          venue_id: id,
        },
      },
    });

    await this.prisma.event.deleteMany({
      where: {
        venue_id: id,
      },
    });

    return this.prisma.venue.delete({
      where: {
        id,
      },
    });
  }

  confirm(id: number) {
    return this.prisma.venue.update({
      where: {
        id,
      },
      data: {
        is_confirmed: true,
      },
    });
  }

  findEvents(id: number) {
    return this.prisma.event.findMany({
      where: {
        venue_id: id,
      },
    });
  }

  findUnapproved() {
    return this.prisma.venue.findMany({
      where: {
        is_confirmed: false,
      },
    });
  }

  findApproved() {
    return this.prisma.venue.findMany({
      where: {
        is_confirmed: true,
      },
    });
  }
}
