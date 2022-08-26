import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as _uPlot from 'uplot';

const uPlot: any = (_uPlot as any)?.default;

@Component({
    selector: 'ngx-uplot',
    template: `<div style="margin: 0.5rem;" #chartUPlot></div>`,
    styles: [`
    .u-legend.u-inline .u-value {
        width: 150px;
        text-align: left;
    }
    `]
})
export class NgxUplotComponent implements AfterViewInit {
    chartData: any;
    uPlotChart: any;
    opts: any = {
        class: "my-chart",
        //	ms:     1,
        //	cursor: {
        //		x: false,
        //		y: false,
        //	},
        scales: {
            "x": {
                time: false,
            }
        },
        series: [{}]
    };
    _details: any = [
        [1, 3, 2, 4],
        [2, 3, 4, 1],
        [3, 4, 1, 2],
        [4, 1, 2, 3]
    ];
    @Input()
    set data(value: any) {
        this._details = value?.data;
        console.log('this._details => ', this._details);
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

            console.log('this.opts.series', this.opts.series);
            this._details = [
                [...Array(value?.data?.length).keys()],
                ...out
            ];
            console.log('FORMATTED:this._details => ', this._details);
            this.makeChart(this._details);
        } catch (e) { }
    }
    get data(): any {
        return this._details;
    }

    @ViewChild('chartUPlot', { static: true }) chartUPlot: any | HTMLElement;
    constructor() {

        console.log(this.data);
    }
    randColor() {
        return "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    }
    makeChart(data: any = this.chartData) {
        if (data) {
            this.chartData = data;
        } else {
            return;
        }

        this.chartUPlot.nativeElement.innerHTML = '';

        const opts = this.opts;
        opts.width = this.chartUPlot.nativeElement.clientWidth;
        opts.height = this.chartUPlot.nativeElement.clientHeight || 600;

        this.uPlotChart = new uPlot(opts, data, this.chartUPlot.nativeElement);
    }

    __hostWidth = 0;
    updateChecker() {
        requestAnimationFrame(() => {
            if (this.__hostWidth !== this.chartUPlot.nativeElement.clientWidth) {
                this.__hostWidth = this.chartUPlot.nativeElement.clientWidth;
                this.makeChart(this.data)
            }
            this.updateChecker();
        })
    }
    ngAfterViewInit() {
        this.makeChart(this.data);
        this.updateChecker()
    }

}
