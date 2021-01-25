import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.css']
})
export class SearchCityComponent implements OnInit {

  formSearch: any;
  valueActiveroute: any;
  resultSearchCity = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private activeroute: ActivatedRoute,
    private api: ApiService
  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.formSearch = new FormGroup({
      searchCity: new FormControl('')
    });
  }

  // Start, ngOnInit
  ngOnInit(): void {       
    this.searchCity();
  }
  // End, ngOnInit

  // Start, searchCity
  async searchCity() {
    this.activeroute.queryParams.subscribe(params => {
      this.valueActiveroute = params['q'];
    });
    this.formSearch.controls['searchCity'].setValue(this.valueActiveroute);
    if (this.valueActiveroute != undefined && this.valueActiveroute != '') {
      this.loading = true;
      // Start, search informed cities
      await this.api.searchData(`${environment.find}`, this.valueActiveroute).then(
        data => {
          if (data['cod'] == "200" && data['list'].length > 0) {
            this.resultSearchCity = [];
            for(let i = 0; i<data['list'].length; i++) {
              this.resultSearchCity.push({
                id: data['list'][i].id,
                name: data['list'][i].name,
                country: data['list'][i].sys.country,
                countryImg: `http://openweathermap.org/images/flags/${data['list'][i].sys.country.toLowerCase()}.png`,
                temp: data['list'][i].main.temp,
                tempMax: data['list'][i].main.temp_max,
                tempMin: data['list'][i].main.temp_min,
                description: data['list'][i].weather[0].description,
                icon: data['list'][i].weather[0].icon,
                iconImg: `https://openweathermap.org/img/w/${data['list'][i].weather[0].icon}.png`,
                idIcon: data['list'][i].weather[0].id
              });
            }
          }
        }
      );
      // End, search informed cities
      this.loading = false;
    }
  }
  // End, searchCity

  // End, onSubmit
  async onSubmit(values) {
    //search for a new city
    this.router.navigate(['/search'], { queryParams: { q: values.searchCity } });
  }
  // End, onSubmit

  // Start, detailsCity
  detailsCity(id) {
    //go to the details of the chosen city
    this.router.navigate([`/details/${id}`]);
  }
  // End, detailsCity
}