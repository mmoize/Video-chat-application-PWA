import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  deleteObject,
  uploadBytes,
  uploadString,
  uploadBytesResumable,
  percentage,
  getDownloadURL,
} from '@angular/fire/storage';
import { getDocs, QuerySnapshot, updateDoc } from '@firebase/firestore';
import { orderByChild } from '@firebase/database';


export const snapshotToArray = (snapshot: any ) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  nickname: string;
  displayedColumns: string[] = ['roomname'];
  rooms: any = [];
  isLoadingResults = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private afs: Firestore,
    public datepipe: DatePipe) {

      const user = JSON.parse(localStorage.getItem('user') || '{}');

      this.nickname = user.displayName

      docData(doc(this.afs, 'rooms/')).subscribe(resData => {
        this.rooms = [];
        this.rooms = snapshotToArray(resData);
        this.isLoadingResults =false;
      });
     }

  ngOnInit(): void {
  }





  enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    const newDate: any = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.date = newDate
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';
    const newMessages: DocumentData = doc(this.afs, 'chats/');
    newMessages.set(chat)

    


    const docRef = getDocs(collection(this.afs, 'rooomusers'));
    docRef.then(async resData => {
      let roomuser = [];
      roomuser = snapshotToArray(resData);
      const user = roomuser.find(x => x.nickname);
      if ( user !== undefined) {
        const userRef = doc(this.afs,'roomusers/' + user.key)
        await updateDoc(userRef, {
          status: 'online'
        });
      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
        const newRoomUser: DocumentData =  doc(collection(this.afs, 'roomusers/'));
        newRoomUser.set(newroomuser)
      }
    });
    this.router.navigate(['/chatroom', roomname]);

  }
    
  
}
