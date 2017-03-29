<template>
<div class="charts">
    <div :id="id" :legendData="legendData" :seriesItems="seriesItems" style="height:350px;"></div>
</div>
</template>

<script>

import { pieChartOptionFactory } from "./options.js"

export default {
    props: {
        title: { 
            type: String,
            required: true,
        },
        legendData:{
            required: true
        },
        seriesItems: {
            required: true
        }
    },
    data(){
        return {
            id: '',
        }
    },
    updated(){ 
        this.chart.setOption(pieChartOptionFactory({
            legendData: this.legendData,
            // legendData: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            seriesItems: this.seriesItems
            // seriesItems: [
            //     {value:335, name:'直接访问'},
            //     {value:310, name:'邮件营销'},
            //     {value:234, name:'联盟广告'},
            //     {value:135, name:'视频广告'},
            //     {value:1548, name:'搜索引擎'}
            // ],
        }))
    },
    beforeMount(){
        this.id = 'pie-'+ this.title;
    },
    mounted(){
        this.chart = echarts.init(document.getElementById(this.id))
    }
}
</script>
