import { Routes } from "@angular/router";

import { SignupComponent } from "../authentication/signup/signup.component";
import { AddroomComponent } from "./chat/addroom/addroom.component";
import { ChatComponent } from "./chat/chat.component";
import { ChatroomComponent } from "./chat/chatroom/chatroom.component";
import { UpdateProfileComponent } from "./chat/update-profile/update-profile.component";
import { HomeComponent } from "./home.component";
import { ProfileComponent } from "./profile/profile.component";
import { VideoComponent } from "./video/video.component";




export const HomeRoutes: Routes = [
    { path: "video", component: VideoComponent},
    { path: "chat", component: ChatComponent },
    { path: "addroom", component: AddroomComponent },
    { path: "chatroom/:roomname", component: ChatroomComponent },
    { path: "profileupdate", component: UpdateProfileComponent },
    { path: "profile", component: ProfileComponent },
    
];