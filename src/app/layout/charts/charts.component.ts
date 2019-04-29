import { Component, OnInit , AfterViewInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {FirebaseService} from'../../shared/services/firebase.service'
import * as moment from 'moment';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit , AfterViewInit {

    selectedDuration : number = 5;
    selectedDurationTransAmount :number = 5;
    perDayChartLoaded: boolean = false;
    transactionAmount: boolean = false;
    durations =[
        new Duration(1,5),
        new Duration(2,10),
        new Duration(3,30),
        new Duration(4,60),
        new Duration(5,90),
        new Duration(6,120)
      ];

    // lineChart
    public lineChartData: Array<any> = [];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

         // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartData: any[] = [];

    


    constructor(public firebaseService :FirebaseService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(){
        this.perDayChart(this.selectedDuration);
        this.trasactionAmountChart(this.selectedDuration);
    }

    onChangeDateTransactionPerDay(){
        this.perDayChart(this.selectedDuration);
    }

    private perDayChart(duration: number){
        this.perDayChartLoaded = false;
        var chartDates = this.chartDates(this.selectedDuration);

        this.barChartLabels = chartDates;
        var date = moment(new Date()).subtract(duration,'days').format("YYYY-MM-DD");

        

    }


    onChangeDateTransAmount(){
        this.trasactionAmountChart(this.selectedDurationTransAmount);
    }

    private trasactionAmountChart(duration:number){
        this.transactionAmount = false;
        var chartDates = this.chartDates(duration);
        this.lineChartLabels = chartDates;
        var date = moment(new Date()).subtract(duration,'days').format("YYYY-MM-DD");

    }

    chartDates(duration : number){
        var dates : string[]=[];
        for(var i =duration; i>=1 ;i--){
            dates.push(moment(new Date()).subtract(i-1,'days').format("YYYY-MM-DD"))

        }
        return dates;
    }


}

export class chart{
    duration : number;
}
export class Duration {
    constructor(public id: number, public value: number) {}
}