import { Component, AfterViewInit } from '@angular/core';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  lineOptions: any = {
    chart: {
      type: 'line',
      height: 350,
    },
    series: [
      {
        name: 'Sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 5,
    },
    // title: {
    //   text: 'Sales Growth Over Years',
    //   align: 'center',
    // },
  };

  barOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
    },
    series: [
      {
        name: 'Revenue',
        data: [10, 30, 45, 60, 75, 90, 100, 120, 150],
      },
    ],
    xaxis: {
      categories: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
    },
    colors: ['#008FFB'],
    // title: {
    //   text: 'Revenue by Year',
    //   align: 'center',
    // },
  };

  constructor() {}

  ngAfterViewInit() {
    const lineElement = document.querySelector('#lineChart');
    if (lineElement) {
      const lineChart = new ApexCharts(lineElement, this.lineOptions);
      lineChart.render();
    } else {
      console.error('Line chart element not found in the DOM');
    }

    const barElement = document.querySelector('#barChart');
    if (barElement) {
      const barChart = new ApexCharts(barElement, this.barOptions);
      barChart.render();
    } else {
      console.error('Bar chart element not found in the DOM');
    }
  }
}
