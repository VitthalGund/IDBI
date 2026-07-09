import { Repository } from 'typeorm';
import { GrievanceService } from './grievance.service';
import { Grievance } from './entities/grievance.entity';
export declare class GrievanceController {
    private readonly grievanceService;
    private grievanceRepository;
    constructor(grievanceService: GrievanceService, grievanceRepository: Repository<Grievance>);
    analyze(text: string, idempotencyKey: string): Promise<{
        success: boolean;
        data: Grievance;
        idempotencyKey: string;
        cached: boolean;
    } | {
        success: boolean;
        data: Grievance;
        idempotencyKey: string;
        cached?: undefined;
    }>;
}
