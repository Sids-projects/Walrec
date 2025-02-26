import { Component, AfterViewInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  options: any = {
    chart: {
      type: 'line',
    },
    series: [
      {
        name: 'sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

  chart!: ApexCharts;

  constructor() {}

  ngAfterViewInit() {
    const chartElement = document.querySelector('#chart');
    if (chartElement) {
      this.chart = new ApexCharts(chartElement, this.options);
      this.chart.render();
    } else {
      console.error('Chart element not found in the DOM');
    }
  }
}
