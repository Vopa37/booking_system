import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Put,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators';
import { JwtGuard, OptionalJwtAuthGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { HasRole } from '../auth/decorators/has-roles.decorator';
import { UserRole } from '@prisma/client';
import { GetEventsByCategoriesDto } from './dto/get-events-by-categories.dto';
import { ReviewDto } from './dto/review.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() image,
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User,
  ) {
    return this.eventService.create(createEventDto, image, user.id);
  }

  //@UseGuards(JwtGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.eventService.findAll(req['query']);
  }

  @Get('/unapproved')
  findUnapproved() {
    return this.eventService.findAll({ approved: 'false' });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const [eventResult, isRegistered, isPaid, eventOccupancy] =
      await Promise.all([
        this.eventService.findOne(+id),
        this.eventService.isRegistered(+id, user.id),
        this.eventService.isPaid(+id, user.id),
        this.eventService.getEventOccupancy(+id),
      ]);

    return {
      ...eventResult,
      is_registered: isRegistered,
      is_paid: isPaid === 1 ? true : isPaid === 0 ? false : undefined,
      occupancy: eventOccupancy._count,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: number,
    @UploadedFile() image,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update(+id, image, updateEventDto);
  }

  @Get(':event_id/users')
  getEventsUsers(@Param('event_id') event_id: string) {
    return this.eventService.getEventUsers(+event_id);
  }

  @HasRole(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.eventService.remove(+id);
  }

  @HasRole(UserRole.ADMIN, UserRole.MODERATOR)
  //@UseGuards(JwtGuard, RolesGuard)
  @Patch(':id/confirm')
  confirm(@Param('id') id: number) {
    return this.eventService.confirm(+id);
  }

  @UseGuards(JwtGuard)
  @Get('/:event_id/reviews')
  getReviews(@Param('event_id') eventId: string) {
    return this.eventService.getReviews(parseInt(eventId));
  }

  @UseGuards(JwtGuard)
  @Get('/:event_id/admission_exists')
  admissionExists(@Param('event_id') eventId: string, @GetUser() user: User) {
    return this.eventService.admissionExists(parseInt(eventId), user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':year/:month')
  getMonthEvents(
    @Param('year') year: number,
    @Param('month') month: number,
    @GetUser() user: User,
  ) {
    return this.eventService.getMonthEvents(year, month, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':event_id/register')
  registerUserToEvent(
    @Param('event_id') event_id: string,
    @GetUser() user: User,
    @Body() body: any,
  ) {
    return this.eventService.registerUserToEvent(
      parseInt(event_id),
      user.id,
      body.admission ? parseInt(body.admission) : null,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':event_id/unregister')
  unregisterUserFromEvent(
    @Param('event_id') event_id: string,
    @GetUser() user: User,
  ) {
    return this.eventService.unregisterUserFromEvent(
      parseInt(event_id),
      user.id,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post('get-by-categories')
  getEventsByCategories(
    @Body() body: GetEventsByCategoriesDto,
    @GetUser() user?: User,
  ) {
    return this.eventService.getEventsByCategories(
      body.categories,
      body.createdBy,
      user?.id,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Put('/:event_id/:user_id/paid')
  userPaid(
    @Param('event_id') event_id: string,
    @Param('user_id') user_id: string,
  ) {
    return this.eventService.userPaidEvent(
      parseInt(user_id),
      parseInt(event_id),
    );
  }

  @UseGuards(JwtGuard)
  @Post('/:event_id/review')
  addReview(
    @Body() body: ReviewDto,
    @Param('event_id') eventId: string,
    @GetUser() user: User,
  ) {
    return this.eventService.addReview(
      parseInt(eventId),
      user.id,
      body.rating,
      body.text_review,
    );
  }
}
