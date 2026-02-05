export declare class DispatchBroker {
    private service;
    private queue;
    constructor(service: string);
    dispatch(jobName: string, payload: any, opts?: {}): Promise<import("bullmq").Job<any, any, string>>;
}
