import { Usuario } from './../models/usuario.model';
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth,
              private firestore: AngularFirestore) {}

  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      if (fuser){
        const {uid, email} = fuser;
        console.log({uid, email});
      }else{
        console.log(fuser);
      }
    })
  }

  crearUsuario(nombre: string, correo: string, password: string): Promise<any> {
    this.showMyLoading();
    return this.auth
      .createUserWithEmailAndPassword(correo, password)
      .then((fbUser) => {

        const newUser = new Usuario(fbUser.user.uid, nombre, fbUser.user.email);
        

        return this.firestore
        .doc(`${fbUser.user.uid}/usuario`)
        .set({...newUser}).then(()=>Swal.close());
      })
      .catch((err) => {
        this.showMyError(err);
        throw(err);
      });
  }

  loginUsuario(email: string, password: string): Promise<any> {
    this.showMyLoading();
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        Swal.close();
        return response;
      })
      .catch((err) => {
        this.showMyError(err);
        throw(err);
      });
  }

  logout(): Promise<void> {
    this.showMyLoading();
    return this.auth
      .signOut()
      .then((response) => {
        Swal.close();
        return response;
      })
      .catch((err) => {
        this.showMyError(err);
        throw(err);
      })
  }

  isAuth(){
    return this.auth.authState.pipe(map ( fbUser => fbUser != null));
  }

  showMyLoading(): any {
    Swal.fire({
      title: 'Espere por favor',
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  }

  showMyError(err): any {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
    });
  }
}
