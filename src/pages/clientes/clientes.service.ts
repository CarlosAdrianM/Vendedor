import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
//import 'firebase/firestore';

@Injectable()
export class ClientesService {

    private db: any;

  constructor() { 
    this.db = firebase.firestore();
  }

  getAllClientes(provincia: any, municipio: any, distrito: any): Promise<any> {
      var refDistrito = this.db.collection("provincias").doc(provincia.$key).collection("municipios").doc(municipio.$key).collection("distritos").doc(distrito.$key);
  return new Promise((resolve, reject) => {
      this.db.collection("clientes")
        //.where('provincia','==', provincia.$key)
        .where('distrito', '==', refDistrito)
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
                if (obj1.ultimaVisita == null) {
                    obj1.ultimaVisita = obj1.fechaCreacion;
                }
                if (obj2.ultimaVisita == null) {
                    obj2.ultimaVisita = obj2.fechaCreacion;
                }

                if (obj1.ultimaVisita > obj2.ultimaVisita) {
                    return 1;
                }
            
                if (obj1.ultimaVisita < obj2.ultimaVisita) {
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

  addCliente(dataObj: any, provincia:any, municipio:any, distrito: any, vendedor: string): Promise<any> {
    
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaCreacion = firebase.firestore.Timestamp.now();

    dataObj.provincia = this.db.collection("provincias").doc(provincia.$key);
    dataObj.municipio = dataObj.provincia.collection("municipios").doc(municipio.$key);
    dataObj.distrito = dataObj.municipio.collection("distritos").doc(distrito.$key);
    dataObj.vendedor = this.db.collection("vendedores").doc(vendedor);
  
    var uidUsuario = firebase.auth().currentUser.uid;
    var usuarioRef = this.db.collection("usuarios").doc(uidUsuario);
    usuarioRef.set({
        ultimaProvincia: provincia.$key,
        ultimoMunicipio: municipio.$key,
        ultimoDistrito: distrito.$key
    },{merge:true});
    return new Promise((resolve, reject) => {
      this.db.collection("clientes").add(dataObj)
          .then((obj: any) => {
              resolve(obj);
          })
          .catch((error: any) => {
              reject(error);
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

  updateDocument(collectionName: string, docID: string, dataObj: any, provincia:any, municipio:any, distrito: any, vendedor: string): Promise<any> {
    dataObj.usuario = firebase.auth().currentUser.uid;
    dataObj.fechaModificacion = firebase.firestore.Timestamp.now();
    dataObj.provincia = this.db.collection("provincias").doc(provincia.$key);
    dataObj.municipio = dataObj.provincia.collection("municipios").doc(municipio.$key);
    dataObj.distrito = dataObj.municipio.collection("distritos").doc(distrito.$key);
    dataObj.vendedor = this.db.collection("vendedores").doc(vendedor);
  
    var uidUsuario = firebase.auth().currentUser.uid;
    var usuarioRef = this.db.collection("usuarios").doc(uidUsuario);
    usuarioRef.set({
        ultimaProvincia: provincia.$key,
        ultimoMunicipio: municipio.$key,
        ultimoDistrito: distrito.$key
    },{merge:true});

      return new Promise((resolve, reject) => {
          this.db
              .collection(collectionName)
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
}