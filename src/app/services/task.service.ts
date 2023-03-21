import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];

  constructor() {
    this.tasks.push({
      name: 'tarea 1',
      completed: false,
    });
  }

  public getTasks(): Task[] {
    return this.tasks;
  }

  public addTask(task: Task): void {
    this.tasks.push(task);
  }

  public completeTask(index: number): void {
    this.tasks[index].completed = true;
  }

  public deleteTask(index: number): void {
    this.tasks.splice(index, 1);
  }

  public getTask(index: number): Task {
    return this.tasks[index];
  }

  public updateTask(index: number, task: Task): void {
    this.tasks[index] = task;
  }

  public getCompletedTasks(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  public getPendingTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }
}
