import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { User } from '../Clases/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null | undefined>;
  isLoggedIn = false;

  constructor(public firebaseAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user = this.firebaseAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          console.log("Constructor del auth atento a los cambios supuestamente");
          console.log(this.afs.doc<User>(`users/${user.uid}`).valueChanges());
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async SignIn(email: string, password: string) {
    try {
      const { user } = await this.firebaseAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }
    // await this.firebaseAuth.signInWithEmailAndPassword(email, password).then(res=>{
    //   this.isLoggedIn = true;
    //   localStorage.setItem('user', JSON.stringify(res.user))
    // })
  }

  async SignInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const { user } = await this.firebaseAuth.signInWithPopup(provider);
      console.log('GoooooooogleLoginDevuelve: ', user);
      return user;
    } catch (error) {
      console.log('ERROR en Autenticacion con google: ', error);
      return error;
    }
  }

  async SignUp(email: string, password: string) {
    try {
      const { user } = await this.firebaseAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(user))
      return user;
    } catch (error) {
      console.log(error);
      return error;
    }

  }

  async LogOut() {
    await this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('usuario');
  }

  async sendVerificationEmail(): Promise<void> {
    console.log('entro a envio de email ' + (await this.firebaseAuth.currentUser)?.email);
    return (await this.firebaseAuth.currentUser)?.sendEmailVerification();
  }


  getAuth() {
    return this.firebaseAuth.currentUser;
  }

  public getAuthState() {
    return this.firebaseAuth.authState;
  }

  public async verificarPerfilAdmin(): Promise<boolean> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.uid) {
      const userDoc = await this.afs.doc<User>(`users/${user.uid}`).get().toPromise();
      const userData = userDoc?.data();
      if (userData && userData.role) {
        const role = userData.role;
        console.log('verificarPerfilAdmin.userData.role: ',userData.role)
        if (role === 'admin') {
          return true;
        }
      }
    }
    return false;
  }
}
