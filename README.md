appCache
=======
html5离线缓存 封装的进度条插件 方便使用离线缓存

背景
------
基于 Html5 application cache 进行封装  在此基础上加入了 UI 进度条  
适用于  单url地址 离线web应用  纯ajax    应为会缓存 当前页面 不适合 首屏渲染  
目前应用与 微信场景应用 企业宣传 活动 


如何使用
-------
      var  cahce =  new appCache();
      cahce.end(function(e){
        console.log("完成结束");
      }).dowloadstart(function(){
        console.log("开始下载")
      });



如何去掉缓存
-------

1.清除浏览器/客户端缓存<br>
2.删除服务器端的manifest文件<br>


重点
-------
服务端配置 mime type 
以下tomcat的
             <mime-mapping>
                    <extension>manifest</extension>
                    <mime-type>text/cache-manifest</mime-type>
             </mime-mapping>



已知的bug
----------------
android 微信的问题  不加载manifest文件
progress线程 下载文件 过大 造成的 回调函数堆积 导致进度条加载问题




