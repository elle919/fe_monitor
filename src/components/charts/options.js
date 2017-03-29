export function lineChartOptionFactory({ legendData=[], xAxisData=[], seriesItems=[]}) {
    const seriesData = seriesItems.map((item, index) => lineSeriesItemFactory(index, item))

    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            right: '20',
            bottom: '20',
            data: legendData,
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
        }],
        yAxis: [{
            type: 'value'
        }],
        series: seriesData,
    }
}

const LINECOLORS = [["#4CA63A", "rgba(76, 166, 58, 0.2)"],["#2d70b3", "rgba(45, 112, 179, 0.2)"], ["#e56d45", "rgba(229, 109, 69, 0.2)"],["#6b47b3","rgba(107, 71, 179, 0.2)"]]

function lineSeriesItemFactory(i, {name, data}){
    return {
        type: 'line',
        symbolSize: 5,
        symbol: 'emptyCircle',
        smooth: true,
        itemStyle: { normal: {color: LINECOLORS[i][0]} },
        // areaStyle: { normal: {color: LINECOLORS[i][1]} },
        name: name,
        data: data
    }
}

const COLORS = ["#56BF8B", "#73ACE6",  "#BF86b6", "#E5B82E", "#E5675C", "#66C3CC", "#A3B3BF", "#6390A6"]

export function pieChartOptionFactory({color=COLORS, legendData, seriesItems}){
    const seriesData = pieSeriesFactory(seriesItems) 
    return {
        color: color,
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}({d}%)',
            show: true
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: legendData
        },
        series: seriesData
    }
}

function pieSeriesFactory(data){
    return [{
        type: 'pie',
        avoidLabelOverlap: false,
        radius: ['35%', '55%'],
        label: {
            normal: {
                show: true,
                formatter: '{d}%'
            },
            emphasis: {
                show: true,
                textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                }
            }
        },
        labelline: {
            normal: {
                show: true,
            }
        },
        data: data
    }]
}