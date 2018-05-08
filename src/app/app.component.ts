import { Component } from "@angular/core";
import { UserService } from "apttus";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";

  constructor(private userService: UserService) {
    // this.userService.getCurrentUser().subscribe(u => console.log("user: ", u));
  }
}
