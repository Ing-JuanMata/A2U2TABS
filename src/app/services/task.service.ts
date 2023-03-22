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
    this.tasks.filter((task) => !task.completed)[index].completed = true;
  }

  public uncompleteTask(index: number): void {
    this.tasks.filter((task) => task.completed)[index].completed = false;
  }

  public deleteTask(task: Task): void {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }

  public getTask(index: number): Task {
    return this.tasks.filter((task) => !task.completed)[index];
  }

  public updateTask(oldTask: Task, newTask: Task): void {
    const index = this.tasks.indexOf(oldTask);
    this.tasks[index] = newTask;
  }

  public getCompletedTasks(): Task[] {
    return this.tasks.filter((task) => task.completed);
  }

  public getPendingTasks(): Task[] {
    return this.tasks.filter((task) => !task.completed);
  }
}
