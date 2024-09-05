import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { saveImage } from '../utils/save-image';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}
  async create(
    createEventDto: CreateEventDto,
    image: Express.Multer.File,
    userId: number,
  ) {
    // ulozit image do adresare /backend/static a vratit cestu k nemu
    let imageUrl = null;
    if (image) {
      imageUrl = await saveImage(image);
    }

    return this.prisma.event.create({
      data: {
        event_start: createEventDto.event_start,
        event_end: createEventDto.event_end,
        capacity: createEventDto.capacity,
        image: imageUrl,
        is_confirmed: false,
        name: createEventDto.name,
        venue: {
          connect: {
            id: createEventDto.venue_id,
          },
        },
        created_by: {
          connect: {
            id: userId,
          },
        },
        categories_to_events: {
          create: createEventDto.categories.map((category) => ({
            category: {
              connect: {
                id: category,
              },
            },
          })),
        },
        admission: {
          create: createEventDto.admissions?.map((admission) => ({
            ...admission,
          })),
        },
      },
    });
  }

  findAll(query: any) {
    return this.prisma.event.findMany({
      include: {
        admission: true,
      },
      where: {
        created_by_id: query.createdBy ? parseInt(query.createdBy) : undefined,
        is_confirmed: query.approved && query.approved === 'true',
      },
    });
  }

  async findOne(id: number) {
    const eventData = await this.prisma.event.findFirst({
      where: { id },
      include: {
        admission: true,
        categories_to_events: {
          include: {
            category: true,
          },
        },
      },
    });

    const categoryIds = eventData?.categories_to_events.map(
      (categoryEvent) => categoryEvent.category_id,
    );

    const transformedEvent = {
      ...eventData,
      categories: categoryIds,
      categories_to_events: undefined,
    };

    return transformedEvent;
  }

  async update(
    id: number,
    image: Express.Multer.File,
    updateEventDto: UpdateEventDto,
  ) {
    let imageName = undefined;

    await this.prisma.categoriesToEvents.deleteMany({
      where: {
        event_id: id,
      },
    });

    const { venue_id, categories, admissions, ...eventData } = updateEventDto;
    if (image) {
      imageName = await saveImage(image);
    }

    const existingAdmissions = await this.prisma.admission.findMany({
      where: {
        event_id: id,
      },
    });

    const newAdmissions = admissions?.filter((newAdmission) => {
      return !existingAdmissions.some(
        (existingAdmission) =>
          existingAdmission.price === newAdmission.price &&
          existingAdmission.currency === newAdmission.currency &&
          existingAdmission.type === newAdmission.type &&
          existingAdmission.event_id === id,
      );
    });

    const admissionIdsToRemove = existingAdmissions
      .filter(
        (existingAdmission) =>
          !admissions?.some(
            (newAdmission) =>
              existingAdmission.price === newAdmission.price &&
              existingAdmission.currency === newAdmission.currency &&
              existingAdmission.type === newAdmission.type,
          ),
      )
      .map((admission) => admission.id);

    await Promise.all(
      admissionIdsToRemove.map(async (admissionId) =>
        this.prisma.admission.delete({
          where: {
            id: admissionId,
          },
        }),
      ),
    );

    return this.prisma.event.update({
      where: {
        id,
      },
      data: {
        venue: {
          connect: {
            id: venue_id,
          },
        },
        categories_to_events: {
          create: (categories || []).map((category) => ({
            category: {
              connect: {
                id: category,
              },
            },
          })),
        },
        admission: {
          create: newAdmissions?.map((admission) => ({
            ...admission,
          })),
        },
        ...eventData,
        image: imageName,
      },
    });
  }

  confirm(id: number) {
    return this.prisma.event.update({
      where: {
        id,
      },
      data: {
        is_confirmed: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.usersToEvents.deleteMany({
      where: {
        event_id: id,
      },
    });

    // Smazání Admission
    await this.prisma.admission.deleteMany({
      where: {
        event_id: id,
      },
    });

    // Smazání CategoriesToEvents
    await this.prisma.categoriesToEvents.deleteMany({
      where: {
        event_id: id,
      },
    });

    // Nakonec smazání samotné události
    await this.prisma.event.delete({
      where: {
        id: id,
      },
    });
  }

  getMonthEvents(year: number, month: number, userId: number) {
    return this.prisma.event.findMany({
      where: {
        participants: { some: { user_id: userId } },
        OR: [
          {
            event_start: {
              gte: new Date(year, month - 1, 1),
              lte: new Date(year, month, 0), // Set day to 0 to get the last day of the previous month
            },
          },
          {
            event_end: {
              gte: new Date(year, month - 1, 1),
              lte: new Date(year, month, 0), // Set day to 0 to get the last day of the previous month
            },
          },
        ],
      },
    });
  }

  getEventsCreatedBy(userId: number) {
    return this.prisma.event.findMany({
      where: {
        created_by_id: userId,
      },
    });
  }

  async registerUserToEvent(
    event_id: number,
    user_id: number,
    admission_id: number,
  ) {
    if (
      await this.prisma.usersToEvents.findFirst({
        where: { user_id, event_id },
      })
    ) {
      throw new HttpException(
        'User is already registered to this event',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.prisma.usersToEvents.create({
      data: {
        user: {
          connect: {
            id: user_id,
          },
        },
        admission: admission_id
          ? {
              connect: { id: admission_id },
            }
          : undefined,
        event: {
          connect: {
            id: event_id,
          },
        },
      },
    });
  }

  unregisterUserFromEvent(event_id: number, user_id: number) {
    return this.prisma.usersToEvents.delete({
      where: {
        event_id_user_id: {
          event_id,
          user_id,
        },
      },
    });
  }

  async getEventsByCategories(
    categoryIds: number[],
    createdBy?: number,
    userId?: number,
  ) {
    const authUserFilters: Prisma.EventWhereInput = {
      OR: [{ created_by_id: userId }, { is_confirmed: true }],
    };
    const nonAuthUserFilters: Prisma.EventWhereInput = { is_confirmed: true };

    return this.prisma.event.findMany({
      where: {
        categories_to_events:
          categoryIds.length > 0
            ? { some: { category_id: { in: categoryIds } } }
            : undefined,
        ...(userId ? authUserFilters : nonAuthUserFilters),
        created_by_id: createdBy,
      },
    });
  }

  async getEventUsers(event_id: number) {
    return this.prisma.usersToEvents.findMany({
      where: {
        event_id,
      },
      select: {
        user: true,
        admission: true,
        is_paid: true,
      },
    });
  }

  async isRegistered(event_id: number, user_id: number) {
    const result = await this.prisma.usersToEvents.findFirst({
      where: {
        event_id,
        user_id,
      },
    });
    return !!result; // Pokud result existuje, vrátí true, jinak vrátí false
  }

  async isPaid(event_id: number, user_id: number) {
    const result = await this.prisma.usersToEvents.findFirst({
      where: {
        event_id,
        user_id,
      },
    });
    if (!result) {
      return -1;
    }
    if (result?.admission_id == null || result?.is_paid) {
      return 1;
    } else {
      return 0;
    }
  }

  userPaidEvent(user_id: number, event_id: number) {
    return this.prisma.usersToEvents.update({
      where: {
        event_id_user_id: {
          event_id,
          user_id,
        },
      },
      data: {
        is_paid: true,
      },
    });
  }

  addReview(
    eventId: number,
    userId: number,
    rating: number,
    text_review: string,
  ) {
    return this.prisma.usersToEvents.update({
      where: {
        event_id_user_id: { event_id: eventId, user_id: userId },
      },
      data: { rating, text_review },
    });
  }

  getReviews(eventId: number) {
    return this.prisma.usersToEvents.findMany({
      where: {
        event_id: eventId,
        OR: [{ rating: { not: null } }, { text_review: { not: null } }],
      },
      select: {
        user: { select: { username: true } },
        text_review: true,
        rating: true,
      },
    });
  }

  admissionExists(eventId: number, userId: number) {
    return this.prisma.usersToEvents.findUnique({
      where: { event_id_user_id: { event_id: eventId, user_id: userId } },
    });
  }

  getEventOccupancy(eventId: number) {
    return this.prisma.usersToEvents.aggregate({
      _count: true,
      where: {
        event_id: eventId,
      },
    });
  }
}
