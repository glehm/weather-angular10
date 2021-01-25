import { Injectable } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  searchData(rota: string, value: string, units: string = 'metric') {
    return this.http.get<any>(`${environment.api_url}${rota}${value}&appid=${environment.appid}&units=${units}`)
    .toPromise()
    .then(data => {
      return data;
    }).catch((error) => {
      return error.error;
    });
  }
}
