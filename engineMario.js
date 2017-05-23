function EngineMario(){
    this.keyPressed = [];//已经按下的键的名称
    this.spriteList = [];//整个游戏存在的精灵动画
    this.FPS = 0;//浏览器提供的底层帧速率
    this.lastTime = 0;//计算FPS用的
    this.startTime = 0;//游戏的开始时间
    this.pasued = false;//判断游戏是否暂停
    this.startpasueAt = 0;//游戏暂停或者重新开始的时间点
    this.gameObj = {};//具体的游戏对象，每个场景或许会不同
}
EngineMario.prototype={
	constructor : EngineMario,
/***********************************************************************************************/
// 精灵构造器。这里是构造函数，定义属性。
    SpriteCreate : function(name, painter, behaviors){
        function Sprite(name, painter, behaviors){
          if(name)this.name = name;//精灵的名字
          if(painter)this.painter = painter;//精灵的绘制器
          behaviors?this.behaviors = behaviors: this.behaviors = [];//精灵的行为数组
          this.width = 0;//宽
          this.height = 0;//高
          this.left = 0;//坐标中的x值

          this.top = 0;//坐标中的y值
          this.v_X = 0;//x轴移动速度
          this.v_Y = 0;//Y轴移动速度
          this.aX = 0;//x轴方向的加速度
          this.aY = 0;//y轴方向的加速度
          this.max_VX = 0;//x轴方向最大速度
          this.max_VY = 0;//y轴方向最大速度
          this.animating = false;//是否在播放动画
          this.visible = true;//精灵是否可见
        };
        // 这里是构造函数的原型，定义方法。
        Sprite.prototype = {
            constructor : Sprite,
            //精灵的绘制方法由绘制器提供
            paint : function(context,i){
                if(this.visible&&this.painter.paint !== undefined){
                this.painter.paint(this,context,i);
                }
            },
            //精灵的更新方法由行为数组中的对象提供
            update : function(context,time){
                for (var i = this.behaviors.length; i > 0; --i) {
                 this.behaviors[i-1].execute(this, context, time);
                }
            },
            resetMovement : function(){
                his.width = 0;
                this.height = 0;
                this.left = 0;
                this.top = 0;
                this.v_X = 0;
                this.v_Y = 0;
                this.aX = 0;
                this.aY = 0;
                this.max_VX = 0;
                this.max_VY = 0;
                this.animating = false;
                this.visible = true;
            },
            setMovement : function(options){
                isUndefine = window.engineMario.baseFunction.IsUndefine;
                isUndefined(options.v_X)?this.v_X=this.v_X:this.v_X=options.v_X;
                isUndefined(options.v_Y)?this.v_Y=this.v_Y:this.v_Y=options.v_Y;
                isUndefined(options.aX)?this.aX=this.aX:this.aX=options.aX;
                isUndefined(options.aY)?this.aY=this.aY:this.aY=options.aY;
                isUndefined(options.left)?this.left=this.left:this.left=options.left;
                isUndefined(options.top)?this.top=this.top:this.top=options.top;
                isUndefined(options.width)?this.width=this.width:this.width=options.width;
                isUndefined(options.height)?this.height=this.height:this.height=options.height;
            }
        };
        //精灵表绘制器
        //cells数组表示精灵表，其中的每一项代表每一个具体的精灵信息。
        //spriteSheetCells代表的是所有精灵状态的集合，是个数组。比如包含上下左右走动。
        //它的下标0123分别代表上下左右。
        SpriteSheetPainter = function(spriteSheetCells){
          this.spriteSheetCells = spriteSheetCells? spriteSheetCells:[];
          this.cellIndex=0;
        };
        //增加精灵表的索引，实现遍历精灵表每个单元格
        SpriteSheetPainter.prototype.advance = function(i){
          var i = i?i:0;
          var cells = this.spriteSheetCells[i];
          if(this.cellIndex == cells.length-1){
            this.cellIndex = 0;
          }else{
            this.cellIndex++;
          }
        };
        SpriteSheetPainter.prototype.resetAdvance = function(){
          this.cellIndex = 0;
        };
        SpriteSheetPainter.prototype.paint = function(sprite,context,i){
          var i = i?i:0;
          var cell = this.spriteSheetCells[i][this.cellIndex];//cells中的单元格，即每个精灵。
          context.drawImage(marioSheet, cell.left, cell.top,
                                             cell.width, cell.height,
                                             sprite.left, sprite.top,
                                             sprite.width, sprite.height);

        };
        return new Sprite(name,new SpriteSheetPainter(painte),behaviors)
    },
/***********************************************************************************************/
//游戏循环
    start : function() {
      if(this.paused){
        this.pasued = false;
        if(this.gameObj.initialize){
        this.gameObj.initialize();
        }
      }
      if(this.gameObj.update&&this.gameObj.paint){
        var self = this;
        requestNextAnimationFrame(self.animate)
      }
    },
/***********************************************************************************************/
//主体执行的动画循环。这里对pasued的检测不理想，有点耗费性能
    animate : function(){
        if(this.pasued){
           this.gameObj.update();
           this.clearScreen();
           this.gameObj.paint();
        }
        requestNextAnimationFrame(arguments.callee)
    },
/***********************************************************************************************/
//经常会用到的工具函数
    baseFunction : {
        //判断是否未定义
        IsUndefine : function(obj){
            if(obj===undefined)return true;
            return false;
        },
        //事件绑定
        bindHandler : function(type, obj, func, capture){
            if(window.addEventListener){
                capture = capture?capture:false;
                obj.addEventListener(type, func, capture);
            }else if(window.attachEvent){
                obj.attachEvent("on"+type, func);
            }else{
                obj[on+"type"] = func;
            }
        },
        //太耗费性能，把计算fps的时间长度改一下
        calculateFps : function(){
            var nowTime = +new Date();
            engineMario.FPS = 1000/(nowTime - engineMario.lastTime);
            engineMario.lastTime = nowTime;
            requestNextAnimationFrame(arguments.callee);
        }
    },
/***********************************************************************************************/
//输入处理,是个对象，里面提供方法
    input : {
        //记录按下的键
        recordPress : function(event){
            var keyNum;
            if(window.event){
                keyNum = event.keyCode;
            }else{
                keyNum = event.which;
            }
            var keyName = engineMario.input.translateKeyNum(keyNum);
            window.engineMario.keyPressed[keyName] = true;
            engineMario.input.preventDefault(event);
        },
        //记录抬起的键
        recordUp : function(event){
            if(window.event){
                keyNum = event.keyCode;
            }else{
                keyNum = event.which;
            }
            var keyName = engineMario.input.translateKeyNum(keyNum);
            window.engineMario.keyPressed[keyName] = false;
            engineMario.input.preventDefault(event);

        },
        //把键值转换为键名
        translateKeyNum : function(kn){
            var key;
            switch(kn){
                case 32: key = 'space';        break;
                case 68: key = 'd';            break;
                case 75: key = 'k';            break;
                case 83: key = 's';            break;
                case 80: key = 'p';            break;
                case 37: key = 'left arrow';   break;
                case 39: key = 'right arrow';  break;
                case 38: key = 'up arrow';     break;
                case 40: key = 'down arrow';   break;
            }
            return key;
        },
        //阻止按键触发的默认事件
        preventDefault : function(event){
            if(event.preventDefault){
                event.preventDefault();
            }else if(event.returnValue){
                event.returnValue = false;
            }else{
                return false;
            }
        }

    },
/***********************************************************************************************/
//初始化
    initialize : function(){
        this.lastTime = +new Date();
        requestNextAnimationFrame(engineMario.baseFunction.calculateFps);
        this.baseFunction.bindHandler("keydown",window,engineMario.input.recordPress);
        this.baseFunction.bindHandler("keyup",window,engineMario.input.recordUp);
    },
/***********************************************************************************************/
//擦除屏幕
    clearScreen : function(){
        context.clearRect(canvas.width,canvas.height);
    }
/***********************************************************************************************/
//图片加载器
    imageLoader : function(){

    }
}