import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Role } from "./entities/role.entity";
import { Model } from "mongoose";

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}
  create(createRoleDto: CreateRoleDto) {
    //TODO: Validate unique names
    return this.RoleModel.create(createRoleDto);
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: string) {
    return this.RoleModel.findById(id);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
