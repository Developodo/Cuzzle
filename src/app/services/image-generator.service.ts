import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {

  constructor() { }

  public getImage(){
    return "/assets/images/test"+(Math.floor(Math.random() * 2)+1)+".jpg";
  }
}
