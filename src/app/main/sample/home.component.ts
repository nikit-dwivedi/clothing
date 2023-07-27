import { AdminService } from "app/services/admin.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private adminService: AdminService) {}

  public contentHeader: object;

  public customerCount: Number;
  public saleCount: Number;
  public revenueCount: Number;
  public pendingAmount: Number;

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.homePageStateData();
    this.contentHeader = {
      headerTitle: "Home",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
        ],
      },
    };
  }

  homePageStateData() {
    this.adminService.homePageState().subscribe((data) => {
      if (!data.status) {
        return;
      }
      this.customerCount = data.items.customerCount;
      this.saleCount = data.items.saleCount;
      this.revenueCount = data.items.revenueCount;
      this.pendingAmount = data.items.pendingAmount;
    });
  }
}
