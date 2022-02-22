import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { New } from '../model/New';
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
  /**
   * @returns todays in 'yyyy-mm-dd format'
   */
  public getToday():string {
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
  }
  /**
   * It tries to find the new from firebase to avoid loading from service api
   * and overloading it. If exists, this new is returned. Else, the service is
   * asked, in this case COPE RSS, and and the new is stored in firebase and returned
   * @returns a Primise with today's new
   */
  public async getNew():Promise<New>{
    let today = this.getToday();
    let n: firebase.default.firestore.DocumentSnapshot<unknown> =
      await this.collection.doc(today).get().toPromise();
    let currentNew: New = null;

    if (!n.exists) {
      let m = await this.cope.getnew(null);
      await this.collection.doc(today).set(m);
      currentNew = m;
    } else {
      currentNew = n.data() as New;
    }
    return currentNew;
  }
}
