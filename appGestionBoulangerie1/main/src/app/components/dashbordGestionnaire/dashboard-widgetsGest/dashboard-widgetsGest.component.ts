import { Component } from '@angular/core';
 import { AppSalesOverviewGestComponent } from '../sales-overviewGest/sales-overviewGest.component';
import { AppProductPerformanceGestComponent } from '../product-performanceGest/product-performanceGest.component';

@Component({
  selector: 'app-dashboard-widgets',
  imports: [
    AppProductPerformanceGestComponent,
    AppSalesOverviewGestComponent,
    ],
  templateUrl: './dashboard-widgetsGest.component.html',
  styleUrl: './dashboard-widgetsGest.component.scss'
})
export class DashboardWidgetsGestComponent {

}
