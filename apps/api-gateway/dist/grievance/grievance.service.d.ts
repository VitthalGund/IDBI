import { Repository } from 'typeorm';
import { Grievance } from './entities/grievance.entity';
export declare class GrievanceService {
    private grievanceRepo;
    private ai;
    constructor(grievanceRepo: Repository<Grievance>);
    redactPii(text: string): string;
    analyzeGrievance(text: string): Promise<any>;
    private fallbackClassifier;
    resolveGrievances(): Promise<void>;
}
