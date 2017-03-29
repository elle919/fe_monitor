# fe_monitor
前端异常监控
1. nginx收集日志

在nginx进行配置，将日志统一落到access_log里
```
location ^~ /static/img/error_log.gif{
    empty_gif;
    access_log /opt/logs/js.access.json.log json;
}
```
2. 前端捕获异常window.onerror

主要使用window.onerror来捕获错误，创建一个image，路径指向nginx配置的location，会将信息落入日志。
```
var img = new Image();
img.src = '//'+window.location.hostname+"/static/img/error_log.gif?msg="+data.msg+"&file="+data.file+"&line="+data.line+"&col="+data.col;
```
3. logstash处理日志

参考logstash.conf文件，对落入日志的request_uri，也就是上面img.src进行grok匹配，通过key value，利用&进行分割，直接存储到数据库里。
```
filter {
    if [type] == "nginx_front_shgt_js" {
        grok {
            match => [ "request_uri", "%{GREEDYDATA:uri_stem}\?%{GREEDYDATA:uri_query}"]
        }
        kv {
            source => "uri_query"
            field_split => "&"
            prefix => "uri_"
        }
    }
}
```
4. 检索数据Elasticsearch

在node环境下安装elasticsearch的包
$ npm i –save elasticsearch
    
使用API连接elasticsearch所在的服务器
```
import es from 'elasticsearch'
this.client = new es.Client({
	hosts: 'http://10.203.XXX.XXX:9200',
	apiVersion:'2.4',
});
```
主要使用client.search,client.msearch,client.scroll获取数据

5. Vue和Echart结合进行展示
