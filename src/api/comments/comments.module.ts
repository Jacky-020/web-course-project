import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './entities/comment.entity';
import { Comment } from './entities/comment.entity';
import { EventsModule } from '../events/events.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    EventsModule,
    LocationsModule,
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
  ],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
