import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData, DocumentData,
  Firestore,
  query, updateDoc,
  where
} from '@angular/fire/firestore';

import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private collection: CollectionReference<DocumentData>;
  constructor(private readonly firestore: Firestore) {
    this.collection = collection(firestore, 'tasks');
  }

  public async addTask(task: Task) {
    const ref = await addDoc(this.collection, task);
    return docData(ref);
  }

  public completeTask(id: string): Promise<void> {
    const dcmt = doc(this.firestore, `${this.collection.path}/${id}`);
    return updateDoc(dcmt, { completed: true });
  }

  public uncompleteTask(id: string): Promise<void> {
    const dcmt = doc(this.firestore, `${this.collection.path}/${id}`);
    return updateDoc(dcmt, { completed: false });
  }

  public deleteTask(task: Task): Promise<void> {
    const dcmt = doc(this.firestore, `${this.collection.path}/${task.id}`);
    return deleteDoc(dcmt);
  }

  public getTask(index: number): Observable<Task> {
    return docData(
      doc(this.firestore, `${this.collection.path}/${index}`)
    ) as Observable<Task>;
  }

  public updateTask(task: Task): void {
    const dcmt = doc(this.firestore, `${this.collection.path}/${task.id}`);
    updateDoc(dcmt, { ...task });
  }

  public getCompletedTasks(): Observable<Task[]> {
    return collectionData(
      query(this.collection, where('completed', '==', true)),
      { idField: 'id' }
    ) as Observable<Task[]>;
  }

  public getPendingTasks(): Observable<Task[]> {
    return collectionData(
      query(this.collection, where('completed', '==', false)),
      { idField: 'id' }
    ) as Observable<Task[]>;
  }
}
