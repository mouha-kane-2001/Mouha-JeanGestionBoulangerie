import { Component } from '@angular/core';
 import { AppSalesOverviewClientComponent } from '../sales-overviewClient/sales-overviewClient.component';

 import { AppBlogCardsClientComponent} from '../blog-cardClient/blog-cardClient.component';

@Component({
  selector: 'app-dashboard-widgetsClient',
  imports: [ AppBlogCardsClientComponent,

    AppSalesOverviewClientComponent,
    ],

  templateUrl: './dashboard-widgetsClient.component.html',
  styleUrls: ['./dashboard-widgetsClient.component.scss'],
  standalone:true
})
export class DashboardWidgetsClientComponent {

}
