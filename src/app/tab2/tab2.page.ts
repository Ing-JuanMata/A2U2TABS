import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Task } from '../interfaces/task';
import { TaskService } from '../services/task.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  tasks: Task[] = [];
  task: Task = { name: '', completed: false };

  constructor(
    private taskService: TaskService,
    private alertController: AlertController
  ) {}

  ionViewDidEnter() {
    this.tasks = this.taskService.getCompletedTasks();
  }

  public uncompleteTask(index: number) {
    this.confirmationDialog('¿Desea marcar la tarea como no completada?', () => {
      this.taskService.uncompleteTask(index);
      this.tasks = this.taskService.getCompletedTasks();
    });
  }

  public async deleteTask(task: Task) {
    this.confirmationDialog('¿Realmente desea eliminar la tarea?', () => {
      this.taskService.deleteTask(task);
      this.tasks = this.taskService.getCompletedTasks();
    });
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
