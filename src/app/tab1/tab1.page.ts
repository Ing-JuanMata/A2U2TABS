import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements AfterViewInit {
  tasks: Task[] = [];
  task: Task = { name: '', completed: false };
  @ViewChild('input') input!: IonInput;

  constructor(private taskService: TaskService) {}

  ngAfterViewInit(): void {
    this.tasks = this.taskService.getPendingTasks();
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }

  public completeTask(index: number) {
    this.taskService.completeTask(index);
    this.tasks = this.taskService.getPendingTasks();
  }

  public deleteTask(index: number) {
    this.taskService.deleteTask(index);
    this.tasks = this.taskService.getPendingTasks();
  }

  public newTask() {
    if (this.task.name === '' || this.task === null) return;
    this.taskService.addTask({ ...this.task });
    this.task.name = '';
    this.input.setFocus();
    this.tasks = this.taskService.getPendingTasks();
  }

  public updateTask(index: number) {
    this.taskService.updateTask(index, { ...this.task });
    this.task.name = '';
    this.input.setFocus();
    this.tasks = this.taskService.getPendingTasks();
  }
}
