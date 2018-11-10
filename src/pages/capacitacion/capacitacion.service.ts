import firebase from "firebase";
import { Injectable } from "@angular/core";

@Injectable()
export class CapacitacionService {

    private db: any;

    constructor() { 
        this.db = firebase.firestore();
    }

    getClientesCapacitacion(vendedor: any): Promise<any> {
        if (!vendedor) {
            return this.getClientes(null);
        }
        var refClientes = this.db.collection("clientesCapacitacion")
            .where('vendedor', '==', vendedor)
            .orderBy("importeCobrado","desc");

        return this.getClientes(refClientes);
    }

    getClientes(refClientes: any): Promise<any> {
        return new Promise((resolve, reject) => {
        if(!refClientes) {
            resolve(null);
        }
        refClientes.get()
        .then((querySnapshot) => {
            let arr = [];
            querySnapshot.forEach(function (doc) {
                var obj = doc.data();
                obj.$key = doc.id
                console.log(obj)
                arr.push(obj);
            });

            arr = arr.sort((obj1, obj2) => {

                if (obj1.importeCobrado > obj2.importeCobrado) {
                    return 1;
                }
            
                if (obj1.importeCobrado < obj2.importeCobrado) {
                    return -1;
                }
            
                return 0;
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

    getUsuario(): Promise<any> {
        return new Promise((resolve, reject) => {
            var usuarioUid;
            if (firebase.auth().currentUser) {
                usuarioUid = firebase.auth().currentUser.uid;
            } else {
                reject("No hay usuario");
                return;
            }
     
            this.db.collection("usuarios").doc(usuarioUid)
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                        resolve(doc.data());
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                        reject(doc);
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                    reject(error);
                });
            });
        }

    getVendedor(vendedorId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection("vendedores").doc(vendedorId)
            .get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    resolve(doc.ref);
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    reject(doc);
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
                reject(error);
            });
        })
    }
    
    
}
