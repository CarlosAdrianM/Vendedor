import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class SelectorVendedoresService {

    private db: any;

    constructor() { 
        this.db = firebase.firestore();
    }

    public getVendedores(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection("vendedores")
                .get()
                .then((querySnapshot) => {
                    let arr = [];
                    querySnapshot.forEach(function (doc) {
                        var obj = doc.data();
                        //var data_stringify = JSON.stringify(data);
                        //var obj = JSON.parse(data_stringify);
                        obj.$key = doc.id
                        console.log(obj)
                        arr.push(obj);
                    });
      
                    
                    if (arr.length > 0) {
                        console.log("Document data:", arr);
                        resolve(arr);
                    } else {
                        console.log("No such document!");
                        resolve(null);
                    }
                    
                })
                .catch((error: any) => {
                    reject(error);
                });
            });
        }
    /*
    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
    */
}