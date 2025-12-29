export async function sequence(...tasks: Array<() => Promise<any>>) {
  const results = [];
  for (const t of tasks) results.push(await t());
  return results;
}

export async function parallel(...tasks: Array<() => Promise<any>>) {
  return Promise.all(tasks.map(t => t()));
}

export async function conditional(predicate: () => Promise<boolean> | boolean, task: () => Promise<any>) {
  const cond = typeof predicate === 'function' ? await predicate() : predicate;
  if (cond) return task();
  return null;
}
