import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class IngresosService {

    private db: any;

  constructor() { 
    this.db = firebase.firestore();
  }

  getIngresosVendedor(vendedor: any): Promise<any> {
      //var refCliente = this.db.collection("clientes").doc(cliente);
  return new Promise((resolve, reject) => {
      this.db.collection("ingresos")
        .where('vendedor', '==', vendedor)
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


  
    addIngreso(dataObj: any): Promise<any> {
        
        dataObj.usuario = firebase.auth().currentUser.uid;
        dataObj.fechaCreacion = firebase.firestore.Timestamp.now();
        var sumaImporte = 0;
        var counter = dataObj.cobrosIngresados.length;

        return this.db.runTransaction(tr => {
            return new Promise((resolve, reject) => {

                    var usuarioRef = this.db.collection("usuarios").doc(dataObj.usuario);
                    usuarioRef.get().then(u => {
                        var vendedorRef = u.data().vendedor;
                        dataObj.vendedor = vendedorRef;
                        vendedorRef.get().then(v =>{
                            dataObj.cobrosIngresados.forEach(d => {
                                var cobroVendedorRef = vendedorRef.collection("cobrosPendientesIngreso").doc(d);
                                cobroVendedorRef.get().then(v => {
                                    sumaImporte += v.data().importe;
                                    tr.delete(cobroVendedorRef);
                                    counter--;
                                    if (counter === 0) { // para que solo entre cuando estén los get hechos
                                        dataObj.importe = sumaImporte;
                                        var ingresoRef = this.db.collection("ingresos").doc();
                                        tr.set(ingresoRef, dataObj);
                                        resolve(v);
                                    }
                                });
                            }) 
                        }).catch((error: any) => {
                            reject(error);
                        });
                    });            

            });
        }).then(function() {
            console.log("Registro de ingreso completado con éxito");
        }).catch(function(error) {
            console.log("Error al registrar el ingreso: ", error);
        });
    }

  getCobrosPendientes(vendedor: any): Promise<any> {
    return new Promise((resolve, reject) => {
        vendedor.collection("cobrosPendientesIngreso")
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

            arr = arr.sort((obj1, obj2) => {
                if (obj1.fecha > obj2.fecha) {
                    return 1;
                }
            
                if (obj1.fecha < obj2.fecha) {
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
}