import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  Unsubscribe,
  Query,
  where,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  FieldPath,
  WhereFilterOp,
  orderBy,
  deleteDoc
} from '@angular/fire/firestore';
import {
  Auth,
  signOut,
  signInWithPopup,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
  OAuthProvider,
  linkWithPopup,
  unlink,
  updateEmail,
  updatePassword,
  User,
  reauthenticateWithPopup,
  authState,
  onAuthStateChanged
} from '@angular/fire/auth';
import {   QuerySnapshot,  getFirestore, startAt, endAt, limit} from '@firebase/firestore';
import { map, take } from 'rxjs/operators';
import * as $ from "jquery"
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MakeVideoCallModalComponent } from 'src/app/modals/make-video-call-modal/make-video-call-modal.component';
import { ReceiveVideoCallModalComponent } from 'src/app/modals/receive-video-call-modal/receive-video-call-modal.component';
import { CallService } from 'src/app/call.service';
import { getDatabase, ref, onValue, onDisconnect, set, get, child } from "firebase/database";




export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


export const snapshotToArray = (snapshot: any ) => {

  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {

      const item = childSnapshot;
      item.key = childSnapshot.id;
      returnArr.push(item);
  });

  return returnArr;
};

export const roomUsersSnapshotToArray = (snapshot: any ) => {

  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot;
      item.key = childSnapshot.id;
      returnArr.push(item);
  });

  console.log("returnARR", returnArr);

  return returnArr;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent!: ElementRef;
  scrolltop = null;

  videoCallInProgress = false;
  private peerId!: string;

  user$!: Observable<User | null | unknown>;

  nickname: string;
  displayedColumns: string[] = ['roomname'];
  rooms: any = [];
  isLoadingResults = true;

  profileData:any;
  currentUser:any;
  currentUserChats: any[] = [];

  searchValue: string = "";
  results!: any[];

  addContacts = true;
  chatOpened = false;
  sidePanelContactClassID:any;


  chatForm!: FormGroup;
  message = '';
  openedchats:any = [];
  openedChatUserData:any;
 
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private afs: Firestore,
    private auth: Auth,
    private callService: CallService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public dialog: MatDialog
    ) {
      //this.peerId = this.callService.initPeer();
      // Load current user details such as profile details and current conversations
      // which will be displayed on the left handside panel of the chat module
      this.user$ = authState(auth);
      this.user$.subscribe(async user => {
        if (user) {
          this.profileData = user;
          const userRef = doc( this.afs,`user/${this.profileData.uid}`);
          const docSnap = await getDoc(userRef);
          const docData = docSnap.data()
          this.currentUser= docData?.userData;

          collectionData(
            query(
              collection(this.afs, 'userchatsrooms/') as CollectionReference<any>,
              where('messageFor.uid', '==', this.profileData.uid),
              orderBy('messageFor.date', 'desc')
            ), { idField: 'id' }
          ).subscribe(resData => {
            const response = resData
            this.currentUserChats = [];
            
            response.forEach(async newResData => {
 
              const eachRes = newResData;
              this.currentUserChats.push(newResData)

              const db = getDatabase();
              const userPresenceRef = ref(db, 'users/' + newResData.messageWith.uid);

              await onValue(userPresenceRef, async (snapshot) => {
                const data = snapshot.val();             
                this.currentUserChats.forEach(x => {
                  x.messageWith.status = data.status
                })
                // Update Ui after user's change of status
                const index = this.currentUserChats.findIndex(x => x.id === newResData.id);
                console.log('chaning presence index', index);
                let element = document.getElementById('contact-status'+index);
                if (data.status === 'offline') {
                  element?.classList.remove("online")
                  element?.classList.add('offline');
                } else if (data.status === 'online') {
                  element?.classList.remove("offline")
                  element?.classList.add('online');
                }

                // Updating current user Contact list.
                // const currentUserChatRoomID = this.profileData.uid+newResData.messageWith.uid;
                // const currentMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+ currentUserChatRoomID);
                // await setDoc(currentMemberUserChatRoom, {
                //   messageWith:{
                //     status:data.status,
                //   }
                // }, {merge: true} 
                // );

                console.log('chaning presence 2',this.currentUserChats);
                console.log('chaning presence after adding a user',this.currentUserChats[0]);
              });
              //this.currentUserChats.push(eachRes)
            });
          })

          
        };
      })

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.nickname = user.displayName
      collectionData(
        query(
          collection(this.afs, 'rooms/') as CollectionReference,
          
        ), { idField: 'id' }
      ).subscribe(resData => {
        console.log("results", resData);
        this.rooms = [];
        this.rooms = snapshotToArray(resData);
        console.log("rooms", this.rooms);
        this.isLoadingResults =false;
      });
      
    }

  ngOnInit(): void {

    // Contriling the toggle button for the current user status on the side panel of the..
    // of the chat module

    $(".messages").animate({ scrollTop: $(document).height() }, "fast");

      $("#profile-img").click(function() {
        $("#status-options").toggleClass("active");
      });
      
      $(".expand-button").click(function() {
        $("#profile").toggleClass("expanded");
        $("#contacts").toggleClass("expanded");
      });
      
      $("#status-options ul li").click(function() {
        $("#profile-img").removeClass();
        $("#status-online").removeClass("active");
        $("#status-away").removeClass("active");
        $("#status-busy").removeClass("active");
        $("#status-offline").removeClass("active");
        $(this).addClass("active");
        
        if($("#status-online").hasClass("active")) {
          $("#profile-img").addClass("online");
        } else if ($("#status-away").hasClass("active")) {
          $("#profile-img").addClass("away");
        } else if ($("#status-busy").hasClass("active")) {
          $("#profile-img").addClass("busy");
        } else if ($("#status-offline").hasClass("active")) {
          $("#profile-img").addClass("offline");
        } else {
          $("#profile-img").removeClass();
        };
        
        $("#status-options").removeClass("active");
      });
    //////////////////////////////////////////////////////////////////

    // Initiating Form for the mesaging system
    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });
    //////////////////////////////////////////////////////////////////

    // Subscription for incoming calls
    // after call has been this section will open the modal responsible for..
    // handling incoming calls.

    this.user$.subscribe(async user => {
      this.profileData = user;
      if (user) {

        // Subscription: listeningg for incoming video calls
        collectionData(
          query(
            collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
            where('videoCallTo.uid', '==', this.profileData.uid),
            where('videoCallTo.callStatus', '==', 'calling')
          ), { idField: 'id' }
        ).subscribe(resData => {
          if (resData.length >= 1) {
            this.onReceivingCallModal(resData[0])
          } else {
            // There's currently no incoming calls display nothing.
            const dialogRef = this.dialog.closeAll();
          }
        });

        // Subscription listening for the call status: it gets answered
        // if the call was accepted it would initiate the call procedure.
        collectionData(
          query(
            collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
            where('videoCallTo.uid', '==', this.profileData.uid),
            where('videoCallTo.callStatus', '==', 'call accepted')
          ), { idField: 'id' }
        ).subscribe(resData => {
          if (resData.length >= 1) {
            this.videoCallInProgress = true;
          } 
        })

      };

    });

  }

  openAddContacts() {

    this.addContacts =true;
 
  }
  openChats() {
    this.addContacts = false;
  }


  async openChatsAfterInitiatingNewChat() {

     
    const userData = this.currentUserChats[0]

    this.chatOpened = true;

    this.openedChatUserData = userData;
    console.log("the clicked contact user details", this.openedChatUserData)

    // Highlights the selected contact on left handside/ contacts panel.
    const clickedContactElementID = 'contact0'
   
    if (this.sidePanelContactClassID === undefined) {
      let element = document.getElementById(clickedContactElementID);
      element?.classList.add('active');
      this.sidePanelContactClassID = clickedContactElementID;
    } else {
      let element = document.getElementById(this.sidePanelContactClassID);
      element?.classList.remove("active")
      this.sidePanelContactClassID = clickedContactElementID;
      let newlySelectelement = document.getElementById(this.sidePanelContactClassID);
      newlySelectelement?.classList.add('active');
    }

    
    
    //open chats box and close AddContacts box
    this.addContacts = false;

    // Conversation ID for each the memeber of the conversation
    // this.profileData = current user UID
    // this.userData = the other member of the conversation

     const convoID1 =  this.profileData.uid+userData.messageWith.uid
     const convoID2 =  userData.messageWith.uid+this.profileData.uid

     collectionData(
      query(
        collection(this.afs, 'userchats/' ) as CollectionReference,
        where('chat.conversationID', 'array-contains-any', [convoID1, convoID2]), 
        orderBy('chat.date', 'asc')
      ), { idField: 'id' }
    ).subscribe(resData => {
      console.log("loading data chats", resData);
      this.openedchats = [];
      this.openedchats = resData
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    });


    // Update Each user contact detail status // readMessages // noUnreadMessages.

    // CUrrent User
    const currentUserChatRoomID = this.profileData.uid+this.openedChatUserData.messageWith.uid;
    const currentMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+ currentUserChatRoomID);
    
    await setDoc(currentMemberUserChatRoom, {
      messageFor:{
        data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        readMessage:'true',
        unReadMessage:0
      },
      // messageWith:{
      //   data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      //   readMessage:'',
      // }
    }, {merge: true} 
    );

    // Other Member
    const userChatRoomID = this.openedChatUserData.messageWith.uid+this.profileData.uid;
    console.log('the current user, userchatroom id 1', this.openedChatUserData )

    const otherMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+userChatRoomID);
    await setDoc(otherMemberUserChatRoom, {
      // messageFor:{
      //  date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      //  readMessage:'false',
      //  unReadMessage: 0
      // },
      messageWith:{
        date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        readMessage:'true',
        unReadMessage:0
      }
    }, {merge: true} 
    );





  }


  async onStartNewMessage(sendToUserData:any) {

    console.log("just added a new message", sendToUserData);

    collectionData(
      query(
        collection(this.afs, 'userchatsrooms/') as CollectionReference<any>,
        where('id', '==', this.profileData.uid+sendToUserData.uid)
      ), { idField: 'id' }
    ).pipe(take(1)).subscribe(async resData => {
      if (resData.length >=1) {
        // show notification that you've already added this particular from to your 
        // conversation
      } else {

        const newDate: any = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
        const messageFor = {displayName:'', uid:'', date:'', type:'', createdMessage:'', photoURL:'', message:'',readMessage:''}
        messageFor.displayName = this.profileData.displayName;
        messageFor.uid = this.profileData.uid;
        messageFor.date = newDate;
        messageFor.type = 'newMessageCreated';
        messageFor.createdMessage = 'true';
        messageFor.photoURL = this.profileData.photoURL;
        messageFor.message = '';
        messageFor.readMessage = ''
    
        const messageWith = {displayName:'', uid:'', date:'', type:'', createdMessage:'', photoURL:'', message:'', readMessage:''}
        messageWith.displayName = sendToUserData.displayName;
        messageWith.uid = sendToUserData.uid;
        messageWith.date = newDate;
        messageWith.type = 'newMessageCreated';
        messageWith.createdMessage = 'false';
        messageWith.photoURL = sendToUserData.photoURL;
        messageWith.message = '';
        messageWith.readMessage
    
        const userChatRoomID = this.profileData.uid+sendToUserData.uid;
    
        //await addDoc(collection(this.afs, 'userchatsrooms/'+userChatRoomID), {messageFor,messageWith});
        const newUserChatRoom = doc(this.afs, 'userchatsrooms/'+userChatRoomID);
        await setDoc(newUserChatRoom,  {messageFor,messageWith} );
    
        this.onStartNewMessageOtherMember(sendToUserData);


      };
    });

    
    setTimeout(() => this.openChatsAfterInitiatingNewChat(), 1000);

  }

  async onStartNewMessageOtherMember(otherMember:any) {
    const newDate: any = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const messageFor = {displayName:'', uid:'', date:'', type:'', createdMessage:'', photoURL:'', message:'',readMessage:'', unReadMessage:0}
    messageFor.displayName = otherMember.displayName;
    messageFor.uid = otherMember.uid;
    messageFor.date = newDate;
    messageFor.type = 'newMessageCreated';
    messageFor.createdMessage = 'false';
    messageFor.photoURL = otherMember.photoURL;
    messageFor.message = '';
    messageFor.readMessage='';
    messageFor.unReadMessage =0;

    const messageWith = {displayName:'', uid:'', date:'', type:'', createdMessage:'', photoURL:'', message:'', readMessage:'',unReadMessage: 0, status:''}
    messageWith.displayName = this.profileData.displayName;
    messageWith.uid = this.profileData.uid;
    messageWith.date = newDate;
    messageWith.type = 'newMessageCreated';
    messageWith.createdMessage = 'true';
    messageWith.photoURL = this.profileData.photoURL;
    messageWith.message = "";
    messageWith.readMessage= "";
    messageWith.unReadMessage= 0;
    messageWith.status = '';


    const userChatRoomID = otherMember.uid+this.profileData.uid;

    //await addDoc(collection(this.afs, 'userchatsrooms/'+userChatRoomID), {messageFor,messageWith});
    const newUserChatRoom = doc(this.afs, 'userchatsrooms/'+userChatRoomID);
    await setDoc(newUserChatRoom,  {messageFor,messageWith} );
  }


  // Adds the users information for thats chat thats opened to the variable openedCHatuserData
  // which will be used to send a message
  async onAddOpenedUserChat(userData:any, event:Event) {
    
    this.chatOpened = true;

    this.openedChatUserData = userData;
    console.log("the clicked contact user details", this.openedChatUserData)

    // Highlights the selected contact on left handside/ contacts panel.
    const clickedContactElementID = (<HTMLElement>event.currentTarget).id
   
    if (this.sidePanelContactClassID === undefined) {
      let element = document.getElementById(clickedContactElementID);
      element?.classList.add('active');
      this.sidePanelContactClassID = clickedContactElementID;
    } else {
      let element = document.getElementById(this.sidePanelContactClassID);
      element?.classList.remove("active")
      this.sidePanelContactClassID = clickedContactElementID;
      let newlySelectelement = document.getElementById(this.sidePanelContactClassID);
      newlySelectelement?.classList.add('active');
    }

    
    
    //open chats box and close AddContacts box
    this.addContacts = false;

    // Conversation ID for each the memeber of the conversation
    // this.profileData = current user UID
    // this.userData = the other member of the conversation

     const convoID1 =  this.profileData.uid+userData.messageWith.uid
     const convoID2 =  userData.messageWith.uid+this.profileData.uid

     collectionData(
      query(
        collection(this.afs, 'userchats/' ) as CollectionReference,
        where('chat.conversationID', 'array-contains-any', [convoID1, convoID2]), 
        orderBy('chat.date', 'asc')
      ), { idField: 'id' }
    ).subscribe(resData => {
      console.log("loading data chats", resData);
      this.openedchats = [];
      this.openedchats = resData
      setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    });


    // Update Each user contact detail status // readMessages // noUnreadMessages.

    // CUrrent User
    const currentUserChatRoomID = this.profileData.uid+this.openedChatUserData.messageWith.uid;
    const currentMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+ currentUserChatRoomID);
    
    await setDoc(currentMemberUserChatRoom, {
      messageFor:{
        data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        readMessage:'true',
        unReadMessage:0
      },
      // messageWith:{
      //   data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      //   readMessage:'',
      // }
    }, {merge: true} 
    );

    // Other Member
    const userChatRoomID = this.openedChatUserData.messageWith.uid+this.profileData.uid;
    console.log('the current user, userchatroom id 1', this.openedChatUserData )

    const otherMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+userChatRoomID);
    await setDoc(otherMemberUserChatRoom, {
      // messageFor:{
      //  date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      //  readMessage:'false',
      //  unReadMessage: 0
      // },
      messageWith:{
        date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        readMessage:'true',
        unReadMessage:0
      }
    }, {merge: true} 
    );


    // Lastly Update the contacts again
    //this.onUpdateContacts()
  }


  async onUpdateContacts() {
    // Update Each user contact detail status // readMessages // noUnreadMessages.

    // CUrrent User
    const currentUserChatRoomID = this.profileData.uid+this.openedChatUserData.messageWith.uid;
    const currentMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+ currentUserChatRoomID);
    
    await setDoc(currentMemberUserChatRoom, {
      messageFor:{
        data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        readMessage:'true',
        unReadMessage:0
      },
      // messageWith:{
      //   data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      //   readMessage:'',
      // }
    }, {merge: true} 
    );

    // Other Member
    const userChatRoomID = this.openedChatUserData.messageWith.uid+this.profileData.uid;
    console.log('the current user, userchatroom id 1', this.openedChatUserData )

    const otherMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+userChatRoomID);
    await setDoc(otherMemberUserChatRoom, {
      // messageFor:{
      //  date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      //  readMessage:'false',
      //  unReadMessage: 0
      // },
      messageWith:{
        date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        readMessage:'true',
        unReadMessage:0
      }
    }, {merge: true} 
    );
  }

  


  // Send a message that contains an array of both members which is used later for loading chats message,
  // for both members of the chat.
  async onSendMessage(form:any) {
    const chat = form;
    chat.chatMembers = [this.profileData.uid, this.openedChatUserData.messageWith.uid]
    chat.displayName = this.profileData.displayName;
    chat.uid = this.profileData.uid
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    // conversation ID's helps with querying the database for a particular chat conversation.
    const convoID1 = this.profileData.uid + this.openedChatUserData.messageWith.uid 
    const convoID2 = this.openedChatUserData.messageWith.uid + this.profileData.uid
    chat.conversationID = [convoID1, convoID2]

    await addDoc(collection(this.afs, 'userchats/'), {chat});

    this.chatForm = this.formBuilder.group({
      'message' : [null, Validators.required]
    });

    // Update user chat rooms/ or contact cards.
    // This section updates each members contact cards on left left panel,
    // displays messaging activity.

    // Increase number of unReadMessages
    let unReadMessages;
    const ChatRoomID = this.openedChatUserData.messageWith.uid+this.profileData.uid;

    const UserChatRoom = doc(this.afs, 'userchatsrooms/'+ChatRoomID);
    const docSnap = await getDoc(UserChatRoom).then(resData => {
      const retrData:any = resData.data();
      unReadMessages = retrData.messageFor.unReadMessage
    });
    
   if (unReadMessages != 0) {
      const noMessages: any = unReadMessages 
      const addUpMessages = noMessages + 1
      unReadMessages = addUpMessages
   } else {
      unReadMessages =  1
   }

    // The other member of the conversation whom the message is being sent to.
    const userChatRoomID = this.openedChatUserData.messageWith.uid+this.profileData.uid;
    console.log("urrrend messages", unReadMessages)

    const otherMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+userChatRoomID);
    await setDoc(otherMemberUserChatRoom, {
      messageFor:{
       date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
       message:chat.message,
       readMessage:'false',
       unReadMessage:unReadMessages
      },
      messageWith:{
        date: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
        message:chat.message,
        readMessage:'true'
      }
    }, {merge: true} 
    );
            
    
   //current member whom is send the message
   const currentUserChatRoomID = this.profileData.uid+this.openedChatUserData.messageWith.uid;
   const currentMemberUserChatRoom = doc(this.afs, 'userchatsrooms/'+ currentUserChatRoomID);
   
   await setDoc(currentMemberUserChatRoom, {
     messageFor:{
      data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
      message:chat.message,
      readMessage:'true'
     },
     messageWith:{
       data: this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'),
       message:chat.message,
       readMessage:'false',
       unReadMessage:unReadMessages
     }
   }, {merge: true} 
   );

  }





  async enterChatRoom(roomname: string) {
    const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    chat.roomname = roomname;
    chat.nickname = this.nickname;
    const newDate: any = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.date = newDate
    chat.message = `${this.nickname} enter the room`;
    chat.type = 'join';

    await addDoc(collection(this.afs, 'chats/'), {chat});
  

    collectionData(
      query(
        collection(this.afs, 'roomusers/') as CollectionReference<any>,
        where('newroomuser.roomname', '==', roomname)
      ), { idField: 'id' }
    ).pipe(take(1)).subscribe((async resData => {
      let roomuser = [];
      roomuser = roomUsersSnapshotToArray(resData);
      const user = roomuser.find(x => x.newroomuser.nickname === this.nickname);

      if ( user != undefined) {
        const userRef = doc(this.afs,'roomusers/' + user.key);

        await setDoc(userRef, {
          newroomuser: { status: 'online'}},{merge: true}
        );

      } else {
        const newroomuser = { roomname: '', nickname: '', status: '' };
        newroomuser.roomname = roomname;
        newroomuser.nickname = this.nickname;
        newroomuser.status = 'online';
 
        const newRoomUser = await addDoc(collection(this.afs, 'roomusers/'), {
          newroomuser
         });
        
      }
     }));
    this.router.navigate(['/chatroom', roomname]);
  }


  ///// User search/ Add existing user from the database

  onSearchUsers() {
    console.log('search length', this.searchValue.length)
    this.results = []
    if (this.searchValue.length >= 1) {
      collectionData( query(
          collection(this.afs, 'user/'),
          where('userData.displayName', '>=', this.searchValue), 
          where('userData.displayName', '<=', this.searchValue+"\uf8ff"),
          limit(10)
        ), { idField: 'id' }
      ).subscribe(resData => {
        console.log("Searched users data", resData);
        this.results = []
        this.results = resData
        console.log("searched element", this.results[0].userData)
      });
    }
  }



  showNotification(from:any, align:any){

    const color = Math.floor((Math.random() * 5) + 1);

    switch(color){
      case 1:
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-info alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 2:
      this.toastr.success('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-success alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 3:
      this.toastr.warning('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-warning alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 4:
      this.toastr.error('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         enableHtml: true,
         closeButton: true,
         toastClass: "alert alert-danger alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
       break;
       case 5:
       this.toastr.show('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-primary alert-with-icon",
          positionClass: 'toast-' + from + '-' +  align
        });
      break;
      default:
      break;
    }
}



onReceivingCallModal(incomingCallData:any) {
  const dialogRef = this.dialog.open(ReceiveVideoCallModalComponent , {
    width: '420px',
    data: {'userData': incomingCallData}
  });

  dialogRef.afterClosed().subscribe(async result => {
    //await deleteDoc(doc(this.afs, 'in-progress-video-call/'+ this.profileData.uid));
    console.log('The dialog was closed');
  });
}


showNotificationUserCurrentlyInCall(from:any, align:any){
  this.toastr.info('<span class="tim-icons icon-alert-circle-exc" [data-notify]="icon"></span> Currently on another call </b> - give it a few minutes and try again.', '', {
    disableTimeOut: true,
    closeButton: true,
    enableHtml: true,
    toastClass: "alert alert-warning alert-with-icon",
    positionClass: 'toast-' + from + '-' +  align
  }); 
}



openMakingVideoCallModal(): void {
  collectionData(
    query(
      collection(this.afs, 'in-progress-video-call/') as CollectionReference<any>,
      where('videoCallFrom.membersUID', 'array-contains-any', [this.openedChatUserData.messageWith.uid]),
    ), { idField: 'id' }
  ).pipe(take(1)).subscribe(resData => {
    if (resData.length >= 1) {
      
      this.showNotificationUserCurrentlyInCall('top', 'center');

    } else {

      const dialogRef = this.dialog.open(MakeVideoCallModalComponent , {
        width: '430px',
        data: {'userData': this.openedChatUserData}
      });
    
      this.onMakeVideoCall()
    
      dialogRef.afterClosed().subscribe(async result => {
        if (result.callStatus == 'call denied') {
          // Delete call data from the database after call being denied.
          await deleteDoc(doc(this.afs, 'in-progress-video-call/'+ this.profileData.uid));
    
        } else if (result.callStatus == 'call accepted'){
          // If call was accepted display the video component and hide the chat component.
          this.videoCallInProgress = true;
        }
      });

    };
  });

}




  async onMakeVideoCall() {

  const videoCallFrom = {uid:'', displayName:'', callID:'', photoURL:'', callStatus:'', membersUID: ['']};
  videoCallFrom.uid = this.profileData.uid;
  videoCallFrom.displayName = this.profileData.displayName;
  videoCallFrom.photoURL = this.profileData.photoURL;
  videoCallFrom.callID = '';
  videoCallFrom.callStatus = 'calling';
  videoCallFrom.membersUID = [this.profileData.uid, this.openedChatUserData.messageWith.uid]

  const videoCallTo = {uid:'', displayName:'', callID: '',photoURL:'',callStatus:'', membersUID: ['']}
  videoCallTo.uid = this.openedChatUserData.messageWith.uid;
  videoCallTo.displayName = this.openedChatUserData.messageWith.displayName;
  videoCallTo.photoURL = this.openedChatUserData.messageWith.photoURL;
  videoCallTo.callID = '';
  videoCallTo.callStatus = 'calling';
  videoCallFrom.membersUID = [this.openedChatUserData.messageWith.uid, this.profileData.uid]

  const inProgressVideoCallRoom = doc(this.afs, 'in-progress-video-call/'+ this.profileData.uid);
  await setDoc(inProgressVideoCallRoom ,  {videoCallFrom,videoCallTo});
}

// Close video call component after ending the call.
onVideoCallProgress(inProgress:boolean){
  this.videoCallInProgress = inProgress;
}


    
  
}
