export type JobHandler<T = any> = (payload: T) => Promise<void> | void;

const registry = new Map<string, JobHandler>();

export function registerJob(type: string, handler: JobHandler) {
  registry.set(type, handler);
}

export function getJobHandler(type: string) {
  return registry.get(type);
}

export function listJobs() {
  return Array.from(registry.keys());
}

export function resolveServiceQueue(service: string) {
  // consistent naming = easier ops/debugging
  return `ers:${service}`;
}
