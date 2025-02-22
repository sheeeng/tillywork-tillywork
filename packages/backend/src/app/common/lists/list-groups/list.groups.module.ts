import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ListGroup } from "./list.group.entity";
import { ListGroupsService } from "./list.groups.service";
import { ListGroupsController } from "./list.groups.controller";
import { ListStagesModule } from "../list-stages/list.stages.module";
import { FieldsModule } from "../../fields/fields.module";
import { ListsModule } from "../lists.module";
import { AuthModule } from "../../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ListGroup]),
        ListStagesModule,
        FieldsModule,
        forwardRef(() => ListsModule),
        AuthModule,
    ],
    controllers: [ListGroupsController],
    providers: [ListGroupsService],
    exports: [ListGroupsService],
})
export class ListGroupsModule {}
