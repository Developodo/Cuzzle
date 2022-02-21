import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { New } from '../model/New';

@Injectable({
  providedIn: 'root'
})
export class MediastackService {
  languages=[
    'ar',// - Arabic
    'de',// - German
    'en',// - English
    'es',// - Spanish
    'fr',// - French
    'he',// - Hebrew
    'it',// - Italian
    'nl',// - Dutch
    'no',// - Norwegian
    'pt',// - Portuguese
    'ru',// - Russian
    'se',// - Swedish
    'zh',// - Chinese
  ];
  countries=[
//Argentina
'ar', 
// Australia
'au',
//  xAustria
'at',
//  Belgium
'be',  
//Brazil
'br',  
//Bulgaria
'bg',
//  Canada
'ca',
//  China
'cn',
//  Colombia
'co',  
//Czech Republic
'cz',
//  Egypt
'eg',
//  France
'fr',
//  Germany
'de',
//  Greece
'gr',
//  Hong Kong
'hk',
//  Hungary
'hu',
//  India
'in',
//  Indonesia
'id',
//  Ireland
'ie',
//  Israel
'il',
//  Italy
'it',
//  Japan
'jp',
//  Latvia
'lv',
//  Lithuania
'lt',
//  Malaysia
'my',
//  Mexico
'mx',
//  Morocco
'ma',  
//Netherlands
'nl',
//  New Zealand
'nz',
//  Nigeria
'ng',
//  Norway
'no',
//  Philippines
'ph',
//  Poland
'pl',
//  Portugal
'pt',
//  Romania
'ro',
//  Saudi Arabia
'sa',
//  Serbia
'rs',
//  Singapore
'sg',  
//Slovakia
'sk',
//  Slovenixxa
'si',
//  South Africa
'za',
//  South Korea
'kr',
//  Sweden
'se',  
//Switzerland
'ch',
//  Taiwan
'tw',  
//Thailand
'th',
//  Turkey
'tr',  
//UAE
'ae',
//  Ukraine
'ua',  
//United Kingdom
'gb',
//  United States
'us', 
// Venuzuela
've'

  ];
  categories=[
    'general',// - Uncategorized News
    'business',// - Business News
    'entertainment',// - Entertainment News
    'health',// - Health News
    'science',// - Science News
    'sports',// - Sports News
    'technology',// - Technology News
  ]
  constructor(private http:HttpClient) { }

  getnew(date):Promise<New>{
    return new Promise((resolve,reject)=>{
      let url="http://api.mediastack.com/v1/news?"
            +"access_key="+environment.mediaStackApiKey
            +"&sources=cope"
            +"&languages=es"
            +"&category=general"
            +"&date="+date
            //+"&keywords=tecnología"
            +"&limit=10"
      this.http.get(url).subscribe((data:any)=>{
        let imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i
        for(let n of data.data){
          if(imageReg.test(n.image)){
            resolve(n as New);
          }
        }
      })
      
    });
    
  }
}
