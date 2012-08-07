
Kinetic.Isometric = function(tw,th,mw,mh){
   
    this._tile.width = parseInt(tw);
    this._tile.height = parseInt(th)||parseInt(tw)/2;
    this._tile.r = this._tile.width / this._tile.height;
            
    this._map.width = parseInt(mw);
    this._map.height = parseInt(mh) || parseInt(mw);
       
    this._origin.x = this._map.height * this._tile.width / 2;
                            
            
         
    return this;
}
   
Kinetic.Isometric.prototype ={
    _tile :{
        width:0,
        height:0,
        r:0
    },
    _map:{
        width:0,
        height:0
    },
    _origin:{
        x:0,
        y:0
    },
    pos2px:function(x,y){
 
        return{
            left:((x-y)*this._tile.width/2+this._origin.x),
            top:((x+y)*this._tile.height/2)
        }
    },
    px2pos:function(left,top){
        var x = (left - this._origin.x)/this._tile.r;
        return {
            x:((top+x) / this._tile.height),
            y:((top-x) / this._tile.height)
        }
    }
    ,
    centerAt:function(stage,x,y){
        var pos = this.pos2px(x,y),
        posX = -pos.left+stage.getWidth()/2-this._tile.width/2,
        posY = -pos.top+stage.getHeight()/2;
   
        stage.setX(~~posX);
        stage.setY(~~posY);
      
    },
    area:function(stage,offset,torus){
        if(!offset) offset = 0;
        if(!torus) torus = false;
        //calculate the corners
        var vp = {
            _x:-stage.getX(),
            _y:-stage.getY(),
            _w:stage.getWidth(),
            _h:stage.getHeight()
            
        }
        vp._x -= this._tile.width/2;
        vp._y += this._tile.height;
        
        var ow = offset*(this._tile.width/2);
        
        var oh = offset*(this._tile.height);
     

        var grid = [];
        
        for(var y = vp._y-oh,yl = (vp._y+vp._h)+oh;y<yl;y+=this._tile.height/2){
            for(var x = vp._x-ow,xl = (vp._x+vp._w)+ow;x<xl;x+=this._tile.width/2){
                var row = this.px2pos(x,y),
                posX = ~~row.x,posY = ~~row.y;
                if(!torus && posX > 0 || posY > 0) {
                    posX =   Math.max(0,Math.min(this._map.width, posX));
                    posY = Math.max(0, Math.min(this._map.height, posY));
                    grid.push([posX,posY]); 
                }else{
                    grid.push([posX,posY]);  
                }
              
            }
        }
      
       
        return grid;       
    } 
    
};
