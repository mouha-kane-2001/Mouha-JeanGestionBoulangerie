import { Component } from '@angular/core';
 import { AppSalesOverviewLivreurComponent } from '../sales-overviewLivreur/sales-overviewLivreur.component';
import { AppProductPerformanceLivreurComponent } from '../product-performanceLivreur/product-performanceLivreur.component';
import { AppRecentTransactionsLivreurComponent } from '../recent-transactionsLivreur/recent-transactionsLivreur.component';
 import { AppBlogCardsLivreurComponent} from '../blog-cardLivreur/blog-cardLivreur.component';

@Component({
  selector: 'app-dashboard-widgetsLivreur',
  imports: [ AppBlogCardsLivreurComponent,
    AppProductPerformanceLivreurComponent,
    AppRecentTransactionsLivreurComponent,
    AppSalesOverviewLivreurComponent,
    ],

  templateUrl: './dashboard-widgetsLivreur.component.html',
  styleUrls: ['./dashboard-widgetsLivreur.component.scss'],
  standalone:true
})
export class DashboardWidgetsLivreurComponent {

}
