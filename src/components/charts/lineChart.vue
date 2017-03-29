<template>
<div class="charts">
    <div id="linechart" :legendData="legendData" :seriesItems="seriesItems" style="height:300px"></div>
</div>
</template>

<script>
import { lineChartOptionFactory } from "./options.js"

export default {
    props: {//todo 为折线图设置 props
        legendData:{},
        xAxisData:{
            required:true
        },
        seriesItems: {
            required: true
        }
    },
    data(){
        return {
        }
    },
    updated(){ 
        this.chart.setOption(lineChartOptionFactory({
            legendData: this.legendData || [],
            xAxisData   : this.xAxisData,
            seriesItems: this.seriesItems
        }))
    },
    mounted(){
        this.chart = echarts.init(document.getElementById('linechart'))
        // this.chart.setOption(lineChartOptionFactory({
        //     legendData  : ['营销', '广告', '搜索'],
        //     xAxisData   : ['2016-11-10', '2016-11-11', '2016-11-12', '2016-11-13', '2016-11-14','2016-11-15','2016-11-16'],
        //     seriesItems : [{
        //         name: '错误总数',
        //         data: [220,132,274,932,553,100,111]
        //     }]
        // }))
    }
}
</script>
