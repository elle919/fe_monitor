<template>
  <div>
  	<Widget title="最近七天曲线图">
  		<LineChart slot="chart" :xAxisData="weektotal.xAxisData" :seriesItems="weektotal.seriesItems"></LineChart>
  	</Widget>
  	<table width="100%">
  		<tr>
  			<td width="50%">
  				<Widget title="错误文件分布图">
			  		<PieChart slot="chart" title="errpage" :legendData="errpage.legendData" :seriesItems="errpage.seriesItems"></PieChart>
			  	</Widget>
  			</td>
  			<td width="50%">
  				<Widget title="浏览器分布图">
			  		<PieChart slot="chart" title="errbrowser" :legendData="errbrowser.legendData" :seriesItems="errbrowser.seriesItems"></PieChart>
			  	</Widget>
  			</td>
  		</tr>
  	</table>
  	<Widget title="报错数据">
  		<div slot="chart">
  			<table id="error-table" class="table table-sorting table-striped table-hover datatable dataTable no-footer f-cb">
			<thead>
			  <tr>
				<th>错误</th>
				<th>浏览器</th>
				<th>时间</th>
				<th>访问IP</th>
			  </tr>
			</thead>
			<tbody style="text-align:left">
			  <tr v-for="info in tabledata">
				<td>
					<p class="f-fs14 f-fwb">{{info._source['uri_msg'] | errorMsg}}</p>
					<p class="f-gray shifter">url:{{info._source['http_referer']}}</p>
					<p class="f-gray">file:<span class="f-orange">{{info._source['uri_file']}}</span> line:<span class="f-orange">{{info._source['uri_line']}}</span> col:<span class="f-orange">{{info._source['uri_col']}}</span></p>
				</td>
				<td>{{info._source['http_user_agent'] | browserVersion}}</td>
				<td>{{info._source['@timestamp'] | timeFormat}}</td>
				<td>{{info._source['remote_addr']}}</td>
			  </tr>
			</tbody>
		  </table>
		  <div style="float:right">
			<el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="currentPage"
			  :page-sizes="[10, 20, 30, 40]"
			  :page-size="pageSize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="total">
			</el-pagination>
		  </div>
  		</div>
  	</Widget>
  </div>
</template>

<script>
import Vue from 'vue'
import es from 'elasticsearch'
import Global from '../store/store.js'
import '../components/Filter'
export default{
	data(){
		return {
			data : [],
			tabledata : [],
			total : 0,
			pageSize : 10,
			currentPage : 1,
			maxDataSize : 10000,
			host : '',
			weektotal : {},
			errpage : {},
            errbrowser: {}
		}
	},
	watch: {
	    '$route'(to,from){
	    	this.host = Global.host[this.$route.params.platform]
	    	this.getData();
	    }
	  },
	mounted: function(){
		console.log(123)
		this.client = new es.Client({
		  	hosts: 'http://10.203.3.111:9200',
	  		apiVersion:'2.4',
		});
		this.date = new Date();
		this.host = Global.host[this.$route.params.platform]
		this.getData();
	},
	methods: {
		formatData: function(arr){
			var self = this;
			arr.forEach((item) => {
				item.browser = self.formatBrowser(item['_source']['http_user_agent'])
				item.file = item['_source']['uri_file']
			})
			return arr;
		},
		handleSizeChange: function(size){
			this.pageSize = size;
			this.getTableData(this.currentPage,this.pageSize);
		},
		handleCurrentChange: function(page){
			this.currentPage = page;
			this.getTableData(this.currentPage,this.pageSize);
		},
		getData: function(){
			this.getWeekData();
			this.getAllData();
	    	this.getTableData(this.currentPage,this.pageSize);
		},
		getWeekData: function(){
			var searchQuery = [];
			var line = {
				xAxisData: [],
				seriesItems: [{
	                name: '错误总数',
	                data: []
	            }]
			};
			var self = this;
			//拼接msearch的字符串
			for(var i = 6; i >= 0; i--){
				var tmpDate = new Date();
				tmpDate.setDate(self.date.getDate()-i)
				var dateString = self.formatDate(tmpDate);
				var searchObj = {};
				var queryObj = {};
				searchObj.index = 'nginx_front_shgt_js-' + dateString;
				searchObj.searchType = 'count';
				queryObj = ('{"query":{"bool":{"must":[{"term":{"host":"'+self.host+'"}}]}}}');
				line.xAxisData.push(dateString);
				searchQuery.push(searchObj);
				searchQuery.push(queryObj);
			}
			
			this.client.msearch({
				body: searchQuery
			},function(error,response){
				if(error){
					console.log(error)
				}else{
					let data = response.responses;
					for(let i = 0; i < data.length; i++){
						if (data[i].hits) {
							line.seriesItems[0].data.push(data[i].hits.total)
						}else{
							line.seriesItems[0].data.push(0)
						}
					}
				}
				self.weektotal = line;
			})
		},
		//获取表格数据，按页取回，按时间倒序
		getTableData: function(page,size){
			var self = this;
			var dateString = self.formatDate(self.date);
			var index = 'nginx_front_shgt_js-'+ dateString;

			this.client.search({
			  index: index,
			  body: {
			    query:{
			    	bool:{
			    		must:[{
			    			term:{
			    				host: self.host
			    			}
			    		}]
			    	}
			    },
			    sort: {
			    	'@timestamp': {
			    			order: 'desc'
			    	}
			    },
			    size: size,
			    from: (page-1)*size
			  }
			}, function (error, response) {
				if(error){
					console.log(error)
				}else{
					self.tabledata = self.formatData(response.hits.hits);
					self.total = response.hits.total;	
				}
			});
		},
		//这个方法可以获取今天所有的数据，暂时设置最大值获取10000条
		getAllData: function(){
			var self = this;
			var dateString = self.formatDate(self.date);
			var index = 'nginx_front_shgt_js-'+ dateString;
			var data = [];
			
			this.client.search({
			  index: index,
			  searchType:'scan',
			  scroll: '10s',
			  body: {
			    query:{
			    	bool:{
			    		must:[{
			    			term:{
			    				host: self.host
			    			}
			    		}]
			    	}
			    },
			 	//这个size表示的是每个shard返回的size数，最终结果为number_of_shards*size,
			 	//咱们系统现在有4个shards
			    size: self.maxDataSize/4
			  }
			}, function getMoreUntilDone(error, response) {
				if(error){
					console.log(error)
				}else{
					response.hits.hits.forEach(function(hit){
						data.push(hit)
					})
					//如果获取数组的值不等于总数，继续获取，看要不要定一个最大值，还是直接为前一天的总值response.hits.total
					let total = response.hits.total;
					if (total > self.maxDataSize) {
						total = self.maxDataSize;
					}
					if ( data.length !== total) {
						//scroll不排序，取回数据速度比较快
						self.client.scroll({
							scrollId: response._scroll_id,
							scroll:'10s'
						},getMoreUntilDone)
					}else{
						self.data = self.formatData(data);
						self.errpage = self.formatChartData('file')
						self.errbrowser = self.formatChartData('browser')
						console.log(self.data)
					}
				}
			});
		},
		formatChartData: function(key){
			var data = this.data;
			var chart = {};	
			var arr = [];
			for(var i = 0; i < data.length; i++){
				if (!data[i][key]) {
					continue;
				}
				var name = data[i][key];
				if (!arr[name]) {
					arr[name] = 1;
				}else{
					arr[name]++;
				}
			}
			//将统计的数组转化成想要的json格式
			chart.seriesItems = [];
			chart.legendData = []
			for(var i in arr){
				var obj = {};
				obj.name = i;
				obj.value = arr[i];
				chart.seriesItems.push(obj);
				chart.legendData.push(i);
			}
			return chart;
		},
		formatDate: function(date){
			//返回格式为yyyy.mm.dd
			return date.getFullYear()+'.'+(( '0' + (date.getMonth()+1) ).slice( -2 ))+'.'+(( '0' + date.getDate() ).slice( -2 ));
		},
		formatBrowser: function(value){
			if (!value) {
				return 'unknown';
			}
			var Sys = {};
		  	var ua = value.toLowerCase();
		  	var s;
		  	//只有在360网站下navigator.userAgent会显示360SE和360EE标识，不过咱们统计的本来就是360的平台
		  	(s = ua.match(/qihu ([\w.]+)/)) ? Sys.qihu = s[1].toUpperCase() :
		  	(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
		  	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		  	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		  	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		  	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		  	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		  	
		  	if (Sys.qihu) return (Sys.qihu);
		  	if (Sys.ie) return ('IE ' + Sys.ie);
		  	if (Sys.firefox) return ('Firefox');
		  	if (Sys.chrome) return ('Chrome');
		  	if (Sys.opera) return ('Opera');
		  	if (Sys.safari) return ('Safari');
		}
	}
}
</script>
