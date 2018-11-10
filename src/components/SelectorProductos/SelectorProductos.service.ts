import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class SelectorProductosService {

    private db: any;

    constructor() { 
        this.db = firebase.firestore();
    }

    public getProductos(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection("productos")
                .get()
                .then((querySnapshot) => {
                    let arr = [];
                    querySnapshot.forEach(function (doc) {
                        var obj = doc.data();
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
}