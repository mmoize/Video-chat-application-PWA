import { Routes } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { HomeComponent } from "./home.component";




export const HomeRoutes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "chat", component: ChatComponent },
    
];