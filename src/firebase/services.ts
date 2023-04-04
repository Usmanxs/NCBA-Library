import {db} from "./firebase.config"
import { collection,
    getDocs,
    getDoc,
    addDoc,  
    updateDoc,
    deleteDoc,
    doc
 } from "firebase/firestore"


 const bookCollectionRef = collection(db,"books")
 class BookCollection{
    addbooks= (newbook:any)=>{
        return addDoc(bookCollectionRef,newbook)
    };
    updatebooks= (id:any,updatebook:any)=>{
        const bookdoc =  doc(db,"books",id);
        return updateDoc(bookdoc,updatebook);
    };
    deletebooks= (id:any)=>{
        const bookdoc =  doc(db,"books",id);
        return deleteDoc(bookdoc);
    };
    getallbooks = ()=>{
        return getDocs(bookCollectionRef);
    };
    getbooks = (id:any)=>{
        const bookdoc = doc(db,"books",id);
        return getDoc(bookdoc);
    };
 }
