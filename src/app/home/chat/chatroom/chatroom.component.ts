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
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  updateDoc,

} from '@angular/fire/firestore';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.nickname = user.displayName
    this.roomname = this.route.snapshot.params.roomname;


    docData(doc(this.afs, 'chats/')).subscribe(resData => {
      this.chats = [];
      this.chats = snapshotToArray(resData);
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);

    });

    const ref: DocumentData = doc(this.afs,'roomusers/');

    ref.orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.users = roomusers.filter(x => x.status === 'online');
    });

   }

  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage: DocumentData = doc(this.afs,'chats/');
    newMessage.set(chat);
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
  }


  exitChat() {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    const newDate:any = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.date = newDate
    chat.message = `${this.nickname} leave the room`;
    chat.type = 'exit';
    const newMessage: DocumentData = doc(this.afs,'chats/');
    newMessage.set(chat);


    const ref: DocumentData = doc(this.afs,'roomusers/');

    ref.orderByChild('roomname').equalTo(this.roomname).on('value', async (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        
        const userRef = doc(this.afs,'roomusers/' + user.key)
        await updateDoc(userRef, {
          status: 'offline'
        });
      }
    });

    this.router.navigate(['/roomlist']);
  }

}
