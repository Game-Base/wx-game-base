class EgretSubPackageLoading extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        EgretSubPackageLoading.instance = this;
    }

    onAddToStage() {
        let scaleMode = "";

        //scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        let w = window.innerHeight / window.innerWidth;
        let minSizeProb = 1.4;
        let maxSizeProb = 1.78;
        if (w <= minSizeProb)
        {
            scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        }
        else if (w > minSizeProb && w < maxSizeProb)
        {
            scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
        }
        else
        {
            scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        }
        console.log("window.innerHeight / window.innerWidth:", w, scaleMode);
        //安卓输入框获焦后，禁止设置height为100%,只有横竖屏的时候才做处理，防止因为输入框的获焦，失焦导致无法自适应  2017-04-22 by Don
        // if(this.lastOrientation != window.orientation) {
        // 	document.body.style.height = "100%";
        // 	this.lastOrientation = window.orientation;
        // }
        this.stage.scaleMode = scaleMode;

        // this.txt = new egret.TextField();
        // this.txt.textAlign = egret.HorizontalAlign.CENTER;
        // this.txt.width = this.stage.stageWidth;
        // this.txt.y = 1116;
        // this.txt.textColor = 0xffffff;

        // this.loadBg =new egret.ImageLoader();
        // this.loadBg.addEventListener(egret.Event.COMPLETE,this.loadBgCompleteHandler,this);
        // this.loadBg.load("./ui_jindu_di.png");

        // this.loadBar = new egret.ImageLoader();
        // this.loadBar.addEventListener(egret.Event.COMPLETE,this.loadBarCompleteHandler,this);
        // this.loadBar.load("./ui_denglu_jindu.png");
		
        var imageLoader = new egret.ImageLoader();
        imageLoader.addEventListener(egret.Event.COMPLETE,this.loadCompleteHandler,this);
        imageLoader.load("bg1.jpg");
    }


    loadCompleteHandler(event) {
        var imageLoader = event.currentTarget;
        let texture = new egret.Texture();
        texture._setBitmapData(imageLoader.data);
        var bitmap = new egret.Bitmap(texture);
        bitmap.width = 750;
        bitmap.height = 1624;
        bitmap.x = 0;
        bitmap.y = 0;
        this.addChild(bitmap);
        window.bgImg = bitmap;

        // if(this.loadBgImg){
        //     this.addChild(this.loadBgImg);
        // }
        // if(this.loadBarImg){
        //     this.addChild(this.loadBarImg);
        // }

        // this.addChild(this.txt);

        this.curr = 1;
        // this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    }

    
    enterFrameHandler(event){
        this.curr++;
        if(this.curr >= 100){
            this.curr = 1;
        }
        this.txt.text = `${this.curr} ${"%"}`;
        this.loadBarImg.width = (this.stage.stageWidth - 270) * (this.curr/100);
    }

    loadBgCompleteHandler(event) {
        var imageLoader = event.currentTarget;
        let texture = new egret.Texture();
        texture._setBitmapData(imageLoader.data);
        var bitmap = new egret.Bitmap(texture);
        bitmap.x = 100;
        bitmap.y = 1100;
        this.loadBgImg = bitmap;
        this.loadBgImg.scale9Grid = new egret.Rectangle(55,0,10,54);
        bitmap.width = this.stage.stageWidth - 200;
        this.addChild(this.loadBgImg);
    }

    loadBarCompleteHandler(event) {
        var imageLoader = event.currentTarget;
        let texture = new egret.Texture();
        texture._setBitmapData(imageLoader.data);
        var bitmap = new egret.Bitmap(texture);
        bitmap.x = 135;
        bitmap.y = 1116;
        bitmap.scale9Grid = new egret.Rectangle(15,0,40,25);
        bitmap.width = 5;
        this.loadBarImg = bitmap;
        this.addChild(this.loadBarImg);
    }

    setProgress(res) {
        // iOS真机为totalBytesWriten 微信官方将于近期修复 2018.6.19
        var t = res.totalBytesExpectedToWrite;
        var c = res.totalBytesWritten || res.totalBytesWriten;
        var curr = Math.floor(((t - c) / t) * 100);
        this.txt.text = `${curr} ${"%"}`;
        this.loadBarImg.width = (this.stage.stageWidth - 270) * (c/t);
        console.log(res.progress);
    }

    onSuccess(main) {
        const stage = this.stage;
        
        if(window.bgImg){
            window.bgImg.x = 0;
            window.bgImg.y = 0;
        }
        

        stage.addChild(main);
    }

    removePreLoading(){
        // this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        // this.loadBgImg&&this.loadBgImg.parent&&this.loadBgImg.parent.removeChild(this.loadBgImg);
        // this.loadBgImg = null;
        // this.loadBarImg&&this.loadBarImg.parent&&this.loadBarImg.parent.removeChild(this.loadBarImg);
        // this.loadBarImg = null;
        // this.txt&&this.txt.parent&&this.txt.parent.removeChild(this.txt);
        // this.txt = null;

        window.bgImg&&window.bgImg.parent&&window.bgImg.parent.removeChild(window.bgImg);
        window.bgImg = null;
        this.parent&&this.parent.removeChild(this);
        EgretSubPackageLoading.instance = null;

        wx.hideLoading();
    }
}

window.EgretSubPackageLoading = EgretSubPackageLoading;