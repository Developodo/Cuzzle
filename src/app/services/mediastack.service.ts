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

  getnew():Promise<New>{
    return new Promise((resolve,reject)=>{
      let mock:New={
        author: null,
        category: "general",
        country: "es",
        description: "Los nuevos servicios regionales casi duplican el número de vehículos que asciende a 48 autobuses para las áreas metropolitanas de Murcia y CartagenaLa puesta en marcha del nuevo servicio de transporte público interurbano Movibus ha supuesto la incorporación de 26 autobuses en las áreas metropolitanas de Murcia y Cartagena para realizar 216 nuevas expediciones diarias con el fin de adaptar los servicios a las necesidades reales de movilidad de los ciudadanos de la Región.“Son 26 autobuses más que transitan gracias a la implantación de Movibus y que antes no circulaban con el anterior...",
        image: "https://cope-cdnmed.agilecontent.com/resources/jpg/6/6/1643832458666.jpg",
        language: "es",
        published_at: "2022-02-03T06:10:00+00:00",
        source: "cope",
        title: "Movibus incorpora 26 autobuses para realizar 216 nuevas expediciones diarias",
        url: "https://www.cope.es/emisoras/region-de-murcia/murcia-provincia/murcia---san-javier/noticias/movibus-incorpora-autobuses-para-realizar-216-nuevas-expediciones-diarias-20220203_1765044"
      }
      let url="http://api.mediastack.com/v1/news?"
            +"access_key="+environment.mediaStackApiKey
            +"&sources=cope"
            +"&languages=es"
            +"&category=general"
            +"&date = 2022-02-08"
            +"&keywords=tecnología"
            +"&limit=10"
      /*url="http://api.mediastack.com/v1/sources"
      +"?access_key="+environment.mediaStackApiKey
      +"&search=bbc"*/
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
