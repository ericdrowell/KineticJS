///////////////////////////////////////////////////////////////////////
//  Global
///////////////////////////////////////////////////////////////////////
/**
 * Kinetic Namespace
 * @namespace
 */
var Kinetic = {};
Kinetic.Filters = {};
Kinetic.Plugins = {};
Kinetic.Global = {
    BUBBLE_WHITELIST: ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'click', 'dblclick', 'touchstart', 'touchmove', 'touchend', 'tap', 'dbltap', 'dragstart', 'dragmove', 'dragend'],
    BUFFER_WHITELIST: ['fill', 'stroke', 'textFill', 'textStroke'],
    BUFFER_BLACKLIST: ['shadow'],
    stages: [],
    idCounter: 0,
    tempNodes: {},
    //shapes hash.  rgb keys and shape values
    shapes: {},
    maxDragTimeInterval: 20,
    drag: {
        moving: false,
        offset: {
            x: 0,
            y: 0
        },
        lastDrawTime: 0
    },
    warn: function(str) {
        if(console && console.warn) {
            console.warn('Kinetic warning: ' + str);
        }
    },
    extend: function(c1, c2) {
        for(var key in c2.prototype) {
            if(!( key in c1.prototype)) {
                c1.prototype[key] = c2.prototype[key];
            }
        }
    },
    extendArray: function(array) {
        if (!array) array = [];
        array.on = function (typeStr, handler) {
            for(var i = 0; i < this.length; i++) {
                this[i].on(typeStr, handler);
            }
        };
        array.off = function (typeStr) {
            for(var i = 0; i < this.length; i++) {
                this[i].off(typeStr);
            }
        };
        array.setAttrs = function (config) {
            for(var i = 0; i < this.length; i++) {
                this[i].setAttrs(config);
            }
        };
        array.show = function () {
            for(var i = 0; i < this.length; i++) {
                this[i].show();
            }
        };
        array.hide = function () {
            for(var i = 0; i < this.length; i++) {
                this[i].hide();
            }
        };
        // moveToTop, moveToBottom
        return array;
    },
    _pullNodes: function(stage) {
        var tempNodes = this.tempNodes;
        for(var key in tempNodes) {
            var node = tempNodes[key];
            if(node.getStage() !== undefined && node.getStage()._id === stage._id) {
                stage._addId(node);
                stage._addName(node);
                this._removeTempNode(node);
            }
        }
    },
    _addTempNode: function(node) {
        this.tempNodes[node._id] = node;
    },
    _removeTempNode: function(node) {
        delete this.tempNodes[node._id];
    }
};
