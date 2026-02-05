export type JobHandler<T = any> = (payload: T) => Promise<void> | void;
export declare function registerJob(type: string, handler: JobHandler): void;
export declare function getJobHandler(type: string): JobHandler<any> | undefined;
export declare function listJobs(): string[];
export declare function resolveServiceQueue(service: string): string;
