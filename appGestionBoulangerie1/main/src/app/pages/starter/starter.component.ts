import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppSalesOverviewComponent } from 'src/app/components/dashbord/sales-overview/sales-overview.component';
import { AppYearlyBreakupComponent } from 'src/app/components/dashbord/yearly-breakup/yearly-breakup.component';
import { AppMonthlyEarningsComponent } from 'src/app/components/dashbord/monthly-earnings/monthly-earnings.component';
import { AppRecentTransactionsComponent } from 'src/app/components/dashbord/recent-transactions/recent-transactions.component';
import { AppProductPerformanceComponent } from 'src/app/components/dashbord/product-performance/product-performance.component';
import { AppBlogCardsComponent } from 'src/app/components/dashbord/blog-card/blog-card.component';


@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppSalesOverviewComponent,
    AppYearlyBreakupComponent,
    AppMonthlyEarningsComponent,
    AppRecentTransactionsComponent,
    AppProductPerformanceComponent,
    AppBlogCardsComponent
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { }
