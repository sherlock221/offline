/**
 * 离线存储器
 * 站点离线存储的容量限制是5M
 * sherlock
 * 1.0.0
 */


;(function(exports){

    var  appCache = function(source, color){
        var style = document.createElement('style');
        style.innerHTML = '@-webkit-keyframes loading{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);}}@-moz-keyframes loading{0%{-moz-transform:rotate(0deg);}100%{-moz-transform:rotate(360deg);}}@-o-keyframes loading{0%{-o-transform:rotate(0deg);}100%{-o-transform:rotate(360deg);}}@-ms-keyframes loading{0%{-ms-transform:rotate(0deg);}100%{-ms-transform:rotate(360deg);}}@keyframes loading{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}' + '.mp_loading{position:absolute; width:100%; height:100%;overflow:hidden; background-color:#E44B46; left:0; top:0; -webkit-transform-style:preserve-3d; z-index:1;}' + '.mp_loading_clip{position:absolute; left:50%; top:50%; width:60px; height:60px; margin:-30px 0 0 -30px; overflow:hidden;  -webkit-animation:loading 1.2s linear infinite; -moz-animation:loading 1.2s linear infinite; -o-animation:loading 1.2s linear infinite; -ms-animation:loading 1.2s linear infinite; animation:loading 1.2s linear infinite;}' + '.mp_loading_bar{position:absolute; left:0; top:0; width: 54px;height: 54px; border-radius:50px; overflow:hidden; clip: rect(0px,36px,70px,0); background:transparent; border:3px solid #fff; -webkit-mask:-webkit-gradient(linear,0 0,0 100%,from(rgba(255,255,255,1)),to(rgba(255,255,255,0)));}' + '.mp_loading_txt{width: 100%;position: absolute;top: 50%;margin-top: -9px;text-align: center;color: #fff;}.mp_loading_content{position: relative;top:33px;}';
        document.getElementsByTagName('head')[0].appendChild(style);
        var doc = document,
            args = arguments,
            color = typeof color == 'string' ? color : '#E44B46';
        var _loadDom = doc.getElementById('MP_loading'),
            _txtDom = doc.getElementById('MP_precent');
        if (!_loadDom) {
            _loadDom = doc.createElement('div');
            _loadDom.className = 'mp_loading';
            _loadDom.innerHTML = '<div class="mp_loading_clip"><div class="mp_loading_bar" style="border-color:"' + color + '></div></div>';
            _txtDom = doc.createElement('div');
            _txtDom.className = 'mp_loading_txt';
            _txtDom.innerHTML = '<div class="mp_loading_preserve"></div><div class="mp_loading_content"></div>';
            _txtPreserve =  _txtDom.querySelector(".mp_loading_preserve");
            _txtContent = _txtDom.querySelector(".mp_loading_content");
            _loadDom.calssName = 'mp_loading';
            _txtPreserve.innerHTML = "0%";
            _loadDom.appendChild(_txtDom);
            document.body.appendChild(_loadDom);
        }
        this._loadDom = _loadDom;
        this._txtDom = _txtDom;
        var me = this;

        function setLoadingContent(str){
            _txtContent.innerHTML = str;
        }

        var progressFn  = function(progress){
            var percent = Math.ceil(progress.loaded / progress.total * 100) + '%';
            me._txtDom.querySelector(".mp_loading_preserve").innerHTML = percent;
            console.log(percent);
            me.progress(progress);
        }
        var completeFn = function(e){
            me._loadDom.style.display = 'none';
            console.log("complete");
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                console.log("update ready");
                me.complete(e);
                applicationCache.swapCache();

//                window.location.reload();
            } else {
                // Manifest没有改动，nothing to do
            }
        }
        var downloadingFn  = function(e){
            me._loadDom.style.display = 'block';
            setLoadingContent("更新资源中...");
            me.loadstart(e);
        }

        var checkFn = function(){
            setLoadingContent("检查缓存中...");
        }

        var errorFn = function(e){
            setLoadingContent("异常...");
            me.error_fn(e);
            return false;
        }

        var obsoleteFn = function(){
            setLoadingContent("缓存被取消...");
            return false;
        }

        var noupdateFn = function(){
            setLoadingContent("缓存读取完成...");
            me._loadDom.style.display = 'none';
        }

        window.applicationCache.addEventListener('checking',checkFn, false);
        window.applicationCache.addEventListener('downloading',downloadingFn, false);
        window.applicationCache.addEventListener('progress',progressFn, false);
        window.applicationCache.addEventListener('updateready',completeFn, false);
        window.applicationCache.addEventListener('error',errorFn, false);
        window.applicationCache.addEventListener('obsolete',obsoleteFn, false);
        window.applicationCache.addEventListener('noupdate',noupdateFn, false);
    };

    appCache.prototype = {
         progress: function(handler) { },
         complete      : function(){},
         loadstart    : function(){},
         error_fn      : function(){},
         obsolete       : function(){}
    };

    exports.appCache = appCache;
})(window);