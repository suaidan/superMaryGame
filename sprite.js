// 精灵构造器。这里是构造函数，定义属性。加油
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
  this.max_VX = 0;//x轴方向最大速度
  this.max_VY = 0;//y轴方向最大速度
  this.animating = false;//是否在播放动画
  this.visible = true;//精灵是否可见
}
// 这里是构造函数的原型，定义方法。
//精灵的绘制方法由绘制器提供
Sprite.prototype.paint=function(context,i){
  if(this.visible&&this.painter.paint !== undefined){
    this.painter.paint(this,context,i);

  }
}
//精灵的更新方法由行为数组中的对象提供
Sprite.prototype.update=function(context,time){
  for (var i = this.behaviors.length; i > 0; --i) {
         this.behaviors[i-1].execute(this, context, time);
      }
}
//精灵表绘制器
//cells数组表示精灵表，其中的每一项代表每一个具体的精灵信息。
function SpriteSheetPainter(spriteSheetCells){
  this.spriteSheetCells = spriteSheetCells? spriteSheetCells:[];
  this.cellIndex=0;
}
//增加精灵表的索引，实现遍历精灵表每个单元格
SpriteSheetPainter.prototype.advance = function(i){
  var i = i?i:0;
  var cells = this.spriteSheetCells[i];
  if(this.cellIndex == cells.length-1){
    this.cellIndex = 0;
  }else{
    this.cellIndex++;
  }
}
SpriteSheetPainter.prototype.resetAdvance = function(){
  this.cellIndex = 0;
}
SpriteSheetPainter.prototype.paint = function(sprite,context,i){
  var i = i?Number(i):0;
  console.log(this.spriteSheetCells);
  var cell = this.spriteSheetCells[i][this.cellIndex];//cells中的单元格，即每个精灵。
  context.drawImage(marioSheet, cell.left, cell.top,
                                     cell.width, cell.height,
                                     sprite.left, sprite.top,
                                     sprite.width, sprite.height);

}