import { Injectable } from '@angular/core';
import { MediastackService } from './mediastack.service';
import { ImageManipulatorService } from './image-manipulator.service';
import {AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  private collection:AngularFirestoreCollection<unknown>;
  constructor(private m:MediastackService,
              private iM:ImageManipulatorService,
              private firestore: AngularFirestore) {
                this.collection = this.firestore.collection("news");
               }

  public getImage(){
    return "/assets/images/test"+(Math.floor(Math.random() * 8)+1)+".jpg";
  }
  public async getNew(canvas){
    let today:any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    let n:firebase.default.firestore.DocumentSnapshot<unknown>=await this.collection.doc(today).get().toPromise();
    let currentNew:any=null;
    console.log(n);
    if(!n.exists){
      console.log("Creando nueva noticia");
      //create todaw new
      let m=await this.m.getnew();
      console.log(m);
      await this.collection.doc(today).set(m);
      
      currentNew=m;
    }else{
      console.log(n.data());
      currentNew=n.data();
    }
    await this.cropImage(canvas,currentNew.image);
    return currentNew;
  }

  public cropImage(canvas:HTMLCanvasElement,url){
    //canvas=document.getElementById("joder") as HTMLCanvasElement;
    return new Promise((resolve,reject)=>{
      const ctx:CanvasRenderingContext2D = canvas.getContext('2d');
    
    let image = new Image();
    image.crossOrigin="";
    image.src = url;

    image.onload = (d)=>{
      console.log(d)
      const ratio=image.width/image.height;
      
      if(image.width>image.height){
        image.height=256;
        image.width=256*ratio;
        
      }else{
        image.width=256;
        image.height=256*ratio;
      }
      console.log(ratio+"-"+image.width+"-"+image.height)
      let dx=Math.abs(256-image.width)/2;
      let dy=Math.abs(256-image.height)/2;
      if(image.width>image.height)
        ctx.drawImage(image,-dx,0,256+dx,image.height);
      else
        ctx.drawImage(image,0,-dy,image.width,256+dy);
      //ctx.drawImage(image,0,0, canvas.width, canvas.height);
    
      resolve(null);
    }
    })
    
  }



}
