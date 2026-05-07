import { supabase } from "../config/supabase";

export type TaskInsert = {
  title: string;
  description?: string;
  price?: number;
  location?: string;
};

const TASK_COLUMNS =
  "id,title,description,price,location,status,accepted_by,completed_at,created_at";
const RUNNER_ID_PLACEHOLDER = "runner-placeholder";

export async function createTask(task: TaskInsert) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        ...task,
        status: "open",
      },
    ])
    .select(TASK_COLUMNS);

  if (error) {
    throw error;
  }

  return data;
}

export async function listTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getTaskById(id: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function acceptTask(id: string) {
  const existingTask = await getTaskById(id);

  if (!existingTask) {
    return null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: "accepted",
      accepted_by: RUNNER_ID_PLACEHOLDER,
    })
    .eq("id", id)
    .select(TASK_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function completeTask(id: string) {
  const existingTask = await getTaskById(id);

  if (!existingTask) {
    return null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(TASK_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
