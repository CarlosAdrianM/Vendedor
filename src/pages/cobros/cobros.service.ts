import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class CobrosService {

    private db: any;

  constructor() { 
    this.db = firebase.firestore();
  }

  getCobrosCliente(cliente: string): Promise<any> {
      //var refCliente = this.db.collection("clientes").doc(cliente);
  return new Promise((resolve, reject) => {
      this.db.collection("cobros")
        .where('cliente', '==', cliente)
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


  
    addCobro(dataObj: any): Promise<any> {
        
        dataObj.usuario = firebase.auth().currentUser.uid;
        dataObj.fechaCreacion = firebase.firestore.Timestamp.now();
        var sumaImporte = 0;
        var counter = dataObj.deudasCobradas.length;

        return this.db.runTransaction(tr => {
            return new Promise((resolve, reject) => {
                dataObj.deudasCobradas.forEach(d => {
                    var ventaRef = this.db.collection("ventas").doc(d);
                    ventaRef.get().then(v => {
                        var restaPorCobrar = dataObj.importeCobrado ?
                            (dataObj.importeCobrado - sumaImporte - v.data().importeDeuda) : 0;
                        if (restaPorCobrar >= 0) {
                            sumaImporte += v.data().importeDeuda;
                        } else {
                            sumaImporte = dataObj.importeCobrado;
                        }
                        
                        var nuevoVentaCobro = ventaRef.collection("cobros").doc();
                        tr.set(nuevoVentaCobro,{fecha:dataObj.fechaCreacion, importe: restaPorCobrar >= 0 ? 
                            v.data().importeDeuda : v.data().importeDeuda - restaPorCobrar});
                        tr.update(ventaRef, {"importeDeuda": restaPorCobrar >= 0 ? 0 : -restaPorCobrar});
                        counter--;
                        if (counter === 0 || (dataObj.importeCobrado && sumaImporte >= dataObj.importeCobrado)) { // para que solo entre cuando estén los get hechos
                            return this.finalizarCobro(dataObj, sumaImporte, tr, resolve, reject);
                        }
                    });                
                })
            });
        }).then(function() {
            console.log("Registro de cobro completado con éxito");
        }).catch(function(error) {
            console.log("Error al registrar el cobro: ", error);
        });
    }

    private finalizarCobro(dataObj: any, sumaImporte: number, tr: any, resolve: any, reject: any): any {
        dataObj.importe = sumaImporte;
        var cobroRef = this.db.collection("cobros").doc();
        tr.set(cobroRef, dataObj);
        var usuarioRef = this.db.collection("usuarios").doc(dataObj.usuario);
        usuarioRef.get().then(u => {
            var vendedorRef = u.data().vendedor;
            vendedorRef.get().then(v =>{
                var cobroVendedorRef = vendedorRef.collection("cobrosPendientesIngreso").doc(cobroRef.id);
                tr.set(cobroVendedorRef, {cobro: cobroRef, importe: +sumaImporte, fecha: dataObj.fechaCreacion});
                resolve(v);
            }).catch((error: any) => {
                reject(error);
            });
        });
    }

  getDeudasCliente(cliente: string): Promise<any> {
    return new Promise((resolve, reject) => {
        this.db.collection("ventas")
        .where('cliente', '==', cliente)
        .where('importeDeuda','>',0)
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