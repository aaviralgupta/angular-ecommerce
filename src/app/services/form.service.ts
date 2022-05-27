import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = 'http://localhost:8081/api';

  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data : number[] =[];

    for(let theMonth = startMonth; theMonth <=12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{

    let data : number[] =[];
    let startYear : number = new Date().getFullYear();
    for(let theYear = startYear; theYear <=startYear+10; theYear++){
      data.push(theYear);
    }
    return of(data);
  }

  getAddressCountries(): Observable<Country[]>{
    const countryUrl : string = this.baseUrl + '/countries';

    return this.httpClient.get<GetResponseCountries>(countryUrl).pipe(
      map(response => response._embedded.countries));

  }

  getAddressStates(theCountry : Country): Observable<State[]>{
    const stateUrl : string = this.baseUrl + '/states/search/findByCountryCode?code='+ theCountry.code;

    return this.httpClient.get<GetResponseStates>(stateUrl).pipe(
      map(response => response._embedded.states));

  }

}

interface GetResponseCountries{
  _embedded:{
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
