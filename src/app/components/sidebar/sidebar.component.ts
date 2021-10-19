import { Component, OnInit } from '@angular/core';



declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/chat",
    title: "Chats",
    icon: "icon-chat-33",
    class: ""
  },
  {
    path: "/profile",
    title: "Profile",
    icon: "icon-single-02",
    class: ""
  },
  {
    path: "/createroom",
    title: "Create Room",
    icon: "icon-app",
    class: "" },
  {
    path: "/addfriend",
    title: "Add Friend",
    icon: "icon-support-17",
    class: ""
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems!: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

}
