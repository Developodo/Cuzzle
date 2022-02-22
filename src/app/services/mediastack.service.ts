import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { New } from '../model/New';

@Injectable({
  providedIn: 'root'
})
export class MediastackService {
  
  constructor(private http:HttpClient) { }
  /**
   * Uses mediastack api service
   * @param date 'yyyy-mm-dd'
   * @returns a promise with a today's new with an image from mediastack api
   */
  getnew(date):Promise<New>{
    return new Promise((resolve,reject)=>{
      let url="http://api.mediastack.com/v1/news?"
            +"access_key="+environment.mediaStackApiKey
            +"&sources=cope"
            +"&languages=es"
            +"&category=general"
            +"&date="+date
            +"&limit=10"
      this.http.get(url).subscribe((data:any)=>{
        let imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i
        for(let n of data.data){  //first with an image to be displayed
          if(imageReg.test(n.image)){
            resolve(n as New);
          }
        }
      })
    });
  }
}
