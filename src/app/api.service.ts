import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from 'src/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get(url: string): Observable<any> {
    return this.http.get(config.API_URL + url);
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(config.API_URL + url, body);
  }
}
