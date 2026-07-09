"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrievanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const grievance_controller_1 = require("./grievance.controller");
const grievance_service_1 = require("./grievance.service");
const grievance_entity_1 = require("./entities/grievance.entity");
let GrievanceModule = class GrievanceModule {
};
exports.GrievanceModule = GrievanceModule;
exports.GrievanceModule = GrievanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([grievance_entity_1.Grievance])],
        controllers: [grievance_controller_1.GrievanceController],
        providers: [grievance_service_1.GrievanceService],
    })
], GrievanceModule);
//# sourceMappingURL=grievance.module.js.map