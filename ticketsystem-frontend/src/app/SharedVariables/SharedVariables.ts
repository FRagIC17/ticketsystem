import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedVariables {
    public static baseUrl: string = 'http://localhost:8080';

    public isUserView = false;
}