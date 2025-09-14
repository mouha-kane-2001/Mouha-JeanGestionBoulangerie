import { Component, ViewChild, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { AdminDashboardService } from 'src/app/services/dashboard/admin-dashboard.service';
import { CommonModule } from '@angular/common';

interface Month {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sales-overview',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, MatButtonModule, CommonModule],
  templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  // Initialisation correcte du graphique
  public salesOverviewChart: any = {
    series: [],
    chart: {
      type: 'bar',
      height: 390,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: '€'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val: any) {
          return val + " €";
        }
      }
    }
  };

  months: Month[] = [
    { value: 'sep', viewValue: 'Sep 2025' },
    { value: 'oct', viewValue: 'Oct 2025' },
    { value: 'nov', viewValue: 'Nov 2025' },
  ];

  selectedMonth: string = 'sep';
  chartInitialized: boolean = false;
    isLoading: boolean = true;


  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
        this.isLoading = true;
    this.loadData();
  }

  loadData(): void {
    this.chartInitialized = false;

    this.dashboardService.getRevenusStats().subscribe(
      (data) => {
        console.log('Données reçues :', data);
        this.initChart(data);
        this.chartInitialized = true;
         this.isLoading = false;
      },
      (error) => {
              this.isLoading = false;

        console.error('Erreur lors du chargement des données:', error);
        // Initialiser avec des données par défaut en cas d'erreur
        this.initChart({ total: 0, duJour: 0 });
        this.chartInitialized = true;
      }
    );
  }

  initChart(data: any): void {
    this.salesOverviewChart = {
      ...this.salesOverviewChart,
      series: [
        {
          name: 'Revenus Total',
          data: [parseFloat(data.total) || 0],
          color: '#5D87FF',
        },
        {
          name: 'Revenus du Jour',
          data: [parseFloat(data.duJour) || 0],
          color: '#49BEFF',
        },
      ],
      xaxis: {
        categories: ['Statistiques Revenus']
      }
    };
  }
}
