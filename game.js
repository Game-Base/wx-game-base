require('./md5.js');
require('./weapp-adapter.js');
require('./platform.js');
require('./manifest.js');
require('./egret.wxgame.js');
let fileutil;
let fs;
// 启动小游戏本地缓存
if(window.RES && RES.processor) {
    require('./library/image.js');
    require('./library/text.js');
    require('./library/sound.js');
    require('./library/binary.js');
    fileutil = require('./library/file-util');
    fs = fileutil.fs;
}

/**清理资源缓存 */
window["clear_res_cache"] = ()=>{
    if(fs) {
        fs.remove("");
    }
} 

let runOptions = {
    //以下为自动修改，请勿修改
    //The following is automatically modified, please do not modify
    //----auto option start----
		entryClassName: "Main",
		orientation: "auto",
		frameRate: 60,
		scaleMode: "showAll",
		contentWidth: 750,
		contentHeight: 1334,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:8,textColor:0xffffff,bgAlpha:0.8",
		showLog: false,
		maxTouches: 2,
		//----auto option end----
    audioType: 0,
    calculateCanvasScaleFactor: function (context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    }
};

/**加载配置，失败后会重新调用此函数，不可添加其他代码 */
function loadGameConfig(){
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    var cfgPath = "http://192.168.3.186:8089/platformCfg/baseConfig.json?v="+new Date().getTime();
    wx.request({
        url: cfgPath, 
        header: {
            'content-type': 'application/json' // 默认值
        },
        success(res) {
            console.log("loadGameConfig.success", res);
            var cfg = res.data;
            console.log(cfg);
            if(cfg){
                window["GAME_CONFIG"] = cfg;
                loadPreFile();
            } else {
            }
            
        },
        fail(res) {
            console.log("loadGameConfig.fail", res);
        }
    })
}

function loadPreFile(){
    window["showPreLoading"] = showPreLoading;
    window["loadSub2"] = load_sp_main1;
	if(wx.getLaunchOptionsSync){
		var launchOptions = wx.getLaunchOptionsSync();
		if(launchOptions && launchOptions.query && launchOptions.query.cover){
			//console.log("launchOptions query=",launchOptions.query);
			window["createRoleBgCover"] = launchOptions.query.cover;
		}
	}
	
	runEgret();
    load_sp_login();
}
const runEgret = function () {
	require("./EgretSubPackageLoading.js");
	runOptions.entryClassName = "EgretSubPackageLoading";
    egret.runEgret(runOptions);
}

const startGame = function(){
    wx.setKeepScreenOn({
        keepScreenOn: true, success: (res) => {
            console.log('始终亮屏成功', res);
        }, fail: res => {
            console.error('始终亮屏失败', res);
            wx.setKeepScreenOn({keepScreenOn: true});
        }
    });

    wx.showShareMenu();
    wx.onShareAppMessage(() => {
        var imgUrl = "https://xyws-res.boomegg.cn/ts/shareImg/"+shareIndex +'.jpg';
        var msg = shareMessages[shareIndex];
        // wx.shareAppMessage({
        //     title: msg,
        //     imageUrl:  imgUrl// 图片 URL
        // })
        
        shareIndex ++;
        if(shareIndex >= shareMessages.length){
            shareIndex = 0;
        }
        return {
            title: msg,
            imageUrl:  imgUrl// 图片 URL
        }
    })
    
    var main = new Main();
    EgretSubPackageLoading.instance.onSuccess(main);
}

/**加载分包sp_login*/
function load_sp_login(){
    if (wx.loadSubpackage) {
        showPreLoading("玩命加载中.");
        
        let task = wx.loadSubpackage({
            name: "sp_login",
            success: function () {
				startGame();
            },
            fail: function () {
                console.error("分包1加载失败");
            }
        });
    
        var showSecondStep = true;
		task.onProgressUpdate(res => {
			if(res.progress >= 50){
				if(showSecondStep) {
					showSecondStep = false;
					showPreLoading("玩命加载中..")
				}
			}
		})
    }
    else {
        require("./sp_main1/game.js");
        startGame();
    }
}

/**加载分包sp_main1*/
function load_sp_main1(){
    if (wx.loadSubpackage) {
        let task = wx.loadSubpackage({
            name: "sp_main1",
            success: function () {
				load_sp_main2();
            },
            fail: function () {
                console.error("分包1加载失败");
            }
        });
    
		task.onProgressUpdate(res => {
			var onScriptLoadingProgressCallBack = window["onScriptLoadingProgressCallBack"];
			if (onScriptLoadingProgressCallBack != null)
			{
				onScriptLoadingProgressCallBack(res.progress/100);
			}
		})
    }
    else {
        require("./sp_main1/game.js");
        load_sp_main2();
    }
}

/**加载分包sp_main2*/
function load_sp_main2(){
	if (wx.loadSubpackage) {
		let task = wx.loadSubpackage({
			name: "sp_main2",
			success: function () {
				on_sp_main_loaded();
			},
			fail: function () {
				console.error("分包2加载失败");
			}
		});
		task.onProgressUpdate(res => {
			var onScriptLoadingProgressCallBack = window["onScriptLoadingProgressCallBack"];
			if (onScriptLoadingProgressCallBack != null)
			{
				onScriptLoadingProgressCallBack(res.progress/100);
			}
		})
	}
    else {
        require("./sp_main2/game.js");
		on_sp_main_loaded();
    }
    
}

function on_sp_main_loaded(){
	var onScriptLoadedCallBack = window["onScriptLoadedCallBack"];
	if (onScriptLoadedCallBack != null)
	{
		onScriptLoadedCallBack();
	}
}

function showPreLoading(msg){
    if(!msg){
        wx.hideLoading();
        return;
    }
    
    wx.showLoading({
        title: msg,
      });
}
showPreLoading("初始化游戏...")
loadGameConfig();
