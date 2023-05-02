import { Component, OnDestroy } from '@angular/core';
import { Task } from '../interfaces/task';
import { TaskService } from '../services/task.service';
import { AlertController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy {
  task$: Subscription;
  tasks: Task[] = [];
  task: Task = { name: '', completed: false };

  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.task$ = this.taskService.getCompletedTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  public uncompleteTask(id: string) {
    this.confirmationDialog(
      '¿Desea marcar la tarea como no completada?',
      () => {
        this.taskService.uncompleteTask(id).then(() => {
          this.showToast(
            'La tarea ha sido desmarcada como completada',
            'success'
          );
        });
      },
      (respuesta: OverlayEventDetail) => {
        if (respuesta.role === 'cancel') {
          this.showToast('Operación cancelada', 'warning');
        }
      }
    );
  }

  public async deleteTask(task: Task) {
    this.confirmationDialog(
      '¿Realmente desea eliminar la tarea?',
      () => {
        this.taskService.deleteTask(task);
      },
      (respuesta: OverlayEventDetail) => {
        if (respuesta.role === 'cancel') {
          this.showToast('Operación cancelada', 'warning');
        }

        if (respuesta.role === 'confirm') {
          this.showToast('La tarea ha sido eliminada', 'success');
        }
      }
    );
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

  private async showToast(
    message: string,
    color: 'success' | 'danger' | 'warning'
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 1000,
    });
    toast.present();
  }

  ngOnDestroy() {
    this.task$.unsubscribe();
  }
}
