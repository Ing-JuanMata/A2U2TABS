import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, IonInput, ToastController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { Task } from '../interfaces/task';
import { OverlayEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnDestroy {
  task$: Subscription;
  tasks: Task[] = [];
  task: Task = { name: '', completed: false };
  @ViewChild('input') input!: IonInput;

  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.task$ = this.taskService.getPendingTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ionViewDidEnter() {
    this.input.setFocus();
  }

  public completeTask(id: string) {
    this.confirmationDialog(
      '¿Desea marcar esta tarea como completada?',
      () => {
        this.taskService
          .completeTask(id)
          .then(() => {
            this.input.setFocus();
            this.showToast(
              'La tarea ha sido marcada como completada',
              'success'
            );
          })
          .catch((error) => {
            this.input.setFocus();
            this.showToast(error.message, 'danger');
          });
      },
      (respuesta: OverlayEventDetail) => {
        if (respuesta.role === 'cancel') {
          this.input.setFocus();
          this.showToast('Operación cancelada', 'warning');
        }
      }
    );
  }

  public async deleteTask(task: Task) {
    this.confirmationDialog(
      '¿Realmente desea eliminar la tarea?',
      () => {
        this.taskService.deleteTask(task).then(() => {
          this.input.setFocus();
          this.showToast('La tarea ha sido eliminada', 'success');
        });
      },
      (respuesta: OverlayEventDetail) => {
        if (respuesta.role === 'cancel') {
          this.input.setFocus();
          this.showToast('Operación cancelada', 'warning');
        }
      }
    );
  }

  public newTask() {
    if (this.task.name === '' || this.task === null) {
      this.showToast('El nombre de la tarea no puede estar vacío', 'danger');
      return;
    }
    this.taskService
      .addTask(this.task)
      .then(() => {
        this.task.name = '';
        this.input.setFocus();
        this.showToast('Tarea agregada', 'success');
      })
      .catch((error) => {
        this.input.setFocus();
        this.showToast(error.message, 'danger');
      });
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
            if (data.name === '' || data.name === null) {
              this.showToast(
                'El nombre de la tarea no puede estar vacío',
                'danger'
              );
              return false;
            }
            if (data.name === task.name) {
              this.showToast(
                'El nombre de la tarea no puede ser igual al anterior',
                'danger'
              );
              return false;
            }
            this.confirmationDialog(
              '¿Desea editar la tarea?',
              undefined,
              (respuesta: OverlayEventDetail) => {
                if (respuesta.role !== 'confirm') return;
                this.taskService.updateTask({
                  ...task,
                  name: data.name,
                  completed: false,
                });
                alert.dismiss(undefined, 'confirm');
              }
            );
            return false;
          },
        },
      ],
    });
    alert.present();
    alert.onDidDismiss().then((respuesta) => {
      console.log(respuesta);
      if (respuesta.role === 'confirm') {
        this.input.setFocus();
        this.showToast('Tarea editada', 'success');
      }

      if (respuesta.role === 'cancel') {
        this.input.setFocus();
        this.showToast('Operación cancelada', 'warning');
      }
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
