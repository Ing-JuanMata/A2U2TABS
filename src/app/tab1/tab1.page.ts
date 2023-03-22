import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AlertController, IonInput } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  tasks: Task[] = [];
  task: Task = { name: '', completed: false };
  @ViewChild('input') input!: IonInput;

  constructor(
    private taskService: TaskService,
    private alertController: AlertController
  ) {}

  ionViewDidEnter() {
    this.input.setFocus();
    this.tasks = this.taskService.getPendingTasks();
  }

  ionTabsDidChange() {
    console.log('Cambio de tareas pendientes');
  }

  public completeTask(index: number) {
    this.confirmationDialog('¿Desea marcar esta tarea como completada?', () => {
      this.taskService.completeTask(index);
      this.tasks = this.taskService.getPendingTasks();
    });
  }

  public async deleteTask(task: Task) {
    this.confirmationDialog('¿Realmente desea eliminar la tarea?', () => {
      this.taskService.deleteTask(task);
      this.tasks = this.taskService.getPendingTasks();
    });
  }

  public newTask() {
    if (this.task.name === '' || this.task === null) return;
    this.taskService.addTask({ ...this.task });
    this.task.name = '';
    this.input.setFocus();
    this.tasks = this.taskService.getPendingTasks();
  }

  public async updateTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Editar tarea',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: task.name,
          placeholder: 'Nombre de la tarea',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Editar',
          handler: async (data) => {
            this.confirmationDialog(
              '¿Desea editar la tarea?',
              undefined,
              (respuesta: OverlayEventDetail) => {
                if (respuesta.role !== 'confirm') return;
                this.taskService.updateTask(task, {
                  name: data.name,
                  completed: false,
                });
                this.tasks = this.taskService.getPendingTasks();
                alert.dismiss();
              }
            );
            return false;
          },
        },
      ],
    });
    alert.present();
  }

  private async confirmationDialog(
    header: string,
    handler?: Function,
    dismissFunction?: Function
  ) {
    const alert = await this.alertController.create({
      header,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'primary',
          handler: () => {
            if (handler) handler();
          },
        },
      ],
    });
    alert.present();
    alert.onDidDismiss().then((respuesta) => {
      if (dismissFunction) dismissFunction(respuesta);
    });
  }
}
