import type { Request, Response } from "express";
import {
  acceptTask,
  completeTask,
  createTask,
  getTaskById,
  listTasks,
} from "../services/taskService";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function createTaskHandler(req: Request, res: Response) {
  const { title, description, price, location } = req.body;

  const task = await createTask({
    title,
    description,
    price,
    location,
  });

  return res.status(201).json({
    success: true,
    task,
  });
}

export async function listTasksHandler(_req: Request, res: Response) {
  const tasks = await listTasks();

  return res.json({
    success: true,
    tasks,
  });
}

export async function getTaskHandler(req: Request, res: Response) {
  const id = getRouteParam(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Task id is required",
    });
  }

  const task = await getTaskById(id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: "Task not found",
    });
  }

  return res.json({
    success: true,
    task,
  });
}

export async function acceptTaskHandler(req: Request, res: Response) {
  const id = getRouteParam(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Task id is required",
    });
  }

  const task = await acceptTask(id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: "Task not found",
    });
  }

  return res.json({
    success: true,
    task,
  });
}

export async function completeTaskHandler(req: Request, res: Response) {
  const id = getRouteParam(req.params.id);

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "Task id is required",
    });
  }

  const task = await completeTask(id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: "Task not found",
    });
  }

  return res.json({
    success: true,
    task,
  });
}
