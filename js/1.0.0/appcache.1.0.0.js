/**
 * 离线存储器
 * 站点离线存储的容量限制是5M
 * sherlock
 * 1.0.0
 */


;(function(exports){

    var  appCache = function(css){

        if(css){
            this.css.background = css.background  ==  undefined ?  this.css.background : css.background;
            this.css.borderColor = css.borderColor  ==  undefined ?  this.css.borderColor : css.borderColor;
        }

        var style = document.createElement('style');
        style.innerHTML = '@-webkit-keyframes loading{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);}}@-moz-keyframes loading{0%{-moz-transform:rotate(0deg);}100%{-moz-transform:rotate(360deg);}}@-o-keyframes loading{0%{-o-transform:rotate(0deg);}100%{-o-transform:rotate(360deg);}}@-ms-keyframes loading{0%{-ms-transform:rotate(0deg);}100%{-ms-transform:rotate(360deg);}}@keyframes loading{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}'+
            '.mp_loading{position:absolute; width:100%; height:100%; display:none; overflow:hidden; background-color:'+this.css.background+'; left:0; top:0; -webkit-transform-style:preserve-3d; z-index:1;}' + '.mp_loading_clip{position:absolute; left:50%; top:50%; width:60px; height:60px; margin:-30px 0 0 -30px; overflow:hidden;  -webkit-animation:loading 1.2s linear infinite; -moz-animation:loading 1.2s linear infinite; -o-animation:loading 1.2s linear infinite; -ms-animation:loading 1.2s linear infinite; animation:loading 1.2s linear infinite;}' + '.mp_loading_bar{position:absolute; left:0; top:0; width: 54px;height: 54px; border-radius:50px; overflow:hidden; clip: rect(0px,36px,70px,0); background:transparent; border:3px solid #fff; -webkit-mask:-webkit-gradient(linear,0 0,0 100%,from(rgba(255,255,255,1)),to(rgba(255,255,255,0)));}' + '.mp_loading_txt{width: 100%;position: absolute;top: 50%;margin-top: -9px;text-align: center;color: #fff;}.mp_loading_content{position: relative;top:33px;}';
        document.getElementsByTagName('head')[0].appendChild(style);
        var doc = document,
            args = arguments
        var _loadDom = doc.getElementById('MP_loading'),
            _txtDom = doc.getElementById('MP_precent');
        if (!_loadDom) {
            _loadDom = doc.createElement('div');
            _loadDom.className = 'mp_loading';
            _loadDom.innerHTML = '<div class="mp_loading_clip"><div class="mp_loading_bar" style="border-color:' + this.css.borderColor + '"></div></div>';
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
            if(!me.showTxt) return;
            _txtContent.innerHTML = str;
        }

        var progressFn  = function(progress){
            var percent = Math.ceil(progress.loaded / progress.total * 100) + '%';
            me._txtDom.querySelector(".mp_loading_preserve").innerHTML = percent;
            console.log(percent);
            me._progress(progress);
        }
        var completeFn = function(e){
            me._loadDom.style.display = 'none';
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                console.log("update ready");
                me._updateend(e);
                me._end(e);
                window.applicationCache.swapCache();

                if(me.auto){
                    window.location.reload();
                }
                else{

                    if(confirm("资源更新完成,是否重新加载！")){
                        window.location.reload();
                    }
                }
            }
        }
        var downloadingFn  = function(e){
            me._loadDom.style.display = 'block';
            setLoadingContent("下载资源...");
            me._dowloadstart(e);
        }

        var checkFn = function(){

            setLoadingContent("检查缓存中...");
        }

        var noupdateFn = function(e){
            setLoadingContent("读取缓存...");
            me._end(e);
        }

        var  cachedFn = function(e){

            me._loadDom.style.display = 'none';
            me._addEnd(e)
            me._end(e);
        }

        var errorFn = function(e){
            console.log(e);
            var message;
            if(e.status == "404"){
                message = "资源出现404";
            }
            else{
                message  = e.message;
            }
            alert(message);
            me._loadDom.style.display = 'none';
            me._error_fn(e);
            return false;
        }

        var obsoleteFn = function(e){
            setLoadingContent("缓存被取消...");
            return false;
        }

        window.applicationCache.addEventListener('checking',checkFn, false);
        window.applicationCache.addEventListener('downloading',downloadingFn, false);
        window.applicationCache.addEventListener('progress',progressFn, false);
        window.applicationCache.addEventListener('updateready',completeFn, false);
        window.applicationCache.addEventListener('error',errorFn, false);
        window.applicationCache.addEventListener('obsolete',obsoleteFn, false);
        window.applicationCache.addEventListener('noupdate',noupdateFn, false);
        window.applicationCache.addEventListener('cached',cachedFn, false);

    };

    appCache.prototype = {

        //静默更新 下载完成自动更新 刷新页面载入新数据
        auto         : true,
        //是否显示字
        showTxt      : true,
        css          : {
            //背景色
            background  : "#E44B46",
            //loading边框
            borderColor    : "#ffffff"
        },

        progress: function(handler) {
            if (typeof handler === 'function') {
                this._progress = handler;
            }
            return this;
        },
        //更新完成
        updateend     : function(handler){
            if (typeof handler === 'function') {
                this._updateend = handler;
            }
            return this;
        },

        //开始下载
        dowloadstart    : function(handler){
            if (typeof handler === 'function') {
                this._dowloadstart = handler;
            }
            return this;
        },

        //错误
        error_fn      : function(handler){
            if (typeof handler === 'function') {
                this._error_fn = handler;
            }
            return this;
        },
        //404 cache
        obsolete       : function(handler){
            if (typeof handler === 'function') {
                this._obsolete = handler;
            }
            return this;
        },
        //首次下载完成
        addEnd       : function(handler){
            if (typeof handler === 'function') {
                this._addEnd = handler;
            }
            return this;
        },
        //资源完成
        end          : function(handler){
            if (typeof handler === 'function') {
                this._end = handler;
            }
            return this;
        },

        _updateend   : function(){},
        _addEnd   : function(){},
        _end  : function(){},
        _progress : function(){},
        _dowloadstart : function(){},
        _error_fn  : function(){},
        _obsolete  : function(){}

    };
    exports.appCache = appCache;
})(window);