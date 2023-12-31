import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CsvModule } from "@ctrl/ngx-csv";
import { CoreCommonModule } from "@core/common.module";

import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { HomeComponent } from "./home.component";
import { CustomerComponent } from "./customer/customer.component";
import { ConfigComponent } from "./config/config.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { OrderComponent } from './order/order.component';
import { AuthGuard } from "app/auth/helpers";

const routes = [
  {
    path: "home",
    canActivate: [AuthGuard],
    component: HomeComponent,
    data: { animation: "home" },
  },
  {
    path: "customer",
    canActivate:[AuthGuard],
    component: CustomerComponent,
    data: { animation: "customer" },
  },
  {
    path: "order",
    canActivate:[AuthGuard],
    component: OrderComponent,
    data: { animation: "order" },
  },
  {
    path: "config",
    canActivate:[AuthGuard],
    component: ConfigComponent,
    data: { animation: "customer" },
  },
];

@NgModule({
  declarations: [HomeComponent, CustomerComponent, ConfigComponent, OrderComponent],
  imports: [RouterModule.forChild(routes), ContentHeaderModule, TranslateModule, CoreCommonModule, NgxDatatableModule, CsvModule, NgbModule, CoreCommonModule, NgSelectModule, FormsModule],

  exports: [HomeComponent],
})
export class HomeModule {}
