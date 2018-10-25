import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class VisitasService {

    private db: any;

  constructor() { 
    this.db = firebase.firestore();
  }

  getVisitasCliente(cliente: string): Promise<any> {
      //var refCliente = this.db.collection("clientes").doc(cliente);
  return new Promise((resolve, reject) => {
      this.db.collection("visitas")
        //.where('provincia','==', provincia.$key)
        .where('cliente', '==', cliente)
        .limit(20)
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

  getVisitasVendedorFecha(vendedor: any, fecha: string): Promise<any> {
      var fechaInicial: Date = new Date(fecha);
      var fechaFinal: Date = new Date(fecha);
      fechaFinal.setDate(fechaInicial.getDate());
      fechaInicial.setDate(fechaInicial.getDate()-1);
      var coleccionClientes = this.db.collection("clientes");
    return new Promise((resolve, reject) => {
        this.db.collection("visitas")
        .where('vendedor', '==', vendedor.id)
        .where('fecha', '>', fechaInicial)
        .where('fecha', '<', fechaFinal)
        .get()
        .then((querySnapshot) => {
            let arr = [];
            var counter = querySnapshot.size;
            if (counter === 0) {
                this.finalizarGetVisitasVendedorFecha(arr, resolve);
                //return;
            }

            var self = this;

            querySnapshot.forEach(function (doc) {
                var obj = doc.data();
                obj.$key = doc.id
                coleccionClientes.doc(obj.cliente).get().then((clienteDoc)=>{
                    var clienteEntero = clienteDoc.data()
                    obj.clienteNombre = clienteEntero ? clienteEntero.nombre : "";
                    obj.clienteDireccion = clienteEntero ? clienteEntero.direccion : "";
                    console.log(obj)
                    arr.push(obj);
                    counter--;
                    if (counter === 0) {
                        self.finalizarGetVisitasVendedorFecha(arr, resolve);
                    }
                });
            });
                
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }

    finalizarGetVisitasVendedorFecha(arr, resolve) {
    
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

  /*
  addVisita_old(dataObj: any): Promise<any> {
    
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaCreacion = firebase.firestore.Timestamp.now();

    return new Promise((resolve, reject) => {
      this.db.collection("visitas").add(dataObj)
          .then((obj: any) => {
              resolve(obj);
          })
          .catch((error: any) => {
              reject(error);
          });
      });
  }
  */

  
  addVisita(dataObj: any): Promise<any> {
    
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaCreacion = firebase.firestore.Timestamp.now();
    
    return new Promise((resolve, reject) => {
        var batch = this.db.batch();
        var visitaRef = this.db.collection("visitas").doc();
        var clienteRef = this.db.collection("clientes").doc(dataObj.cliente);
        clienteRef.get().then((c)=>{
            batch.set(clienteRef, {ultimaVisita: dataObj.fechaCreacion},{merge:true});
            batch.set(visitaRef, dataObj);
            batch.commit()
            .then((obj: any) => {
                resolve(obj);
            })
            .catch((error: any) => {
                reject(error);
            });    
        });
    });
  }
 

  setDocument(collectionName: string, dataObj: any, docID: string): Promise<any> {
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaCreacion = firebase.firestore.Timestamp.now();
  
    return new Promise((resolve, reject) => {
      this.db.collection(collectionName).doc(docID).set(dataObj)
          .then((obj: any) => {
              resolve(obj);
          })
          .catch((error: any) => {
              reject(error);
          });
      });
  }

  updateDocument(docID: string, dataObj: any): Promise<any> {
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaModificacion = firebase.firestore.Timestamp.now();
    
      return new Promise((resolve, reject) => {
          this.db
              .collection("visitas")
              .doc(docID)
              .update(dataObj)
              .then((obj: any) => {
                  resolve(obj);
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