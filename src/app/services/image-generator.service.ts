import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { CopeRSSService } from './cope-rss.service';

@Injectable({
  providedIn: 'root',
})
export class ImageGeneratorService {
  private collection: AngularFirestoreCollection<unknown>;
  constructor(
    private cope: CopeRSSService,
    private firestore: AngularFirestore
  ) {
    this.collection = this.firestore.collection('news');
  }
  public getToday() {
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }
  public async getNew() {
    let today = this.getToday();
    let n: firebase.default.firestore.DocumentSnapshot<unknown> =
      await this.collection.doc(today).get().toPromise();
    let currentNew: any = null;

    if (!n.exists) {
      let m = await this.cope.getnew(null);
      await this.collection.doc(today).set(m);
      currentNew = m;
    } else {
      currentNew = n.data();
    }
    return currentNew;
  }
}
