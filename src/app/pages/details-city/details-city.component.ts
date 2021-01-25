import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-details-city',
  templateUrl: './details-city.component.html',
  styleUrls: ['./details-city.component.css']
})
export class DetailsCityComponent implements OnInit {

  formSearch: any;
  idCity: any;
  resultDetailsCity = [];
  detailsCity = {};
  loading: boolean = true;
  currentDate = this.datepipe.transform(new Date(), 'HH:mm LLL d');

  constructor(
    private router: Router,
    private activeroute: ActivatedRoute,
    private api: ApiService,
    private datepipe: DatePipe
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.formSearch = new FormGroup({
      searchCity: new FormControl('')
    });
  }

  // Start, ngOnInit
  ngOnInit(): void {
    this.activeroute.params.subscribe(params => {
      this.idCity = params['id'];
    });
    this.searchCityDetails();
  }
  // End, ngOnInit

  // Start, searchCityDetails
  async searchCityDetails() {
    if (this.idCity != undefined && this.idCity != '') {
      // Start, seeks the details of the weather on the current day
      await this.api.searchData(`${environment.weather}`, this.idCity).then(
        dataCity => { 
          if (dataCity['id'] != undefined) {
            this.formSearch.controls['searchCity'].setValue(dataCity['name']+', '+dataCity['sys']['country']);
            this.detailsCity = {
              name: dataCity['name'],
              country: dataCity['sys']['country'],
              temp: dataCity['main']['temp'],
              description: dataCity['weather'][0]['description'],
              iconImg: `https://openweathermap.org/img/w/${dataCity['weather'][0]['icon']}.png`,
              max: dataCity['main']['temp_max'],
              min: dataCity['main']['temp_min'],
              sunrise: dataCity['sys']['sunrise'].toString().substring(0,2)+':'+dataCity['sys']['sunrise'].toString().substring(2,4),
              sunset: dataCity['sys']['sunset'].toString().substring(0,2)+':'+dataCity['sys']['sunset'].toString().substring(2,4),
            };
          } else {
            this.router.navigate(['/search']);
          }
      });
      // End, seeks the details of the weather on the current day

      // Start, seeks the weather forecast for the next days
      await this.api.searchData(`${environment.forecast}`, this.idCity).then(
        data => {
          if (data['cod'] == "200" && data['list'].length > 0) {
              this.resultDetailsCity = [];
              for(let i = 0; i<data['list'].length; i++) {
                this.resultDetailsCity.push({
                  day: this.datepipe.transform(data['list'][i].dt_txt, 'EEE d LLL'),
                  hour: this.datepipe.transform(data['list'][i].dt_txt, 'HH:mm'),
                  tempMax: data['list'][i]['main'].temp_max,
                  tempMin: data['list'][i]['main'].temp_min,
                  description: data['list'][i]['weather'][0].description,
                  iconImg: `https://openweathermap.org/img/w/${data['list'][i]['weather'][0].icon}.png`
                });              
              }
          } else {
            // Did not find any data for the given city id
            this.router.navigate(['/search']);
          }
        }
      );
      // End, seeks the weather forecast for the next days
      this.loading = false;
    }
  }
  // End, searchCityDetails

  // Start, onSubmit
  async onSubmit(values) {
    //search for a new city
    this.router.navigate(['/search'], { queryParams: { q: values.searchCity } });
  }
  // End, onSubmit
}