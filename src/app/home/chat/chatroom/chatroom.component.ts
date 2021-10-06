import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
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
  orderBy,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  updateDoc,
  getDocs,
  setDoc,
  addDoc,

} from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  console.log("chatroom chat res snapshot 1", snapshot)
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    console.log("chatroom chat res snapshot 2 ", childSnapshot)
      const item = childSnapshot;
      item.key = childSnapshot.id;
      returnArr.push(item);
  });
  
  console.log("returnARR", returnArr);
  return returnArr;
};

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent!: ElementRef;
  scrolltop = null;

  chatForm!: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users:any = [];
  chats:any = [];
  matcher = new MyErrorStateMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private afs: Firestore,
  ) {
    console.log("loading data");
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.nickname = user.displayName
    this.roomname = this.route.snapshot.params.roomname;

    collectionData(
      query(
        collection(this.afs, 'chats/' ) as CollectionReference,
        where('chat.roomname', '==', this.roomname), orderBy('chat.date', 'asc')
      ), { idField: 'id' }
    ).subscribe(resData => {
      console.log("loading data chats", resData);
      this.chats = [];
      this.chats = snapshotToArray(resData);
      console.log("loading data chats", resData);
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    })



    collectionData(
      query(
        collection(this.afs, 'roomusers/') as CollectionReference,
        where('newroomuser.roomname', '==', this.roomname)
      ), { idField: 'id' }
    ).subscribe(resData => {
      console.log("chatroom users lisr", resData)
      const roomusers = snapshotToArray(resData);
      this.users = roomusers.filter(x => x.newroomuser.status === 'online');
    });
  
   }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  async onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';

    await addDoc(collection(this.afs, 'chats/'), {chat});

    // const newMessage = doc(this.afs,'chats/' + this.roomname);
    // await setDoc(newMessage, {chat}, {merge: false}); 

    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }


  async exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    const newDate:any = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.date = newDate
    chat.message = `${this.nickname} leave the room`;
    chat.type = 'exit';

    await addDoc(collection(this.afs, 'chats/'), {chat});

    // const newMessage = doc(this.afs,'chats/' + this.roomname);
    // await setDoc(newMessage, {chat});


    collectionData(
      query(
        collection(this.afs, 'roomusers/') as CollectionReference<any>,
        where('newroomuser.roomname', '==', this.roomname)
      ), { idField: 'id' }
    ).pipe(take(1)).subscribe((async resData => {
      console.log("loading data 2");
      let roomuser = [];
      roomuser =  snapshotToArray(resData);
      const user = roomuser.find(x => x.newroomuser.nickname === this.nickname);
      if (user !== undefined) {
    
        const userRef = doc(this.afs,'roomusers/' + user.key)
        await setDoc(userRef, {
          newroomuser: { status: 'offline'}},{merge: true}
        );
      }
     }));

    this.router.navigate(['/chat']);
  }

}
