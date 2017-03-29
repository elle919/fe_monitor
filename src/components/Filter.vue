<script>
import Vue from 'vue'
// 通过navigator.userAgent的值返回浏览器及版本
Vue.filter('browserVersion', function (value) {
  var Sys = {};
  var ua = value.toLowerCase();
  var s;
  (s = ua.match(/qihu ([\w.]+)/)) ? Sys.qihu = s[1].toUpperCase() :
  (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
  (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
  (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
  (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
  (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
  (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
  
  if (Sys.qihu) return (Sys.qihu);
  if (Sys.ie) return ('IE: ' + Sys.ie);
  if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
  if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
  if (Sys.opera) return ('Opera: ' + Sys.opera);
  if (Sys.safari) return ('Safari: ' + Sys.safari);
})
//用正则取出errormsg
Vue.filter('errorMsg', function (value) {
  return decodeURIComponent(decodeURIComponent(value));
})
//时间展示yyyy-mm-dd hh:nn:ss
Vue.filter('timeFormat', function (value) {
  var date = new Date(value);
  //现有数据的时区比咱们这慢8小时，所以要加上8
  date.setHours(date.getHours()+8)
  // console.log(date)
  //格式化
  date = date.toISOString().slice(0,-5).replace(/T/,' ')
  return date;
})
</script>