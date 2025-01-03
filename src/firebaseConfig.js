// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCAyIkD4DKrHbVWmcb1qINhECJE5nWR_6E", // Copia la clave de API web
    authDomain: "barber-finances.firebaseapp.com", // Usa el formato ID_DEL_PROYECTO.firebaseapp.com
    projectId: "barber-finances", // ID del proyecto
    storageBucket: "barber-finances.appspot.com", // Usa el formato ID_DEL_PROYECTO.appspot.com
    messagingSenderId: "980348298749", // Número del proyecto
    appId: "project-980348298749", // Lo puedes obtener de la pestaña "Cuentas de servicio"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
