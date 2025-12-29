const SERVICE_MAP = {
  notifications: "notifications",
  payments: "payments",
  analytics: "analytics",
  loyalty: "loyalty",
};

export function resolveServiceQueue(service: string): string {
  if (!SERVICE_MAP[service]) throw new Error(`Unknown service: ${service}`);
  return SERVICE_MAP[service];
}
