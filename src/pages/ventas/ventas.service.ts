import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class VentasService {

    private db: any;

  constructor() { 
    this.db = firebase.firestore();
  }

  getProductos(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.db.collection("productos")
            .orderBy("nombre")
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

  getLineas(ventaId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        this.db.collection("ventas").doc(ventaId).collection("lineas")
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

  deleteDocument(collectionName: string, docID: string): Promise<any> {
  return new Promise((resolve, reject) => {
      this.db
          .collection(collectionName)
          .doc(docID)
          .delete()
          .then((obj: any) => {
              resolve(obj);
          })
          .catch((error: any) => {
              reject(error);
          });
      });
  }

  addVenta(dataObj: any, lineas: any): Promise<any> {
    
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaCreacion = firebase.firestore.Timestamp.now();
    dataObj.importeDeuda = dataObj.total;

    return new Promise((resolve, reject) => {
        var clienteRef = this.db.collection("clientes").doc(dataObj.cliente);
        clienteRef.get().then(c=>{
            dataObj.nombre = c.data().nombre;
            dataObj.direccion = c.data().direccion;

            var batch = this.db.batch();
            var ventaRef = this.db.collection("ventas").doc();
            batch.set(ventaRef, dataObj);
            var counter = lineas.length;
            lineas.forEach(l => {
                l.precio = +l.precio;
                l.cantidad = +l.cantidad;
                var lineaRef = this.db.collection("ventas").doc(ventaRef.id).collection("lineas").doc();
                batch.set(lineaRef, l);
                var productoRef = this.db.collection("productos").doc(l.producto);
                productoRef.get().then(prod => {
                    var p = prod.data();
                    if (!p.stock) {
                        p.stock = 0;
                    }
                    if (!p.unidadesVendidas) {
                        p.unidadesVendidas = 0;
                    }
                    p.stock -= l.cantidad;
                    p.unidadesVendidas += l.cantidad;
                    batch.set(productoRef, {stock: p.stock, unidadesVendidas: p.unidadesVendidas}, {merge: true});
                    counter--;
                    if (counter === 0) {
                        batch.commit()
                        .then((obj: any) => {
                            resolve(obj);
                        })
                        .catch((error: any) => {
                            reject(error);
                        });                                    
                    }
                })
            });
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