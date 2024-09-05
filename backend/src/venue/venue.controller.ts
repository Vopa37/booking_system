import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard';
import { HasRole } from '../auth/decorators/has-roles.decorator';
import { UserRole, User } from '@prisma/client';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetUser } from '../auth/decorators';

@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createVenueDto: CreateVenueDto,
    @UploadedFile() image,
    @GetUser() user: User,
  ) {
    return this.venueService.create(createVenueDto, image, user.id);
  }
  @UseGuards(JwtGuard)
  @Get()
  findAll(@GetUser() user: User) {
    return this.venueService.findAll(user.id);
  }

  @Get('/unapproved')
  findUnapproved() {
    return this.venueService.findUnapproved();
  }

  @Get('/approved')
  findApproved() {
    return this.venueService.findApproved();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venueService.findOne(+id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.venueService.remove(parseInt(id));
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @UploadedFile() image,
  ) {
    return this.venueService.update(parseInt(id), updateVenueDto, image);
  }

  @HasRole(UserRole.ADMIN, UserRole.MODERATOR)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.venueService.confirm(parseInt(id));
  }

  @UseGuards(JwtGuard)
  @Get(':id/events')
  getEvents(@Param('id') id: string) {
    return this.venueService.findEvents(parseInt(id));
  }
}
