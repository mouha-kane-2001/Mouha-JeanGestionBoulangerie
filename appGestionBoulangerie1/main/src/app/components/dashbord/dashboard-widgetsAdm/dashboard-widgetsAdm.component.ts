import { Component } from '@angular/core';

import { AppSalesOverviewComponent } from '../sales-overview/sales-overview.component';
import { AppProductPerformanceComponent } from '../product-performance/product-performance.component';

@Component({
  selector: 'app-dashboard-widgets',
  imports: [

     AppProductPerformanceComponent,
    AppSalesOverviewComponent,

  ],
  templateUrl: './dashboard-widgetsAdm.component.html',
  styleUrls: ['./dashboard-widgetsAdm.component.scss'],
  standalone:true
})
export class DashboardWidgetsAdmComponent {

}
