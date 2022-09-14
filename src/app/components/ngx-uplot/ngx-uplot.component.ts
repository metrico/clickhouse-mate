import { Component, ViewChild, AfterViewInit, Input, HostListener } from '@angular/core';
import { cloneObject } from '@app/helper/functions';
import * as _uPlot from 'uplot';

const uPlot: any = (_uPlot as any)?.default;

@Component({
    selector: 'ngx-uplot',
    templateUrl: './ngx-uplot.component.html',
    styles: [`
    .u-legend.u-inline .u-value {
        width: 150px;
        text-align: left;
    }
    `]
})
export class NgxUplotComponent implements AfterViewInit {
    // filters
    isHideNaNData: boolean = true;


    chartData: any;
    uPlotChart: any;
    opts: any = {
        class: "my-chart",
        //	ms:     1,
        //	cursor: {
        //		x: false,
        //		y: false,
        //	},
        // scales: {
        //     "x": {
        //         time: false,
        //         range: [0, 10]
        //     },
        //     "%": {
        //         auto: false,
        //         range: [0, 100],
        //     }
        // },
        // axes: [
        //     {},
        //     {
        //         scale: "%",
        //         values: (self: any, ticks: any) => ticks.map((rawValue: any) => rawValue.toFixed(1) + "%"),
        //     },
        //     {
        //         scale: "mb",
        //         values: (self: any, ticks: any) => ticks.map((rawValue: any) => rawValue.toFixed(2) + "MB"),
        //         side: 1,
        //         grid: { show: false },
        //     },
        // ],
        series: [{}]
    };
    _details: any = [];
    @Input()
    set data(value: any) {
        this._details = value?.data;
        // console.log('this._details => ', this._details);
        try {
            const labels = value?.meta?.map((i: any) => i.name);
            this._details = this._details?.map((d: any) => {
                return Object.values(d);
            })
            const out: any[] = [];
            for (let i = 0; i < this._details.length; i++) {
                for (let j = 0; j < this._details[i].length; j++) {
                    if (!out[j]) {
                        out[j] = [];
                    }
                    const n = this._details[i][j];
                    out[j].push(!isNaN(n) ? +n : null);
                }
            }
            const series = out.map((i, k) => ({
                label: labels[k],
                stroke: this.randColor(),
                width: 1 / devicePixelRatio,
                fill: "rgba(0,255,0,0.1)"
            }));

            this.opts.series = [{}, ...series];

            // console.log('this.opts.series', this.opts.series);
            this._details = [
                [...Array(value?.data?.length).keys()],
                ...out
            ];
            // console.log('FORMATTED:this._details => ', this._details);
            this.makeChart(this._details);
        } catch (e) { }
    }
    get data(): any {
        return this._details;
    }

    @ViewChild('chartUPlot', { static: true }) chartUPlot: any | HTMLElement;
    constructor() {

        // console.log(this.data);
    }
    randColor() {
        return "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
    }
    indexOfField: boolean[] = [];
    filterOfData(): any {
        if (this.isHideNaNData) {
            this.indexOfField = [];
            const outData = this.data.filter((i: any[]) => {
                const out: boolean = !!i.reduce((a, b) => a + +b, 0);
                this.indexOfField.push(out);
                return out;
            })
            // console.log('<< outData >>', outData);
            return outData;
        } else {
            // console.log('<< this.data >>', this.data);
            return this.data
        }
    }
    @HostListener('window:resize', ['$event'])
    resize(event: any) {
        this.updateChecker();
    }

    makeChart(data: any = this.chartData) {
        if (data) {
            this.chartData = data;
        } else {
            return;
        }

        this.chartUPlot.nativeElement.innerHTML = '';
        const filteredData = this.filterOfData();
        const opts: any = cloneObject(this.opts);
        if (this.isHideNaNData && opts?.series) {
            opts.series = opts.series.filter((i: any, k: number) => this.indexOfField[k]);
            // console.log('opts.series', opts.series)
        }
        opts.width = this.chartUPlot.nativeElement.clientWidth;
        opts.height = this.chartUPlot.nativeElement.clientHeight * 0.6 || window.innerHeight * 0.6 - 64;
        // alert('opts.height ' + opts.height)
        this.uPlotChart = new uPlot(opts, filteredData, this.chartUPlot.nativeElement);
    }

    __hostWidth = 0;
    updateChecker() {
        requestAnimationFrame(() => {
            if (this.__hostWidth !== this.chartUPlot.nativeElement.clientWidth + window.innerHeight) {
                this.__hostWidth = this.chartUPlot.nativeElement.clientWidth + window.innerHeight;
                this.makeChart(this.data)
            }
            this.updateChecker();
        })
    }
    ngAfterViewInit() {
        this.makeChart(this.data);
        this.updateChecker()
    }
    hide(event: any) {
        this.makeChart(this.data)
        // console.log(event);
    }
}
