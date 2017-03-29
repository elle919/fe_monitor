<script type="text/javascript">
/**
 * 放置监控错误的代码
 * @param {String}  msg   错误信息
 * @param {String}  url   出错的文件
 * @param {Long}    line  出错代码的行号
 * @param {Long}    col   出错代码的列号
 * @param {Object}  error 错误的详细信息，Anything
 */
window.onerror = function(msg,url,line,col,error){
    
    if (msg != "Script error." && !url){
        return;
    }
    
    //获取报错文件的路径
    var http = document.createElement('a');
    http.href = decodeURIComponent(url);
    var file = http.pathname;
    var data = {
        msg: msg,
        file: file,
        line: line,
        //ie8,9不支持col参数
        col: col || (window.event && window.event.errorCharacter) || 0
    };
    
    // 先用cookie记录报错页面page_line_col,防止同个错误同个ip一直上报
    // ie8,9如果同一个页面有多个错，因为没有col暂时只能上报一个
    if(needReport(0.1)){
        var key = data.file+'_'+data.line+'_'+data.col;
        if (!getCookie(key)) {
            //设置过期时间为24小时
            var date = new Date();
            date.setTime(date.getTime()+(24*60*60*1000));
            var expires = date.toGMTString();

            document.cookie = key+'=1;expires='+expires;
            sendReport(data);
        }
    }

    // return true就不会在浏览器下报错，不方便查找问题，暂时注释掉
    // return true;
};
//不能用require cookie库的方法，这样的话，加载比较慢，如果在页面内html报错，来不及捕获错误
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function needReport(sampling){
    return Math.random() <= sampling;
}
function sendReport(data){
    var img = new Image();
    img.src = "//" + window.location.hostname + "/static/img/error_log.gif?msg="+data.msg+"&file="+data.file+"&line="+data.line+"&col="+data.col;
}
</script>