import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

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


}
