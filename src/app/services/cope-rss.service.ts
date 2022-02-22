import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { New } from '../model/New';
import { XmlJsom } from '../utilities/XmlJson';

@Injectable({
  providedIn: 'root',
})
export class CopeRSSService {
  url = 'https://www.cope.es/api/es/news/rss.xml';

  constructor(private http: HttpClient) {}
  /**
   * Returns a new from RSS Cope digital newspaper. Using XMlJson this class
   * transform XML into JSON to be analyzed and returns first one that fits
   * with params of New
   * @param date in format 'yyyy-mm-dd'
   * @returns the new
   */
  public getnew(date:string): Promise<New> {
    return new Promise((resolve, reject) => {
      this.http.get(this.url, { responseType: 'text' }).subscribe((data: any) => {
        let datajson=XmlJsom.xml2json(data," ");
        datajson=JSON.parse(datajson);
        let news=datajson['rss'].channel.item;
        
        let imageReg = /image[\/](gif|jpg|jpeg|tiff|png)$/i;
        for (let n of news) {
          if (n.enclosure && n.description &&
          n.title &&  imageReg.test(n.enclosure['@type'])) {
            let ne:New={
              description:XmlJsom.stripHtml(n.description['#cdata']),
              title:n.title['#cdata'],
              image:n.enclosure['@url'],
              url:n.link,
              published_at:n.pubDate,
              source:"COPE"
            }
            resolve(ne);
          }
        }
      });
    });
  }
}
