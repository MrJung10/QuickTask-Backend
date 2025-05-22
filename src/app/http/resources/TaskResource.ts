import dayjs from "dayjs";

import { Task, User, TaskComment } from '@prisma/client';

interface TaskWithRelations extends Task {
  createdAt: Date;
  updatedAt: Date;
  assignee: User | null;
  comments: TaskComment[];
}

export class TaskResource {
  static toArray(tasks: TaskWithRelations[]) {
    return tasks.map((task) => this.toObject(task));
  }

  static toObject(task: TaskWithRelations) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: dayjs(task.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(task.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      assignee: task.assignee
        ? {
            id: task.assignee.id,
            name: task.assignee.name,
            email: task.assignee.email,
            role: task.assignee.role,
          }
        : null,
      comments: task.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      })),
    };
  }
}
