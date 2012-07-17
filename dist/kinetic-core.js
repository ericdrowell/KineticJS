/**
 * KineticJS JavaScript Library core
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Jul 17 2012
 *
 * Copyright (C) 2011 - 2012 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

///////////////////////////////////////////////////////////////////////
//  Global
///////////////////////////////////////////////////////////////////////
/**
 * Kinetic Namespace
 * @namespace
 */
var Kinetic = {};
Kinetic.Filters = {};
Kinetic.Global = {
    BUBBLE_WHITELIST: ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'click', 'dblclick', 'touchstart', 'touchmove', 'touchend', 'tap', 'dbltap', 'dragstart', 'dragmove', 'dragend'],
    stages: [],
    idCounter: 0,
    tempNodes: [],
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
    _pullNodes: function(stage) {
        var tempNodes = this.tempNodes;
        for(var n = 0; n < tempNodes.length; n++) {
            var node = tempNodes[n];
            if(node.getStage() !== undefined && node.getStage()._id === stage._id) {
                stage._addId(node);
                stage._addName(node);
                this.tempNodes.splice(n, 1);
                n -= 1;
            }
        }
    }
};

///////////////////////////////////////////////////////////////////////
//  Type
///////////////////////////////////////////////////////////////////////
/*
 * utilities that determine data type and transform
 * one type into another
 */
Kinetic.Type = {
    /*
     * cherry-picked utilities from underscore.js
     */
    _isElement: function(obj) {
        return !!(obj && obj.nodeType == 1);
    },
    _isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    _isObject: function(obj) {
        return (!!obj && obj.constructor == Object);
    },
    _isArray: function(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    },
    _isNumber: function(obj) {
        return Object.prototype.toString.call(obj) == '[object Number]';
    },
    _isString: function(obj) {
        return Object.prototype.toString.call(obj) == '[object String]';
    },
    /*
     * other utils
     */
    _hasMethods: function(obj) {
        var names = [];
        for(var key in obj) {
            if(this._isFunction(obj[key]))
                names.push(key);
        }
        return names.length > 0;
    },
    /*
     * The argument can be:
     * - an integer (will be applied to both x and y)
     * - an array of one integer (will be applied to both x and y)
     * - an array of two integers (contains x and y)
     * - an array of four integers (contains x, y, width, and height)
     * - an object with x and y properties
     * - an array of one element which is an array of integers
     * - an array of one element of an object
     */
    _getXY: function(arg) {
        if(this._isNumber(arg)) {
            return {
                x: arg,
                y: arg
            };
        }
        else if(this._isArray(arg)) {
            // if arg is an array of one element
            if(arg.length === 1) {
                var val = arg[0];
                // if arg is an array of one element which is a number
                if(this._isNumber(val)) {
                    return {
                        x: val,
                        y: val
                    };
                }
                // if arg is an array of one element which is an array
                else if(this._isArray(val)) {
                    return {
                        x: val[0],
                        y: val[1]
                    };
                }
                // if arg is an array of one element which is an object
                else if(this._isObject(val)) {
                    return val;
                }
            }
            // if arg is an array of two or more elements
            else if(arg.length >= 2) {
                return {
                    x: arg[0],
                    y: arg[1]
                };
            }
        }
        // if arg is an object return the object
        else if(this._isObject(arg)) {
            return arg;
        }

        // default
        return {
            x: 0,
            y: 0
        };
    },
    /*
     * The argument can be:
     * - an integer (will be applied to both width and height)
     * - an array of one integer (will be applied to both width and height)
     * - an array of two integers (contains width and height)
     * - an array of four integers (contains x, y, width, and height)
     * - an object with width and height properties
     * - an array of one element which is an array of integers
     * - an array of one element of an object
     */
    _getSize: function(arg) {
        if(this._isNumber(arg)) {
            return {
                width: arg,
                height: arg
            };
        }
        else if(this._isArray(arg)) {
            // if arg is an array of one element
            if(arg.length === 1) {
                var val = arg[0];
                // if arg is an array of one element which is a number
                if(this._isNumber(val)) {
                    return {
                        width: val,
                        height: val
                    };
                }
                // if arg is an array of one element which is an array
                else if(this._isArray(val)) {
                    /*
                     * if arg is an array of one element which is an
                     * array of four elements
                     */
                    if(val.length >= 4) {
                        return {
                            width: val[2],
                            height: val[3]
                        };
                    }
                    /*
                     * if arg is an array of one element which is an
                     * array of two elements
                     */
                    else if(val.length >= 2) {
                        return {
                            width: val[0],
                            height: val[1]
                        };
                    }
                }
                // if arg is an array of one element which is an object
                else if(this._isObject(val)) {
                    return val;
                }
            }
            // if arg is an array of four elements
            else if(arg.length >= 4) {
                return {
                    width: arg[2],
                    height: arg[3]
                };
            }
            // if arg is an array of two elements
            else if(arg.length >= 2) {
                return {
                    width: arg[0],
                    height: arg[1]
                };
            }
        }
        // if arg is an object return the object
        else if(this._isObject(arg)) {
            return arg;
        }

        // default
        return {
            width: 0,
            height: 0
        };
    },
    /*
     * arg will be an array of numbers or
     *  an array of point objects
     */
    _getPoints: function(arg) {
        if(arg === undefined) {
            return [];
        }

        // an array of objects
        if(this._isObject(arg[0])) {
            return arg;
        }
        // an array of integers
        else {
            /*
             * convert array of numbers into an array
             * of objects containing x, y
             */
            var arr = [];
            for(var n = 0; n < arg.length; n += 2) {
                arr.push({
                    x: arg[n],
                    y: arg[n + 1]
                });
            }

            return arr;
        }
    },
    /*
     * arg can be an image object or image data
     */
    _getImage: function(arg, callback) {
        // if arg is null or undefined
        if(!arg) {
            callback(null);
        }

        // if arg is already an image object
        else if(this._isElement(arg)) {
            callback(arg);
        }

        // if arg is a string, then it's a data url
        else if(this._isString(arg)) {
            var imageObj = new Image();
            imageObj.onload = function() {
                callback(imageObj);
            }
            imageObj.src = arg;
        }

        //if arg is an object that contains the data property, it's an image object
        else if(arg.data) {
            var canvas = document.createElement('canvas');
            canvas.width = arg.width;
            canvas.height = arg.height;
            var context = canvas.getContext('2d');
            context.putImageData(arg, 0, 0);
            var dataUrl = canvas.toDataURL();
            var imageObj = new Image();
            imageObj.onload = function() {
                callback(imageObj);
            }
            imageObj.src = dataUrl;
        }

        else {
            callback(null);
        }
    }
};

///////////////////////////////////////////////////////////////////////
//  Class
///////////////////////////////////////////////////////////////////////
/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
(function() {
    var initializing = false;
    // The base Class implementation (does nothing)
    Kinetic.Class = function() {
    };
    // Create a new Class that inherits from this class
    Kinetic.Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for(var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" ? (function(name, fn) {
                return function() {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if(!initializing && this.init)
                this.init.apply(this, arguments);
        }
        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();
///////////////////////////////////////////////////////////////////////
//  Animation
///////////////////////////////////////////////////////////////////////
Kinetic.Animation = {
    animations: [],
    animIdCounter: 0,
    animRunning: false,
    frame: {
        time: 0,
        timeDiff: 0,
        lastTime: 0
    },
    _addAnimation: function(anim) {
        anim.id = this.animIdCounter++;
        this.animations.push(anim);
    },
    _removeAnimation: function(anim) {
        var id = anim.id;
        var animations = this.animations;
        for(var n = 0; n < animations.length; n++) {
            if(animations[n].id === id) {
                this.animations.splice(n, 1);
                return false;
            }
        }
    },
    _runFrames: function() {
        var nodes = {};
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        for(var n = 0; n < this.animations.length; n++) {
            var anim = this.animations[n];
            if(anim.node && anim.node._id !== undefined) {
                nodes[anim.node._id] = anim.node;
            }
            // if animation object has a function, execute it
            if(anim.func) {
                anim.func(this.frame);
            }
        }

        for(var key in nodes) {
            nodes[key].draw();
        }
    },
    _updateFrameObject: function() {
        var date = new Date();
        var time = date.getTime();
        if(this.frame.lastTime === 0) {
            this.frame.lastTime = time;
        }
        else {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
        }
    },
    _animationLoop: function() {
        if(this.animations.length > 0) {
            this._updateFrameObject();
            this._runFrames();
            var that = this;
            requestAnimFrame(function() {
                that._animationLoop();
            });
        }
        else {
            this.animRunning = false;
            this.frame.lastTime = 0;
        }
    },
    _handleAnimation: function() {
        var that = this;
        if(!this.animRunning) {
            this.animRunning = true;
            that._animationLoop();
        }
        else {
            this.frame.lastTime = 0;
        }
    }
};
requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

///////////////////////////////////////////////////////////////////////
//  Node
///////////////////////////////////////////////////////////////////////
/**
 * Node constructor.&nbsp; Nodes are entities that can be transformed, layered,
 * and have events bound to them.  They are the building blocks of a KineticJS
 * application
 * @constructor
 * @param {Object} config
 */
Kinetic.Node = Kinetic.Class.extend({
    init: function(config) {
        this.defaultNodeAttrs = {
            visible: true,
            listening: true,
            name: undefined,
            alpha: 1,
            x: 0,
            y: 0,
            scale: {
                x: 1,
                y: 1
            },
            rotation: 0,
            offset: {
                x: 0,
                y: 0
            },
            dragConstraint: 'none',
            dragBounds: {},
            draggable: false
        };

        this.setDefaultAttrs(this.defaultNodeAttrs);
        this.eventListeners = {};
        this.setAttrs(config);

        // bind events
        this.on('draggableChange.kinetic', function() {
            this._onDraggableChange();
        });
        var that = this;
        this.on('idChange.kinetic', function(evt) {
            var stage = that.getStage();
            if(stage) {
                stage._removeId(evt.oldVal);
                stage._addId(that);
            }
        });
        this.on('nameChange.kinetic', function(evt) {
            var stage = that.getStage();
            if(stage) {
                stage._removeName(evt.oldVal, that._id);
                stage._addName(that);
            }
        });

        this._onDraggableChange();
    },
    /**
     * bind events to the node.  KineticJS supports mouseover, mousemove,
     * mouseout, mousedown, mouseup, click, dblclick, touchstart, touchmove,
     * touchend, tap, dbltap, dragstart, dragmove, and dragend.  Pass in a string
     * of event types delimmited by a space to bind multiple events at once
     * such as 'mousedown mouseup mousemove'. include a namespace to bind an
     * event by name such as 'click.foobar'.
     * @name on
     * @methodOf Kinetic.Node.prototype
     * @param {String} typesStr
     * @param {Function} handler
     */
    on: function(typesStr, handler) {
        var types = typesStr.split(' ');
        /*
         * loop through types and attach event listeners to
         * each one.  eg. 'click mouseover.namespace mouseout'
         * will create three event bindings
         */
        for(var n = 0; n < types.length; n++) {
            var type = types[n];
            var event = type;
            var parts = event.split('.');
            var baseEvent = parts[0];
            var name = parts.length > 1 ? parts[1] : '';

            if(!this.eventListeners[baseEvent]) {
                this.eventListeners[baseEvent] = [];
            }

            this.eventListeners[baseEvent].push({
                name: name,
                handler: handler
            });
        }
    },
    /**
     * remove event bindings from the node.  Pass in a string of
     * event types delimmited by a space to remove multiple event
     * bindings at once such as 'mousedown mouseup mousemove'.
     * include a namespace to remove an event binding by name
     * such as 'click.foobar'.
     * @name off
     * @methodOf Kinetic.Node.prototype
     * @param {String} typesStr
     */
    off: function(typesStr) {
        var types = typesStr.split(' ');

        for(var n = 0; n < types.length; n++) {
            var type = types[n];
            //var event = (type.indexOf('touch') === -1) ? 'on' + type : type;
            var event = type;
            var parts = event.split('.');
            var baseEvent = parts[0];

            if(this.eventListeners[baseEvent] && parts.length > 1) {
                var name = parts[1];

                for(var i = 0; i < this.eventListeners[baseEvent].length; i++) {
                    if(this.eventListeners[baseEvent][i].name === name) {
                        this.eventListeners[baseEvent].splice(i, 1);
                        if(this.eventListeners[baseEvent].length === 0) {
                            delete this.eventListeners[baseEvent];
                            break;
                        }
                        i--;
                    }
                }
            }
            else {
                delete this.eventListeners[baseEvent];
            }
        }
    },
    /**
     * get attrs
     * @name getAttrs
     * @methodOf Kinetic.Node.prototype
     */
    getAttrs: function() {
        return this.attrs;
    },
    /**
     * set default attrs
     * @name setDefaultAttrs
     * @methodOf Kinetic.Node.prototype
     * @param {Object} confic
     */
    setDefaultAttrs: function(config) {
        // create attrs object if undefined
        if(this.attrs === undefined) {
            this.attrs = {};
        }

        if(config) {
            for(var key in config) {
                /*
                 * only set the attr if it's undefined in case
                 * a developer writes a custom class that extends
                 * a Kinetic Class such that their default property
                 * isn't overwritten by the Kinetic Class default
                 * property
                 */
                if(this.attrs[key] === undefined) {
                    this.attrs[key] = config[key];
                }
            }
        }
    },
    /**
     * set attrs
     * @name setAttrs
     * @methodOf Kinetic.Node.prototype
     * @param {Object} config
     */
    setAttrs: function(config) {
        var type = Kinetic.Type;
        var that = this;
        // set properties from config
        if(config !== undefined) {
            function setAttrs(obj, c, level) {
                for(var key in c) {
                    var val = c[key];
                    var oldVal = obj[key];

                    /*
                     * only fire change event for root
                     * level attrs
                     */
                    if(level === 0) {
                        that._fireBeforeChangeEvent(key, oldVal, val);
                    }

                    // if obj doesn't have the val property, then create it
                    if(obj[key] === undefined && val !== undefined) {
                        obj[key] = {};
                    }

                    /*
                     * if property is a pure object (no methods), then add an empty object
                     * to the node and then traverse
                     */
                    if(type._isObject(val) && !type._isArray(val) && !type._isElement(val) && !type._hasMethods(val)) {
                        /*
                         * since some properties can be strings or objects, e.g.
                         * fill, we need to first check that obj is an object
                         * before setting properties.  If it's not an object,
                         * overwrite obj with an object literal
                         */
                        if(!Kinetic.Type._isObject(obj[key])) {
                            obj[key] = {};
                        }

                        setAttrs(obj[key], val, level + 1);
                    }
                    /*
                     * add all other object types to attrs object
                     */
                    else {
                        // handle special keys
                        switch (key) {
                            case 'rotationDeg':
                                that._setAttr(obj, 'rotation', c[key] * Math.PI / 180);
                                // override key for change event
                                key = 'rotation';
                                break;
                            /*
                             * includes:
                             * - node offset
                             * - fill pattern offset
                             * - shadow offset
                             */
                            case 'offset':
                                var pos = type._getXY(val);
                                that._setAttr(obj[key], 'x', pos.x);
                                that._setAttr(obj[key], 'y', pos.y);
                                break;
                            case 'scale':
                                var pos = type._getXY(val);
                                that._setAttr(obj[key], 'x', pos.x);
                                that._setAttr(obj[key], 'y', pos.y);
                                break;
                            case 'points':
                                that._setAttr(obj, key, type._getPoints(val));
                                break;
                            case 'crop':
                                var pos = type._getXY(val);
                                var size = type._getSize(val);
                                that._setAttr(obj[key], 'x', pos.x);
                                that._setAttr(obj[key], 'y', pos.y);
                                that._setAttr(obj[key], 'width', size.width);
                                that._setAttr(obj[key], 'height', size.height);
                                break;
                            default:
                                that._setAttr(obj, key, val);
                                break;
                        }
                    }
                    /*
                     * only fire change event for root
                     * level attrs
                     */
                    if(level === 0) {
                        that._fireChangeEvent(key, oldVal, val);
                    }
                }
            }
            setAttrs(this.attrs, config, 0);
        }
    },
    /**
     * determine if shape is visible or not.  Shape is visible only
     * if it's visible and all of its ancestors are visible.  If one ancestor
     * is invisible, this means that the shape is also invisible
     * @name isVisible
     * @methodOf Kinetic.Node.prototype
     */
    isVisible: function() {
        if(this.attrs.visible && this.getParent() && !this.getParent().isVisible()) {
            return false;
        }
        return this.attrs.visible;
    },
    /**
     * show node
     * @name show
     * @methodOf Kinetic.Node.prototype
     */
    show: function() {
        this.setAttrs({
            visible: true
        });
    },
    /**
     * hide node
     * @name hide
     * @methodOf Kinetic.Node.prototype
     */
    hide: function() {
        this.setAttrs({
            visible: false
        });
    },
    /**
     * get zIndex
     * @name getZIndex
     * @methodOf Kinetic.Node.prototype
     */
    getZIndex: function() {
        return this.index;
    },
    /**
     * get absolute z-index by taking into account
     * all parent and sibling indices
     * @name getAbsoluteZIndex
     * @methodOf Kinetic.Node.prototype
     */
    getAbsoluteZIndex: function() {
        var level = this.getLevel();
        var stage = this.getStage();
        var that = this;
        var index = 0;
        function addChildren(children) {
            var nodes = [];
            for(var n = 0; n < children.length; n++) {
                var child = children[n];
                index++;

                if(child.nodeType !== 'Shape') {
                    nodes = nodes.concat(child.getChildren());
                }

                if(child._id === that._id) {
                    n = children.length;
                }
            }

            if(nodes.length > 0 && nodes[0].getLevel() <= level) {
                addChildren(nodes);
            }
        }
        if(that.nodeType !== 'Stage') {
            addChildren(that.getStage().getChildren());
        }

        return index;
    },
    /**
     * get node level in node tree
     * @name getLevel
     * @methodOf Kinetic.Node.prototype
     */
    getLevel: function() {
        var level = 0;
        var parent = this.parent;
        while(parent) {
            level++;
            parent = parent.parent;
        }
        return level;
    },
    /**
     * set node position
     * @name setPosition
     * @methodOf Kinetic.Node.prototype
     * @param {Object} point
     */
    setPosition: function() {
        var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
        this.setAttrs(pos);
    },
    /**
     * get node position relative to container
     * @name getPosition
     * @methodOf Kinetic.Node.prototype
     */
    getPosition: function() {
        return {
            x: this.attrs.x,
            y: this.attrs.y
        };
    },
    /**
     * get absolute position relative to stage
     * @name getAbsolutePosition
     * @methodOf Kinetic.Node.prototype
     */
    getAbsolutePosition: function() {
        return this.getAbsoluteTransform().getTranslation();
    },
    /**
     * set absolute position relative to stage
     * @name setAbsolutePosition
     * @methodOf Kinetic.Node.prototype
     * @param {Object} pos object containing an x and
     *  y property
     */
    setAbsolutePosition: function() {
        var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
        /*
         * save rotation and scale and
         * then remove them from the transform
         */
        var rot = this.attrs.rotation;
        var scale = {
            x: this.attrs.scale.x,
            y: this.attrs.scale.y
        };
        var offset = {
            x: this.attrs.offset.x,
            y: this.attrs.offset.y
        };

        this.attrs.rotation = 0;
        this.attrs.scale = {
            x: 1,
            y: 1
        };

        // unravel transform
        var it = this.getAbsoluteTransform();
        it.invert();
        it.translate(pos.x, pos.y);
        pos = {
            x: this.attrs.x + it.getTranslation().x,
            y: this.attrs.y + it.getTranslation().y
        };

        this.setPosition(pos.x, pos.y);

        // restore rotation and scale
        this.rotate(rot);
        this.attrs.scale = {
            x: scale.x,
            y: scale.y
        };
    },
    /**
     * move node by an amount
     * @name move
     * @methodOf Kinetic.Node.prototype
     */
    move: function() {
        var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));

        var x = this.getX();
        var y = this.getY();

        if(pos.x !== undefined) {
            x += pos.x;
        }

        if(pos.y !== undefined) {
            y += pos.y;
        }

        this.setAttrs({
            x: x,
            y: y
        });
    },
    /**
     * get rotation in degrees
     * @name getRotationDeg
     * @methodOf Kinetic.Node.prototype
     */
    getRotationDeg: function() {
        return this.attrs.rotation * 180 / Math.PI;
    },
    /**
     * rotate node by an amount in radians
     * @name rotate
     * @methodOf Kinetic.Node.prototype
     * @param {Number} theta
     */
    rotate: function(theta) {
        this.setAttrs({
            rotation: this.getRotation() + theta
        });
    },
    /**
     * rotate node by an amount in degrees
     * @name rotateDeg
     * @methodOf Kinetic.Node.prototype
     * @param {Number} deg
     */
    rotateDeg: function(deg) {
        this.setAttrs({
            rotation: this.getRotation() + (deg * Math.PI / 180)
        });
    },
    /**
     * move node to top
     * @name moveToTop
     * @methodOf Kinetic.Node.prototype
     */
    moveToTop: function() {
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.push(this);
        this.parent._setChildrenIndices();
    },
    /**
     * move node up
     * @name moveUp
     * @methodOf Kinetic.Node.prototype
     */
    moveUp: function() {
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index + 1, 0, this);
        this.parent._setChildrenIndices();
    },
    /**
     * move node down
     * @name moveDown
     * @methodOf Kinetic.Node.prototype
     */
    moveDown: function() {
        var index = this.index;
        if(index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent._setChildrenIndices();
        }
    },
    /**
     * move node to bottom
     * @name moveToBottom
     * @methodOf Kinetic.Node.prototype
     */
    moveToBottom: function() {
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.unshift(this);
        this.parent._setChildrenIndices();
    },
    /**
     * set zIndex
     * @name setZIndex
     * @methodOf Kinetic.Node.prototype
     * @param {int} zIndex
     */
    setZIndex: function(zIndex) {
        var index = this.index;
        this.parent.children.splice(index, 1);
        this.parent.children.splice(zIndex, 0, this);
        this.parent._setChildrenIndices();
    },
    /**
     * get absolute alpha
     * @name getAbsoluteAlpha
     * @methodOf Kinetic.Node.prototype
     */
    getAbsoluteAlpha: function() {
        var absAlpha = 1;
        var node = this;
        // traverse upwards
        while(node.nodeType !== 'Stage') {
            absAlpha *= node.attrs.alpha;
            node = node.parent;
        }
        return absAlpha;
    },
    /**
     * determine if node is currently in drag and drop mode
     * @name isDragging
     * @methodOf Kinetic.Node.prototype
     */
    isDragging: function() {
        var go = Kinetic.Global;
        return go.drag.node !== undefined && go.drag.node._id === this._id && go.drag.moving;
    },
    /**
     * move node to another container
     * @name moveTo
     * @methodOf Kinetic.Node.prototype
     * @param {Container} newContainer
     */
    moveTo: function(newContainer) {
        var parent = this.parent;
        // remove from parent's children
        parent.children.splice(this.index, 1);
        parent._setChildrenIndices();

        // add to new parent
        newContainer.children.push(this);
        this.index = newContainer.children.length - 1;
        this.parent = newContainer;
        newContainer._setChildrenIndices();
    },
    /**
     * get parent container
     * @name getParent
     * @methodOf Kinetic.Node.prototype
     */
    getParent: function() {
        return this.parent;
    },
    /**
     * get layer that contains the node
     * @name getLayer
     * @methodOf Kinetic.Node.prototype
     */
    getLayer: function() {
        if(this.nodeType === 'Layer') {
            return this;
        }
        else {
            return this.getParent().getLayer();
        }
    },
    /**
     * get stage that contains the node
     * @name getStage
     * @methodOf Kinetic.Node.prototype
     */
    getStage: function() {
        if(this.nodeType !== 'Stage' && this.getParent()) {
            return this.getParent().getStage();
        }
        else if(this.nodeType === 'Stage') {
            return this;
        }
        else {
            return undefined;
        }
    },
    /**
     * simulate event
     * @name simulate
     * @methodOf Kinetic.Node.prototype
     * @param {String} eventType
     */
    simulate: function(eventType) {
        this._handleEvent(eventType, {});
    },
    /**
     * transition node to another state.  Any property that can accept a real
     *  number can be transitioned, including x, y, rotation, alpha, strokeWidth,
     *  radius, scale.x, scale.y, offset.x, offset.y, etc.
     * @name transitionTo
     * @methodOf Kinetic.Node.prototype
     * @param {Object} config
     * @config {Number} [duration] duration that the transition runs in seconds
     * @config {String} [easing] easing function.  can be linear, ease-in, ease-out, ease-in-out,
     *  back-ease-in, back-ease-out, back-ease-in-out, elastic-ease-in, elastic-ease-out,
     *  elastic-ease-in-out, bounce-ease-out, bounce-ease-in, bounce-ease-in-out,
     *  strong-ease-in, strong-ease-out, or strong-ease-in-out
     *  linear is the default
     * @config {Function} [callback] callback function to be executed when
     *  transition completes
     */
    transitionTo: function(config) {
        var a = Kinetic.Animation;

        /*
         * clear transition if one is currently running for this
         * node
         */
        if(this.transAnim) {
            a._removeAnimation(this.transAnim);
            this.transAnim = null;
        }

        /*
         * create new transition
         */
        var node = this.nodeType === 'Stage' ? this : this.getLayer();
        var that = this;
        var trans = new Kinetic.Transition(this, config);
        var anim = {
            func: function() {
                trans._onEnterFrame();
            },
            node: node
        };

        // store reference to transition animation
        this.transAnim = anim;

        /*
         * adding the animation with the addAnimation
         * method auto generates an id
         */
        a._addAnimation(anim);

        // subscribe to onFinished for first tween
        trans.onFinished = function() {
            // remove animation
            a._removeAnimation(anim);
            that.transAnim = null;

            // callback
            if(config.callback !== undefined) {
                config.callback();
            }

            anim.node.draw();
        };
        // auto start
        trans.start();

        a._handleAnimation();

        return trans;
    },
    /**
     * get transform of the node while taking into
     * account the transforms of its parents
     * @name getAbsoluteTransform
     * @methodOf Kinetic.Node.prototype
     */
    getAbsoluteTransform: function() {
        // absolute transform
        var am = new Kinetic.Transform();

        var family = [];
        var parent = this.parent;

        family.unshift(this);
        while(parent) {
            family.unshift(parent);
            parent = parent.parent;
        }

        for(var n = 0; n < family.length; n++) {
            var node = family[n];
            var m = node.getTransform();

            am.multiply(m);
        }

        return am;
    },
    /**
     * get transform of the node while not taking
     * into account the transforms of its parents
     * @name getTransform
     * @methodOf Kinetic.Node.prototype
     */
    getTransform: function() {
        var m = new Kinetic.Transform();

        if(this.attrs.x !== 0 || this.attrs.y !== 0) {
            m.translate(this.attrs.x, this.attrs.y);
        }
        if(this.attrs.rotation !== 0) {
            m.rotate(this.attrs.rotation);
        }
        if(this.attrs.scale.x !== 1 || this.attrs.scale.y !== 1) {
            m.scale(this.attrs.scale.x, this.attrs.scale.y);
        }
        // center offset
        if(this.attrs.offset.x !== 0 || this.attrs.offset.y !== 0) {
            m.translate(-1 * this.attrs.offset.x, -1 * this.attrs.offset.y);
        }

        return m;
    },
    /**
     * clone node
     * @name clone
     * @methodOf Kinetic.Node.prototype
     * @param {Object} config used to override cloned
     *  attrs
     */
    clone: function(obj) {
        // instantiate new node
        var classType = this.shapeType || this.nodeType;
        var node = new Kinetic[classType](this.attrs);

        /*
         * copy over user listeners
         */
        for(var key in this.eventListeners) {
            var allListeners = this.eventListeners[key];
            for(var n = 0; n < allListeners.length; n++) {
                var listener = allListeners[n];
                /*
                 * don't include kinetic namespaced listeners because
                 *  these are generated by the constructors
                 */
                if(listener.name.indexOf('kinetic') < 0) {
                    // if listeners array doesn't exist, then create it
                    if(!node.eventListeners[key]) {
                        node.eventListeners[key] = [];
                    }
                    node.eventListeners[key].push(listener);
                }
            }
        }

        // apply attr overrides
        node.setAttrs(obj);
        return node;
    },
    /**
     * save image data
     * @name saveImageData
     * @methodOf Kinetic.Node.prototype
     */
    saveImageData: function() {
        try {
            var stage = this.getStage();
            var bufferLayer = stage.bufferLayer;
            var bufferLayerContext = bufferLayer.getContext();
            var width = stage.getWidth();
            var height = stage.getHeight();

            bufferLayer.clear();
            this._draw(bufferLayer);
            var imageData = bufferLayerContext.getImageData(0, 0, width, height);
            this.imageData = imageData;
        }
        catch(e) {
            Kinetic.Global.warn('Image data could not saved because canvas is dirty.');
        }
    },
    /**
     * clear image data
     * @name clearImageData
     * @methodOf Kinetic.Node.prototype
     */
    clearImageData: function() {
        delete this.imageData;
    },
    /**
     * get image data
     * @name getImageData
     * @methodOf Kinetic.Node.prototype
     */
    getImageData: function() {
        return this.imageData;
    },
    /**
     * Creates a composite data URL. If MIME type is not
     * specified, then "image/png" will result. For "image/jpeg", specify a quality
     * level as quality (range 0.0 - 1.0)
     * @name toDataURL
     * @methodOf Kinetic.Stage.prototype
     * @param {String} [mimeType]
     * @param {Number} [quality]
     */
    toDataURL: function(mimeType, quality) {
        var bufferLayer = this.getStage().bufferLayer;
        var bufferCanvas = bufferLayer.getCanvas();
        var bufferContext = bufferLayer.getContext();
        bufferLayer.clear();
        this._draw(bufferLayer);

        try {
            // If this call fails (due to browser bug, like in Firefox 3.6),
            // then revert to previous no-parameter image/png behavior
            return bufferLayer.getCanvas().toDataURL(mimeType, quality);
        }
        catch(e) {
            return bufferLayer.getCanvas().toDataURL();
        }
    },
    /**
     * converts node into an image.  Since the toImage
     *  method is asynchronous, a callback is required
     * @name toImage
     * @methodOf Kinetic.Stage.prototype
     */
    toImage: function(callback) {
        Kinetic.Type._getImage(this.toDataURL(), function(img) {
            callback(img);
        });
    },
    _setImageData: function(imageData) {
        if(imageData && imageData.data) {
            this.imageData = imageData;
        }
    },
    _fireBeforeChangeEvent: function(attr, oldVal, newVal) {
        this._handleEvent('before' + attr.toUpperCase() + 'Change', {
            oldVal: oldVal,
            newVal: newVal
        });
    },
    _fireChangeEvent: function(attr, oldVal, newVal) {
        this._handleEvent(attr + 'Change', {
            oldVal: oldVal,
            newVal: newVal
        });
    },
    _setAttr: function(obj, attr, val) {
        if(val !== undefined) {
            if(obj === undefined) {
                obj = {};
            }
            obj[attr] = val;
        }
    },
    _listenDrag: function() {
        this._dragCleanup();
        var go = Kinetic.Global;
        var that = this;
        this.on('mousedown.kinetic touchstart.kinetic', function(evt) {
            that._initDrag();
        });
    },
    _initDrag: function() {
        var go = Kinetic.Global;
        var stage = this.getStage();
        var pos = stage.getUserPosition();

        if(pos) {
            var m = this.getTransform().getTranslation();
            var am = this.getAbsoluteTransform().getTranslation();
            go.drag.node = this;
            go.drag.offset.x = pos.x - this.getAbsoluteTransform().getTranslation().x;
            go.drag.offset.y = pos.y - this.getAbsoluteTransform().getTranslation().y;
        }
    },
    _onDraggableChange: function() {
        if(this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            // remove event listeners
            this._dragCleanup();

            /*
             * force drag and drop to end
             * if this node is currently in
             * drag and drop mode
             */
            var stage = this.getStage();
            var go = Kinetic.Global;
            if(stage && go.drag.node && go.drag.node._id === this._id) {
                stage._endDrag();
            }
        }
    },
    /**
     * remove drag and drop event listener
     */
    _dragCleanup: function() {
        this.off('mousedown.kinetic');
        this.off('touchstart.kinetic');
    },
    /**
     * handle node event
     */
    _handleEvent: function(eventType, evt) {
        if(this.nodeType === 'Shape') {
            evt.shape = this;
        }

        var stage = this.getStage();
        var mover = stage ? stage.mouseoverShape : null;
        var mout = stage ? stage.mouseoutShape : null;
        var el = this.eventListeners;
        var okayToRun = true;

        /*
         * determine if event handler should be skipped by comparing
         * parent nodes
         */
        if(eventType === 'mouseover' && mout && mout._id === this._id) {
            okayToRun = false;
        }
        else if(eventType === 'mouseout' && mover && mover._id === this._id) {
            okayToRun = false;
        }

        if(okayToRun) {
            if(el[eventType]) {
                var events = el[eventType];
                for(var i = 0; i < events.length; i++) {
                    events[i].handler.apply(this, [evt]);
                }
            }

            if(stage && mover && mout) {
                stage.mouseoverShape = mover.parent;
                stage.mouseoutShape = mout.parent;
            }

            // simulate event bubbling
            if(Kinetic.Global.BUBBLE_WHITELIST.indexOf(eventType) >= 0 && !evt.cancelBubble && this.parent) {
                this._handleEvent.call(this.parent, eventType, evt);
            }
        }
    }
});

// add getter and setter methods
Kinetic.Node.addSetters = function(constructor, arr) {
    for(var n = 0; n < arr.length; n++) {
        var attr = arr[n];
        this._addSetter(constructor, attr);
    }
};
Kinetic.Node.addGetters = function(constructor, arr) {
    for(var n = 0; n < arr.length; n++) {
        var attr = arr[n];
        this._addGetter(constructor, attr);
    }
};
Kinetic.Node.addGettersSetters = function(constructor, arr) {
    this.addSetters(constructor, arr);
    this.addGetters(constructor, arr);
};
Kinetic.Node._addSetter = function(constructor, attr) {
    var that = this;
    var method = 'set' + attr.charAt(0).toUpperCase() + attr.slice(1);
    constructor.prototype[method] = function() {
        if(arguments.length == 1) {
            arg = arguments[0];
        }
        else {
            arg = Array.prototype.slice.call(arguments);
        }
        var obj = {};
        obj[attr] = arg;
        this.setAttrs(obj);
    };
};
Kinetic.Node._addGetter = function(constructor, attr) {
    var that = this;
    var method = 'get' + attr.charAt(0).toUpperCase() + attr.slice(1);
    constructor.prototype[method] = function(arg) {
        return this.attrs[attr];
    };
};
// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Node, ['x', 'y', 'scale', 'detectionType', 'rotation', 'alpha', 'name', 'id', 'offset', 'draggable', 'dragConstraint', 'dragBounds', 'listening']);
Kinetic.Node.addSetters(Kinetic.Node, ['rotationDeg']);

/**
 * set node x position
 * @name setX
 * @methodOf Kinetic.Node.prototype
 * @param {Number} x
 */

/**
 * set node y position
 * @name setY
 * @methodOf Kinetic.Node.prototype
 * @param {Number} y
 */

/**
 * set detection type
 * @name setDetectionType
 * @methodOf Kinetic.Node.prototype
 * @param {String} type can be "path" or "pixel"
 */

/**
 * set node rotation in radians
 * @name setRotation
 * @methodOf Kinetic.Node.prototype
 * @param {Number} theta
 */

/**
 * set alpha.  Alpha values range from 0 to 1.
 * A node with an alpha of 0 is fully transparent, and a node
 * with an alpha of 1 is fully opaque
 * @name setAlpha
 * @methodOf Kinetic.Node.prototype
 * @param {Object} alpha
 */

/**
 * set draggable
 * @name setDraggable
 * @methodOf Kinetic.Node.prototype
 * @param {String} draggable
 */

/**
 * set drag constraint
 * @name setDragConstraint
 * @methodOf Kinetic.Node.prototype
 * @param {String} constraint
 */

/**
 * set drag bounds
 * @name setDragBounds
 * @methodOf Kinetic.Node.prototype
 * @param {Object} bounds
 * @config {Number} [left] left bounds position
 * @config {Number} [top] top bounds position
 * @config {Number} [right] right bounds position
 * @config {Number} [bottom] bottom bounds position
 */

/**
 * listen or don't listen to events
 * @name setListening
 * @methodOf Kinetic.Node.prototype
 * @param {Boolean} listening
 */

/**
 * set node rotation in degrees
 * @name setRotationDeg
 * @methodOf Kinetic.Node.prototype
 * @param {Number} deg
 */

/**
 * set offset
 * @name setOffset
 * @methodOf Kinetic.Node.prototype
 * @param {Number} x
 * @param {Number} y
 */

/**
 * set node scale.
 * @name setScale
 * @param {Number|Array|Object|List} scale
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get scale
 * @name getScale
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get node x position
 * @name getX
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get node y position
 * @name getY
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get detection type
 * @name getDetectionType
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get rotation in radians
 * @name getRotation
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get alpha.  Alpha values range from 0 to 1.
 * A node with an alpha of 0 is fully transparent, and a node
 * with an alpha of 1 is fully opaque
 * @name getAlpha
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get name
 * @name getName
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get id
 * @name getId
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get offset
 * @name getOffset
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get draggable
 * @name getDraggable
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get drag constraint
 * @name getDragConstraint
 * @methodOf Kinetic.Node.prototype
 */

/**
 * get drag bounds
 * @name getDragBounds
 * @methodOf Kinetic.Node.prototype
 */

/**
 * determine if listening to events or not
 * @name getListening
 * @methodOf Kinetic.Node.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Container
///////////////////////////////////////////////////////////////////////
/**
 * Container constructor.&nbsp; Containers are used to contain nodes or other containers
 * @constructor
 * @augments Kinetic.Node
 * @param {Object} config
 */
Kinetic.Container = Kinetic.Node.extend({
    init: function(config) {
        this.children = [];
        this._super(config);
    },
    /**
     * get children
     * @name getChildren
     * @methodOf Kinetic.Container.prototype
     */
    getChildren: function() {
        return this.children;
    },
    /**
     * remove all children
     * @name removeChildren
     * @methodOf Kinetic.Container.prototype
     */
    removeChildren: function() {
        while(this.children.length > 0) {
            this.remove(this.children[0]);
        }
    },
    /**
     * add node to container
     * @name add
     * @methodOf Kinetic.Container.prototype
     * @param {Node} child
     */
    add: function(child) {
        child._id = Kinetic.Global.idCounter++;
        child.index = this.children.length;
        child.parent = this;

        this.children.push(child);

        var stage = child.getStage();
        if(stage === undefined) {
            var go = Kinetic.Global;
            go.tempNodes.push(child);
        }
        else {
            stage._addId(child);
            stage._addName(child);

            /*
             * pull in other nodes that are now linked
             * to a stage
             */
            var go = Kinetic.Global;
            go._pullNodes(stage);
        }

        // do extra stuff if needed
        if(this._add !== undefined) {
            this._add(child);
        }

        // chainable
        return this;
    },
    /**
     * remove child from container
     * @name remove
     * @methodOf Kinetic.Container.prototype
     * @param {Node} child
     */
    remove: function(child) {
        if(child && child.index !== undefined && this.children[child.index]._id == child._id) {
            var stage = this.getStage();
            if(stage !== undefined) {
                stage._removeId(child.getId());
                stage._removeName(child.getName(), child._id);
            }

            var go = Kinetic.Global;
            for(var n = 0; n < go.tempNodes.length; n++) {
                var node = go.tempNodes[n];
                if(node._id === child._id) {
                    go.tempNodes.splice(n, 1);
                    break;
                }
            }

            this.children.splice(child.index, 1);
            this._setChildrenIndices();

            // remove children
            while(child.children && child.children.length > 0) {
                child.remove(child.children[0]);
            }

            // do extra stuff if needed
            if(this._remove !== undefined) {
                this._remove(child);
            }
        }

        // chainable
        return this;
    },
    /**
     * return an array of nodes that match the selector.  Use '#' for id selections
     * and '.' for name selections
     * ex:
     * var node = stage.get('#foo'); // selects node with id foo
     * var nodes = layer.get('.bar'); // selects nodes with name bar inside layer
     * @name get
     * @methodOf Kinetic.Container.prototype
     * @param {String} selector
     */
    get: function(selector) {
        var stage = this.getStage();
        var arr;
        var key = selector.slice(1);
        if(selector.charAt(0) === '#') {
            arr = stage.ids[key] !== undefined ? [stage.ids[key]] : [];
        }
        else if(selector.charAt(0) === '.') {
            arr = stage.names[key] !== undefined ? stage.names[key] : [];
        }
        else if(selector === 'Shape' || selector === 'Group' || selector === 'Layer') {
            return this._getNodes(selector);
        }
        else {
            return false;
        }

        var retArr = [];
        for(var n = 0; n < arr.length; n++) {
            var node = arr[n];
            if(this.isAncestorOf(node)) {
                retArr.push(node);
            }
        }

        return retArr;
    },
    /**
     * determine if node is an ancestor
     * of descendant
     * @name isAncestorOf
     * @methodOf Kinetic.Container.prototype
     * @param {Kinetic.Node} node
     */
    isAncestorOf: function(node) {
        if(this.nodeType === 'Stage') {
            return true;
        }

        var parent = node.getParent();
        while(parent) {
            if(parent._id === this._id) {
                return true;
            }
            parent = parent.getParent();
        }

        return false;
    },
    /**
     * get shapes that intersect a point
     * @name getIntersections
     * @methodOf Kinetic.Container.prototype
     * @param {Object} point
     */
    getIntersections: function() {
        var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
        var arr = [];
        var shapes = this.get('Shape');

        for(var n = 0; n < shapes.length; n++) {
            var shape = shapes[n];
            if(shape.isVisible() && shape.intersects(pos)) {
                arr.push(shape);
            }
        }

        return arr;
    },
    /**
     * get all shapes inside container
     */
    _getNodes: function(sel) {
        var arr = [];
        function traverse(cont) {
            var children = cont.getChildren();
            for(var n = 0; n < children.length; n++) {
                var child = children[n];
                if(child.nodeType === sel) {
                    arr.push(child);
                }
                else if(child.nodeType !== 'Shape') {
                    traverse(child);
                }
            }
        }
        traverse(this);

        return arr;
    },
    /**
     * draw children
     */
    _drawChildren: function(layer) {
        var stage = this.getStage();
        var children = this.children;
        for(var n = 0; n < children.length; n++) {
            var child = children[n];
            if(child.nodeType === 'Shape') {
                if(child.isVisible() && stage.isVisible()) {
                    child._draw( layer ? layer : child.getLayer());
                }
            }
            else {
                child.draw(layer);
            }
        }
    },
    /**
     * set children indices
     */
    _setChildrenIndices: function() {
        /*
         * if reordering Layers, remove all canvas elements
         * from the container except the buffer and backstage canvases
         * and then readd all the layers
         */
        if(this.nodeType === 'Stage') {
            var canvases = this.content.children;
            var bufferCanvas = canvases[0];
            var backstageCanvas = canvases[1];

            this.content.innerHTML = '';
            this.content.appendChild(bufferCanvas);
            this.content.appendChild(backstageCanvas);
        }

        for(var n = 0; n < this.children.length; n++) {
            this.children[n].index = n;

            if(this.nodeType === 'Stage') {
                this.content.appendChild(this.children[n].canvas);
            }
        }
    }
});

///////////////////////////////////////////////////////////////////////
//  Stage
///////////////////////////////////////////////////////////////////////
/**
 * Stage constructor.  A stage is used to contain multiple layers and handle
 * animations
 * @constructor
 * @augments Kinetic.Container
 * @param {String|DomElement} cont Container id or DOM element
 * @param {int} width
 * @param {int} height
 */
Kinetic.Stage = Kinetic.Container.extend({
    init: function(config) {
        this.setDefaultAttrs({
            width: 400,
            height: 200,
            throttle: 80
        });

        /*
         * if container is a string, assume it's an id for
         * a DOM element
         */
        if( typeof config.container === 'string') {
            config.container = document.getElementById(config.container);
        }

        // call super constructor
        this._super(config);

        this._setStageDefaultProperties();
        this._id = Kinetic.Global.idCounter++;
        this._buildDOM();
        this._bindContentEvents();

        //change events
        this.on('widthChange.kinetic', function() {
            this._resizeDOM();
        });

        this.on('heightChange.kinetic', function() {
            this._resizeDOM();
        });
        var go = Kinetic.Global;
        go.stages.push(this);
        this._addId(this);
        this._addName(this);
    },
    /**
     * sets onFrameFunc for animation
     * @name onFrame
     * @methodOf Kinetic.Stage.prototype
     * @param {function} func
     */
    onFrame: function(func) {
        var id = undefined;
		if (this.anim) { 
		id = this.anim.id; 
		}
        this.anim = {
            func: func,
			id: id // set anim.id
        };
    },
    /**
     * start animation
     * @name start
     * @methodOf Kinetic.Stage.prototype
     */
    start: function() {
        if(!this.animRunning) {
            var a = Kinetic.Animation;
            a._addAnimation(this.anim);
            a._handleAnimation();
            this.animRunning = true;
        }
    },
    /**
     * stop animation
     * @name stop
     * @methodOf Kinetic.Stage.prototype
     */
    stop: function() {
        Kinetic.Animation._removeAnimation(this.anim);
        this.animRunning = false;
    },
    /**
     * draw children
     * @name draw
     * @methodOf Kinetic.Stage.prototype
     */
    draw: function(layer) {
        this._draw(layer);
    },
    /**
     * set stage size
     * @name setSize
     * @methodOf Kinetic.Stage.prototype
     */
    setSize: function() {
        // set stage dimensions
        var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setAttrs(size);
    },
    /**
     * return stage size
     * @name getSize
     * @methodOf Kinetic.Stage.prototype
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    },
    /**
     * clear all layers
     * @name clear
     * @methodOf Kinetic.Stage.prototype
     */
    clear: function() {
        var layers = this.children;
        for(var n = 0; n < layers.length; n++) {
            layers[n].clear();
        }
    },
    /**
     * serialize stage and children as a JSON object
     * @name toJSON
     * @methodOf Kinetic.Stage.prototype
     */
    toJSON: function() {
        var type = Kinetic.Type;

        function addNode(node) {
            var obj = {};

            obj.attrs = {};

            // serialize only attributes that are not function, image, DOM, or objects with methods
            for(var key in node.attrs) {
                var val = node.attrs[key];
                if(!type._isFunction(val) && !type._isElement(val) && !type._hasMethods(val)) {
                    obj.attrs[key] = val;
                }
            }

            obj.nodeType = node.nodeType;
            obj.shapeType = node.shapeType;

            if(node.nodeType !== 'Shape') {
                obj.children = [];

                var children = node.getChildren();
                for(var n = 0; n < children.length; n++) {
                    var child = children[n];
                    obj.children.push(addNode(child));
                }
            }

            return obj;
        }
        return JSON.stringify(addNode(this));
    },
    /**
     * reset stage to default state
     * @name reset
     * @methodOf Kinetic.Stage.prototype
     */
    reset: function() {
        // remove children
        this.removeChildren();

        // defaults
        this._setStageDefaultProperties();
        this.setAttrs(this.defaultNodeAttrs);
    },
    /**
     * load stage with JSON string.  De-serializtion does not generate custom
     *  shape drawing functions, images, or event handlers (this would make the
     * 	serialized object huge).  If your app uses custom shapes, images, and
     *  event handlers (it probably does), then you need to select the appropriate
     *  shapes after loading the stage and set these properties via on(), setDrawFunc(),
     *  and setImage()
     * @name load
     * @methodOf Kinetic.Stage.prototype
     * @param {String} JSON string
     */
    load: function(json) {
        this.reset();

        function loadNode(node, obj) {
            var children = obj.children;
            if(children !== undefined) {
                for(var n = 0; n < children.length; n++) {
                    var child = children[n];
                    var type;

                    // determine type
                    if(child.nodeType === 'Shape') {
                        // add custom shape
                        if(child.shapeType === undefined) {
                            type = 'Shape';
                        }
                        // add standard shape
                        else {
                            type = child.shapeType;
                        }
                    }
                    else {
                        type = child.nodeType;
                    }

                    var no = new Kinetic[type](child.attrs);
                    node.add(no);
                    loadNode(no, child);
                }
            }
        }
        var obj = JSON.parse(json);

        // copy over stage properties
        this.attrs = obj.attrs;

        loadNode(this, obj);
        this.draw();
    },
    /**
     * get mouse position for desktop apps
     * @name getMousePosition
     * @methodOf Kinetic.Stage.prototype
     * @param {Event} evt
     */
    getMousePosition: function(evt) {
        return this.mousePos;
    },
    /**
     * get touch position for mobile apps
     * @name getTouchPosition
     * @methodOf Kinetic.Stage.prototype
     * @param {Event} evt
     */
    getTouchPosition: function(evt) {
        return this.touchPos;
    },
    /**
     * get user position (mouse position or touch position)
     * @name getUserPosition
     * @methodOf Kinetic.Stage.prototype
     * @param {Event} evt
     */
    getUserPosition: function(evt) {
        return this.getTouchPosition() || this.getMousePosition();
    },
    /**
     * get container DOM element
     * @name getContainer
     * @methodOf Kinetic.Stage.prototype
     */
    getContainer: function() {
        return this.attrs.container;
    },
    /**
     * get stage
     * @name getStage
     * @methodOf Kinetic.Stage.prototype
     */
    getStage: function() {
        return this;
    },
    /**
     * get stage DOM node, which is a div element
     * with the class name "kineticjs-content"
     * @name getDOM
     * @methodOf Kinetic.Stage.prototype
     */
    getDOM: function() {
        return this.content;
    },
    /**
     * Creates a composite data URL and requires a callback because the stage
     *  toDataURL method is asynchronous. If MIME type is not
     *  specified, then "image/png" will result. For "image/jpeg", specify a quality
     *  level as quality (range 0.0 - 1.0).  Note that this method works
     *  differently from toDataURL() for other nodes because it generates an absolute dataURL
     *  based on what's draw onto the canvases for each layer, rather than drawing
     *  the current state of each node
     * @name toDataURL
     * @methodOf Kinetic.Stage.prototype
     * @param {Function} callback
     * @param {String} [mimeType]
     * @param {Number} [quality]
     */
    toDataURL: function(callback, mimeType, quality) {
        /*
         * we need to create a temp layer rather than using
         * the bufferLayer because the stage toDataURL method
         * is asynchronous, which means that other parts of the
         * code base could be updating or clearing the bufferLayer
         * while the stage toDataURL method is processing
         */
        var tempLayer = new Kinetic.Layer();
        tempLayer.getCanvas().width = this.attrs.width;
        tempLayer.getCanvas().height = this.attrs.height;
        tempLayer.parent = this;
        var tempCanvas = tempLayer.getCanvas();
        var tempContext = tempLayer.getContext();

        var layers = this.children;

        function drawLayer(n) {
            var layer = layers[n];
            var layerUrl;
            try {
                // If this call fails (due to browser bug, like in Firefox 3.6),
                // then revert to previous no-parameter image/png behavior
                layerUrl = layer.getCanvas().toDataURL(mimeType, quality);
            }
            catch(e) {
                layerUrl = layer.getCanvas().toDataURL();
            }

            var imageObj = new Image();
            imageObj.onload = function() {
                tempContext.drawImage(imageObj, 0, 0);

                if(n < layers.length - 1) {
                    drawLayer(n + 1);
                }
                else {
                    try {
                        // If this call fails (due to browser bug, like in Firefox 3.6),
                        // then revert to previous no-parameter image/png behavior
                        callback(tempLayer.getCanvas().toDataURL(mimeType, quality));
                    }
                    catch(e) {
                        callback(tempLayer.getCanvas().toDataURL());
                    }
                }
            };
            imageObj.src = layerUrl;
        }
        drawLayer(0);
    },
    /**
     * converts stage into an image.  Since the stage toImage() method
     *  is asynchronous, a callback function is required
     * @name toImage
     * @methodOf Kinetic.Stage.prototype
     * @param {Function} callback
     */
    toImage: function(callback) {
        this.toDataURL(function(dataUrl) {
            Kinetic.Type._getImage(dataUrl, function(img) {
                callback(img);
            });
        });
    },
    _resizeDOM: function() {
        var width = this.attrs.width;
        var height = this.attrs.height;

        // set content dimensions
        this.content.style.width = width + 'px';
        this.content.style.height = height + 'px';

        // set buffer layer and path layer sizes
        this.bufferLayer.getCanvas().width = width;
        this.bufferLayer.getCanvas().height = height;
        this.pathLayer.getCanvas().width = width;
        this.pathLayer.getCanvas().height = height;

        // set user defined layer dimensions
        var layers = this.children;
        for(var n = 0; n < layers.length; n++) {
            var layer = layers[n];
            layer.getCanvas().width = width;
            layer.getCanvas().height = height;
            layer.draw();
        }
    },
    /**
     * remove layer from stage
     * @param {Layer} layer
     */
    _remove: function(layer) {
        /*
         * remove canvas DOM from the document if
         * it exists
         */
        try {
            this.content.removeChild(layer.canvas);
        }
        catch(e) {
        }
    },
    /**
     * add layer to stage
     * @param {Layer} layer
     */
    _add: function(layer) {
        layer.canvas.width = this.attrs.width;
        layer.canvas.height = this.attrs.height;

        // draw layer and append canvas to container
        layer.draw();
        this.content.appendChild(layer.canvas);

        /*
         * set layer last draw time to zero
         * so that throttling doesn't take into account
         * the layer draws associated with adding a node
         */
        layer.lastDrawTime = 0;
    },
    /**
     * detect event
     * @param {Shape} shape
     */
    _detectEvent: function(shape, evt) {
        var isDragging = Kinetic.Global.drag.moving;
        var go = Kinetic.Global;
        var pos = this.getUserPosition();
        var el = shape.eventListeners;
        var that = this;

        if(this.targetShape && shape._id === this.targetShape._id) {
            this.targetFound = true;
        }

        if(shape.isVisible() && pos !== undefined && shape.intersects(pos)) {
            // handle onmousedown
            if(!isDragging && this.mouseDown) {
                this.mouseDown = false;
                this.clickStart = true;
                shape._handleEvent('mousedown', evt);
                return true;
            }
            // handle onmouseup & onclick
            else if(this.mouseUp) {
                this.mouseUp = false;
                shape._handleEvent('mouseup', evt);

                // detect if click or double click occurred
                if(this.clickStart) {
                    /*
                     * if dragging and dropping, don't fire click or dbl click
                     * event
                     */
                    if((!go.drag.moving) || !go.drag.node) {
                        shape._handleEvent('click', evt);

                        if(this.inDoubleClickWindow) {
                            shape._handleEvent('dblclick', evt);
                        }
                        this.inDoubleClickWindow = true;
                        setTimeout(function() {
                            that.inDoubleClickWindow = false;
                        }, this.dblClickWindow);
                    }
                }
                return true;
            }

            // handle touchstart
            else if(!isDragging && this.touchStart && !this.touchMove) {
                this.touchStart = false;
                this.tapStart = true;
                shape._handleEvent('touchstart', evt);
                return true;
            }
            // handle touchend & tap
            else if(this.touchEnd) {
                this.touchEnd = false;
                shape._handleEvent('touchend', evt);

                // detect if tap or double tap occurred
                if(this.tapStart) {
                    /*
                     * if dragging and dropping, don't fire tap or dbltap
                     * event
                     */
                    if((!go.drag.moving) || !go.drag.node) {
                        shape._handleEvent('tap', evt);

                        if(this.inDoubleClickWindow) {
                            shape._handleEvent('dbltap', evt);
                        }
                        this.inDoubleClickWindow = true;
                        setTimeout(function() {
                            that.inDoubleClickWindow = false;
                        }, this.dblClickWindow);
                    }
                }
                return true;
            }
            else if(!isDragging && this.touchMove) {
                shape._handleEvent('touchmove', evt);
                return true;
            }
            /*
            * NOTE: these event handlers require target shape
            * handling
            */
            // handle onmouseover
            else if(!isDragging && this._isNewTarget(shape, evt)) {
                /*
                 * check to see if there are stored mouseout events first.
                 * if there are, run those before running the onmouseover
                 * events
                 */
                if(this.mouseoutShape) {
                    this.mouseoverShape = shape;
                    this.mouseoutShape._handleEvent('mouseout', evt);
                    this.mouseoverShape = undefined;
                }

                shape._handleEvent('mouseover', evt);
                this._setTarget(shape);
                return true;
            }
            // handle mousemove and touchmove
            else {
                if(!isDragging && this.mouseMove) {
                    shape._handleEvent('mousemove', evt);
                    return true;
                }
            }

        }
        // handle mouseout condition
        else if(!isDragging && this.targetShape && this.targetShape._id === shape._id) {
            this._setTarget(undefined);
            this.mouseoutShape = shape;
            return true;
        }

        return false;
    },
    /**
     * set new target
     */
    _setTarget: function(shape) {
        this.targetShape = shape;
        this.targetFound = true;
    },
    /**
     * check if shape should be a new target
     */
    _isNewTarget: function(shape, evt) {
        if(!this.targetShape || (!this.targetFound && shape._id !== this.targetShape._id)) {
            /*
             * check if old target has an onmouseout event listener
             */
            if(this.targetShape) {
                var oldEl = this.targetShape.eventListeners;
                if(oldEl) {
                    this.mouseoutShape = this.targetShape;
                }
            }
            return true;
        }
        else {
            return false;
        }
    },
    /**
     * traverse container children
     * @param {Container} obj
     */
    _traverseChildren: function(obj, evt) {
        var children = obj.children;
        // propapgate backwards through children
        for(var i = children.length - 1; i >= 0; i--) {
            var child = children[i];
            if(child.getListening()) {
                if(child.nodeType === 'Shape') {
                    var exit = this._detectEvent(child, evt);
                    if(exit) {
                        return true;
                    }
                }
                else {
                    var exit = this._traverseChildren(child, evt);
                    if(exit) {
                        return true;
                    }
                }
            }
        }

        return false;
    },
    /**
     * handle incoming event
     * @param {Event} evt
     */
    _handleStageEvent: function(evt) {
        var date = new Date();
        var time = date.getTime();
        this.lastEventTime = time;

        var go = Kinetic.Global;
        if(!evt) {
            evt = window.event;
        }

        this._setMousePosition(evt);
        this._setTouchPosition(evt);
        this.pathLayer.clear();

        /*
         * loop through layers.  If at any point an event
         * is triggered, break out
         */
        this.targetFound = false;
        var shapeDetected = false;
        for(var n = this.children.length - 1; n >= 0; n--) {
            var layer = this.children[n];
            if(layer.isVisible() && n >= 0 && layer.getListening()) {
                if(this._traverseChildren(layer, evt)) {
                    shapeDetected = true;
                    break;
                }
            }
        }

        /*
         * if no shape was detected and a mouseout shape has been stored,
         * then run the onmouseout event handlers
         */
        if(!shapeDetected && this.mouseoutShape) {
            this.mouseoutShape._handleEvent('mouseout', evt);
            this.mouseoutShape = undefined;
        }
    },
    /**
     * begin listening for events by adding event handlers
     * to the container
     */
    _bindContentEvents: function() {
        var go = Kinetic.Global;
        var that = this;

        var events = ['mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'touchstart', 'touchmove', 'touchend'];

        for(var n = 0; n < events.length; n++) {
            var pubEvent = events[n];
            // induce scope
            ( function() {
                var event = pubEvent;
                that.content.addEventListener(event, function(evt) {
                    that['_' + event](evt);
                }, false);
            }());
        }
    },
    _mouseover: function(evt) {
        this._handleStageEvent(evt);
    },
    _mouseout: function(evt) {
        // if there's a current target shape, run mouseout handlers
        var targetShape = this.targetShape;
        if(targetShape) {
            targetShape._handleEvent('mouseout', evt);
            this.targetShape = undefined;
        }
        this.mousePos = undefined;

        // end drag and drop
        this._endDrag(evt);
    },
    _mousemove: function(evt) {
        //throttle mousemove
        var throttle = this.attrs.throttle;
        var date = new Date();
        var time = date.getTime();
        var timeDiff = time - this.lastEventTime;
        var tt = 1000 / throttle;

        if(timeDiff >= tt || throttle > 200) {
            this.mouseDown = false;
            this.mouseUp = false;
            this.mouseMove = true;
            this._handleStageEvent(evt);
        }

        // start drag and drop
        this._startDrag(evt);
    },
    _mousedown: function(evt) {
        this.mouseDown = true;
        this.mouseUp = false;
        this.mouseMove = false;
        this._handleStageEvent(evt);

        //init stage drag and drop
        if(this.attrs.draggable) {
            this._initDrag();
        }
    },
    _mouseup: function(evt) {
        this.mouseDown = false;
        this.mouseUp = true;
        this.mouseMove = false;
        this._handleStageEvent(evt);
        this.clickStart = false;

        // end drag and drop
        this._endDrag(evt);
    },
    _touchstart: function(evt) {
        evt.preventDefault();
        this.touchStart = true;
        this.touchEnd = false;
        this.touchMove = false;
        this._handleStageEvent(evt);
        /*
         * init stage drag and drop
         */
        if(this.attrs.draggable) {
            this._initDrag();
        }
    },
    _touchend: function(evt) {
        this.touchStart = false;
        this.touchEnd = true;
        this.touchMove = false;
        this._handleStageEvent(evt);
        this.tapStart = false;

        // end drag and drop
        this._endDrag(evt);
    },
    _touchmove: function(evt) {
        //throttle touchmove
        var that = this;
        var throttle = this.attrs.throttle;
        var date = new Date();
        var time = date.getTime();
        var timeDiff = time - this.lastEventTime;
        var tt = 1000 / throttle;

        if(timeDiff >= tt || throttle > 200) {
            evt.preventDefault();
            that.touchEnd = false;
            that.touchMove = true;
            that._handleStageEvent(evt);
        }

        // start drag and drop
        this._startDrag(evt);
    },
    /**
     * set mouse positon for desktop apps
     * @param {Event} evt
     */
    _setMousePosition: function(evt) {
        var mouseX = evt.offsetX || (evt.clientX - this._getContentPosition().left + window.pageXOffset);
        var mouseY = evt.offsetY || (evt.clientY - this._getContentPosition().top + window.pageYOffset);
        this.mousePos = {
            x: mouseX,
            y: mouseY
        };
    },
    /**
     * set touch position for mobile apps
     * @param {Event} evt
     */
    _setTouchPosition: function(evt) {
        if(evt.touches !== undefined && evt.touches.length === 1) {// Only deal with
            // one finger
            var touch = evt.touches[0];
            // Get the information for finger #1
            var touchX = touch.clientX - this._getContentPosition().left + window.pageXOffset;
            var touchY = touch.clientY - this._getContentPosition().top + window.pageYOffset;

            this.touchPos = {
                x: touchX,
                y: touchY
            };
        }
    },
    /**
     * get container position
     */
    _getContentPosition: function() {
        var obj = this.content;
        var top = 0;
        var left = 0;
        while(obj && obj.tagName !== 'BODY') {
            top += obj.offsetTop - obj.scrollTop;
            left += obj.offsetLeft - obj.scrollLeft;
            obj = obj.offsetParent;
        }
        return {
            top: top,
            left: left
        };
    },
    /**
     * modify path context
     * @param {CanvasContext} context
     */
    _modifyPathContext: function(context) {
        context.stroke = function() {
        };
        context.fill = function() {
        };
        context.fillRect = function(x, y, width, height) {
            context.rect(x, y, width, height);
        };
        context.strokeRect = function(x, y, width, height) {
            context.rect(x, y, width, height);
        };
        context.drawImage = function() {
        };
        context.fillText = function() {
        };
        context.strokeText = function() {
        };
    },
    /**
     * end drag and drop
     */
    _endDrag: function(evt) {
        var go = Kinetic.Global;
        if(go.drag.node) {
            // handle dragend
            if(go.drag.moving) {
                go.drag.moving = false;
                go.drag.node._handleEvent('dragend', evt);
            }
        }
        go.drag.node = undefined;
    },
    /**
     * start drag and drop
     */
    _startDrag: function(evt) {
        var that = this;
        var go = Kinetic.Global;
        var node = go.drag.node;

        if(node) {
            var pos = that.getUserPosition();
            var dc = node.attrs.dragConstraint;
            var db = node.attrs.dragBounds;
            var lastNodePos = {
                x: node.attrs.x,
                y: node.attrs.y
            };

            // default
            var newNodePos = {
                x: pos.x - go.drag.offset.x,
                y: pos.y - go.drag.offset.y
            };

            // bounds overrides
            if(db.left !== undefined && newNodePos.x < db.left) {
                newNodePos.x = db.left;
            }
            if(db.right !== undefined && newNodePos.x > db.right) {
                newNodePos.x = db.right;
            }
            if(db.top !== undefined && newNodePos.y < db.top) {
                newNodePos.y = db.top;
            }
            if(db.bottom !== undefined && newNodePos.y > db.bottom) {
                newNodePos.y = db.bottom;
            }

            node.setAbsolutePosition(newNodePos);

            // constraint overrides
            if(dc === 'horizontal') {
                node.attrs.y = lastNodePos.y;
            }
            else if(dc === 'vertical') {
                node.attrs.x = lastNodePos.x;
            }

            /*
             * if dragging and dropping the stage,
             * draw all of the layers
             */
            if(go.drag.node.nodeType === 'Stage') {
                go.drag.node.draw();
            }

            else {
                go.drag.node.getLayer().draw();
            }

            if(!go.drag.moving) {
                go.drag.moving = true;
                // execute dragstart events if defined
                go.drag.node._handleEvent('dragstart', evt);
            }

            // execute user defined ondragmove if defined
            go.drag.node._handleEvent('dragmove', evt);
        }
    },
    /**
     * build dom
     */
    _buildDOM: function() {
        // content
        this.content = document.createElement('div');
        this.content.style.position = 'relative';
        this.content.style.display = 'inline-block';
        this.content.className = 'kineticjs-content';
        this.attrs.container.appendChild(this.content);

        // default layers
        this.bufferLayer = new Kinetic.Layer({
            name: 'bufferLayer'
        });
        this.pathLayer = new Kinetic.Layer({
            name: 'pathLayer'
        });

        // set parents
        this.bufferLayer.parent = this;
        this.pathLayer.parent = this;

        // customize back stage context
        this._modifyPathContext(this.pathLayer.context);

        // hide canvases
        this.bufferLayer.getCanvas().style.display = 'none';
        this.pathLayer.getCanvas().style.display = 'none';

        // add buffer layer
        this.bufferLayer.canvas.className = 'kineticjs-buffer-layer';
        this.content.appendChild(this.bufferLayer.canvas);

        // add path layer
        this.pathLayer.canvas.className = 'kineticjs-path-layer';
        this.content.appendChild(this.pathLayer.canvas);

        this.setSize(this.attrs.width, this.attrs.height);
        this._resizeDOM();
    },
    _addId: function(node) {
        if(node.attrs.id !== undefined) {
            this.ids[node.attrs.id] = node;
        }
    },
    _removeId: function(id) {
        if(id !== undefined) {
            delete this.ids[id];
        }
    },
    _addName: function(node) {
        var name = node.attrs.name;
        if(name !== undefined) {
            if(this.names[name] === undefined) {
                this.names[name] = [];
            }
            this.names[name].push(node);
        }
    },
    _removeName: function(name, _id) {
        if(name !== undefined) {
            var nodes = this.names[name];
            if(nodes !== undefined) {
                for(var n = 0; n < nodes.length; n++) {
                    var no = nodes[n];
                    if(no._id === _id) {
                        nodes.splice(n, 1);
                    }
                }
                if(nodes.length === 0) {
                    delete this.names[name];
                }
            }
        }
    },
    /**
     * bind event listener to container DOM element
     * @param {String} typesStr
     * @param {function} handler
     */
    _onContent: function(typesStr, handler) {
        var types = typesStr.split(' ');
        for(var n = 0; n < types.length; n++) {
            var baseEvent = types[n];
            this.content.addEventListener(baseEvent, handler, false);
        }
    },
    /**
     * set defaults
     */
    _setStageDefaultProperties: function() {
        this.nodeType = 'Stage';
        this.lastEventTime = 0;
        this.dblClickWindow = 400;
        this.targetShape = undefined;
        this.targetFound = false;
        this.mouseoverShape = undefined;
        this.mouseoutShape = undefined;

        // desktop flags
        this.mousePos = undefined;
        this.mouseDown = false;
        this.mouseUp = false;
        this.mouseMove = false;
        this.clickStart = false;

        // mobile flags
        this.touchPos = undefined;
        this.touchStart = false;
        this.touchEnd = false;
        this.touchMove = false;
        this.tapStart = false;

        this.ids = {};
        this.names = {};
        this.anim = undefined;
        this.animRunning = false;
    },
    _draw: function(layer) {
        this._drawChildren(layer);
    }
});

// add getters and setters
Kinetic.Node.addGettersSetters(Kinetic.Stage, ['width', 'height', 'throttle']);

/**
 * get width
 * @name getWidth
 * @methodOf Kinetic.Stage.prototype
 */

/**
 * get height
 * @name getHeight
 * @methodOf Kinetic.Stage.prototype
 */

/**
 * get throttle
 * @name getThrottle
 * @methodOf Kinetic.Stage.prototype
 */

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Stage.prototype
 * @param {Number} width
 */

/**
 * set height
 * @name setHeight
 * @methodOf Kinetic.Stage.prototype
 * @param {Number} height
 */

/**
 * set throttle.  Increasing the throttle will increase
 *  the number of mousemove and touchmove event detections,
 *  and decreasing the throttle will decrease the number
 *  of mousemove and touchmove events which improves performance
 * @name setThrottle
 * @methodOf Kinetic.Stage.prototype
 * @param {Number} throttle
 */
///////////////////////////////////////////////////////////////////////
//  Layer
///////////////////////////////////////////////////////////////////////
/**
 * Layer constructor.  Layers are tied to their own canvas element and are used
 * to contain groups or shapes
 * @constructor
 * @augments Kinetic.Container
 * @param {Object} config
 */
Kinetic.Layer = Kinetic.Container.extend({
    init: function(config) {
        this.setDefaultAttrs({
            throttle: 80,
            clearBeforeDraw: true
        });

        this.nodeType = 'Layer';
        this.lastDrawTime = 0;
        this.beforeDrawFunc = undefined;
        this.afterDrawFunc = undefined;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';

        // call super constructor
        this._super(config);
    },
    /**
     * draw children nodes.  this includes any groups
     *  or shapes
     * @name draw
     * @methodOf Kinetic.Layer.prototype
     */
    draw: function(layer) {
        var throttle = this.attrs.throttle;
        var date = new Date();
        var time = date.getTime();
        var timeDiff = time - this.lastDrawTime;
        var tt = 1000 / throttle;

        if(timeDiff >= tt || throttle > 200) {
            this._draw(layer);

            if(this.drawTimeout !== undefined) {
                clearTimeout(this.drawTimeout);
                this.drawTimeout = undefined;
            }
        }
        /*
         * if we cannot draw the layer due to throttling,
         * try to redraw the layer in the near future
         */
        else if(this.drawTimeout === undefined) {
            var that = this;
            /*
             * wait 17ms before trying again (60fps)
             */
            this.drawTimeout = setTimeout(function() {
                that.draw(layer);
            }, 17);
        }
    },
    /**
     * set before draw function handler
     * @name beforeDraw
     * @methodOf Kinetic.Layer.prototype
     */
    beforeDraw: function(func) {
        this.beforeDrawFunc = func;
    },
    /**
     * set after draw function handler
     * @name afterDraw
     * @methodOf Kinetic.Layer.prototype
     */
    afterDraw: function(func) {
        this.afterDrawFunc = func;
    },
    /**
     * clears the canvas context tied to the layer.  Clearing
     *  a layer does not remove its children.  The nodes within
     *  the layer will be redrawn whenever the .draw() method
     *  is used again.
     * @name clear
     * @methodOf Kinetic.Layer.prototype
     */
    clear: function() {
        var context = this.getContext();
        var canvas = this.getCanvas();
        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    /**
     * get layer canvas
     * @name getCanvas
     * @methodOf Kinetic.Layer.prototype
     */
    getCanvas: function() {
        return this.canvas;
    },
    /**
     * get layer context
     * @name getContext
     * @methodOf Kinetic.Layer.prototype
     */
    getContext: function() {
        return this.context;
    },
    /**
     * Creates a composite data URL. If MIME type is not
     * specified, then "image/png" will result. For "image/jpeg", specify a quality
     * level as quality (range 0.0 - 1.0).  Note that this method works
     * differently from toDataURL() for other nodes because it generates an absolute dataURL
     * based on what's draw on the layer, rather than drawing
     * the current state of each child node
     * @name toDataURL
     * @methodOf Kinetic.Stage.prototype
     * @param {String} [mimeType]
     * @param {Number} [quality]
     */
    toDataURL: function(mimeType, quality) {
        try {
            // If this call fails (due to browser bug, like in Firefox 3.6),
            // then revert to previous no-parameter image/png behavior
            return this.getCanvas().toDataURL(mimeType, quality);
        }
        catch(e) {
            return this.getCanvas().toDataURL();
        }
    },
    /**
     * private draw children
     */
    _draw: function(layer) {
        var date = new Date();
        var time = date.getTime();
        this.lastDrawTime = time;

        // before draw  handler
        if(this.beforeDrawFunc !== undefined) {
            this.beforeDrawFunc.call(this);
        }

        if(this.attrs.clearBeforeDraw) {
            var clearLayer = layer ? layer : this;
            clearLayer.clear();
        }

        if(this.isVisible()) {
            // draw custom func
            if(this.attrs.drawFunc !== undefined) {
                this.attrs.drawFunc.call(this);
            }

            // draw children
            this._drawChildren(layer);
        }

        // after draw  handler
        if(this.afterDrawFunc !== undefined) {
            this.afterDrawFunc.call(this);
        }
    }
});

// add getters and setters
Kinetic.Node.addGettersSetters(Kinetic.Layer, ['clearBeforeDraw', 'throttle']);

/**
 * set flag which determines if the layer is cleared or not
 *  before drawing
 * @name setClearBeforeDraw
 * @methodOf Kinetic.Layer.prototype
 * @param {Boolean} clearBeforeDraw
 */

/**
 * set throttle
 * @name setThrottle
 * @methodOf Kinetic.Layer.prototype
 * @param {Number} throttle
 */

/**
 * get flag which determines if the layer is cleared or not
 *  before drawing
 * @name getClearBeforeDraw
 * @methodOf Kinetic.Layer.prototype
 */

/**
 * get throttle
 * @name getThrottle
 * @methodOf Kinetic.Layer.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Group
///////////////////////////////////////////////////////////////////////
/**
 * Group constructor.  Groups are used to contain shapes or other groups.
 * @constructor
 * @augments Kinetic.Container
 * @param {Object} config
 */
Kinetic.Group = Kinetic.Container.extend({
    init: function(config) {
        this.nodeType = 'Group';

        // call super constructor
        this._super(config);
    },
    draw: function(layer) {
        this._draw(layer);
    },
    _draw: function(layer) {
        if(this.attrs.visible) {
            this._drawChildren(layer);
        }
    }
});

///////////////////////////////////////////////////////////////////////
//  Shape
///////////////////////////////////////////////////////////////////////
/**
 * Shape constructor.  Shapes are used to objectify drawing bits of a KineticJS
 * application
 * @constructor
 * @augments Kinetic.Node
 * @param {Object} config
 * @config {String|Object} [fill] can be a string color, a linear gradient object, a radial
 *  gradient object, or a pattern object.
 * @config {String} [stroke] stroke color
 * @config {Number} [strokeWidth] stroke width
 * @config {String} [lineJoin] line join can be "miter", "round", or "bevel".  The default
 *  is "miter"
 * @config {Object} [shadow] shadow object
 * @config {String} [detectionType] shape detection type.  Can be "path" or "pixel".
 *  The default is "path" because it performs better
 */
Kinetic.Shape = Kinetic.Node.extend({
    init: function(config) {
        this.setDefaultAttrs({
            detectionType: 'path'
        });

        this.nodeType = 'Shape';
        this.appliedShadow = false;

        // call super constructor
        this._super(config);
    },
    /**
     * get layer context where the shape is being drawn.  When
     * the shape is being rendered, .getContext() returns the context of the
     * user created layer that contains the shape.  When the event detection
     * engine is determining whether or not an event has occured on that shape,
     * .getContext() returns the context of the invisible path layer.
     * @name getContext
     * @methodOf Kinetic.Shape.prototype
     */
    getContext: function() {
        return this.tempLayer.getContext();
    },
    /**
     * get shape temp layer canvas
     * @name getCanvas
     * @methodOf Kinetic.Shape.prototype
     */
    getCanvas: function() {
        return this.tempLayer.getCanvas();
    },
    /**
     * helper method to stroke the shape and apply
     * shadows if needed
     * @name stroke
     * @methodOf Kinetic.Shape.prototype
     */
    stroke: function() {
        var go = Kinetic.Global;
        var appliedShadow = false;
        var context = this.getContext();

        if(this.attrs.stroke || this.attrs.strokeWidth) {
            context.save();
            if(this.attrs.shadow && !this.appliedShadow) {
                appliedShadow = this._applyShadow();
            }

            var stroke = this.attrs.stroke ? this.attrs.stroke : 'black';
            var strokeWidth = this.attrs.strokeWidth ? this.attrs.strokeWidth : 2;

            context.lineWidth = strokeWidth;
            context.strokeStyle = stroke;
            context.stroke();
            context.restore();
        }

        if(appliedShadow) {
            this.stroke();
        }
    },
    /**
     * helper method to fill the shape with a color, linear gradient,
     * radial gradient, or pattern, and also apply shadows if needed
     * @name fill
     * @methodOf Kinetic.Shape.prototype
     * */
    fill: function() {
        var appliedShadow = false;
        var context = this.getContext();
        context.save();

        var fill = this.attrs.fill;

        if(fill) {
            if(this.attrs.shadow && !this.appliedShadow) {
                appliedShadow = this._applyShadow();
            }

            var s = fill.start;
            var e = fill.end;
            var f = null;

            // color fill
            if( typeof fill == 'string') {
                f = this.attrs.fill;
                context.fillStyle = f;
                context.fill();
            }
            // pattern
            else if(fill.image) {
                var repeat = !fill.repeat ? 'repeat' : fill.repeat;
                f = context.createPattern(fill.image, repeat);

                context.save();

                if(fill.scale) {
                    context.scale(fill.scale.x, fill.scale.y);
                }
                if(fill.offset) {
                    context.translate(fill.offset.x, fill.offset.y);
                }

                context.fillStyle = f;
                context.fill();
                context.restore();
            }
            // linear gradient
            else if(!s.radius && !e.radius) {
                var context = this.getContext();
                var grd = context.createLinearGradient(s.x, s.y, e.x, e.y);
                var colorStops = fill.colorStops;

                // build color stops
                for(var n = 0; n < colorStops.length; n += 2) {
                    grd.addColorStop(colorStops[n], colorStops[n + 1]);
                }
                f = grd;
                context.fillStyle = f;
                context.fill();
            }
            // radial gradient
            else if((s.radius || s.radius === 0) && (e.radius || e.radius === 0)) {
                var context = this.getContext();
                var grd = context.createRadialGradient(s.x, s.y, s.radius, e.x, e.y, e.radius);
                var colorStops = fill.colorStops;

                // build color stops
                for(var n = 0; n < colorStops.length; n += 2) {
                    grd.addColorStop(colorStops[n], colorStops[n + 1]);
                }
                f = grd;
                context.fillStyle = f;
                context.fill();
            }
            else {
                f = 'black';
                context.fillStyle = f;
                context.fill();
            }
        }
        context.restore();

        if(appliedShadow) {
            this.fill();
        }
    },
    /**
     * helper method to fill text and appy shadows if needed
     * @param {String} text
     * @name fillText
     * @methodOf Kinetic.Shape.prototype
     */
    fillText: function(text) {
        var appliedShadow = false;
        var context = this.getContext();
        context.save();
        if(this.attrs.textFill) {
            if(this.attrs.shadow && !this.appliedShadow) {
                appliedShadow = this._applyShadow();
            }
            context.fillStyle = this.attrs.textFill;
            context.fillText(text, 0, 0);
        }
        context.restore();

        if(appliedShadow) {
            this.fillText(text, 0, 0);
        }
    },
    /**
     * helper method to stroke text and apply shadows
     * if needed
     * @name strokeText
     * @methodOf Kinetic.Shape.prototype
     * @param {String} text
     */
    strokeText: function(text) {
        var appliedShadow = false;
        var context = this.getContext();
        context.save();
        if(this.attrs.textStroke || this.attrs.textStrokeWidth) {
            if(this.attrs.shadow && !this.appliedShadow) {
                appliedShadow = this._applyShadow();
            }

            // defaults
            if(!this.attrs.textStroke) {
                this.attrs.textStroke = 'black';
            }
            else if(!this.attrs.textStrokeWidth && this.attrs.textStrokeWidth !== 0) {
                this.attrs.textStrokeWidth = 2;
            }
            context.lineWidth = this.attrs.textStrokeWidth;
            context.strokeStyle = this.attrs.textStroke;
            context.strokeText(text, 0, 0);
        }
        context.restore();

        if(appliedShadow) {
            this.strokeText(text, 0, 0);
        }
    },
    /**
     * helper method to draw an image and apply
     * a shadow if neede
     * @name drawImage
     * @methodOf Kinetic.Shape.prototype
     */
    drawImage: function() {
        var appliedShadow = false;
        var context = this.getContext();
        context.save();
        var a = Array.prototype.slice.call(arguments);

        if(a.length === 5 || a.length === 9) {
            if(this.attrs.shadow && !this.appliedShadow) {
                appliedShadow = this._applyShadow();
            }
            switch(a.length) {
                case 5:
                    context.drawImage(a[0], a[1], a[2], a[3], a[4]);
                    break;
                case 9:
                    context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
                    break;
            }
        }

        context.restore();

        if(appliedShadow) {
            this.drawImage.apply(this, a);
        }
    },
    /**
     * helper method to set the line join of a shape
     * based on the lineJoin property
     * @name applyLineJoin
     * @methodOf Kinetic.Shape.prototype
     */
    applyLineJoin: function() {
        var context = this.getContext();
        if(this.attrs.lineJoin) {
            context.lineJoin = this.attrs.lineJoin;
        }
    },
    /**
     * apply shadow.  return true if shadow was applied
     * and false if it was not
     */
    _applyShadow: function() {
        var context = this.getContext();
        var s = this.attrs.shadow;
        if(s) {
            var aa = this.getAbsoluteAlpha();
            // defaults
            var color = s.color ? s.color : 'black';
            var blur = s.blur ? s.blur : 5;
            var offset = s.offset ? s.offset : {
                x: 0,
                y: 0
            };

            if(s.alpha) {
                context.globalAlpha = s.alpha * aa;
            }
            context.shadowColor = color;
            context.shadowBlur = blur;
            context.shadowOffsetX = offset.x;
            context.shadowOffsetY = offset.y;
            this.appliedShadow = true;
            return true;
        }

        return false;
    },
    /**
     * determines if point is in the shape
     * @param {Object|Array} point point can be an object containing
     *  an x and y property, or it can be an array with two elements
     *  in which the first element is the x component and the second
     *  element is the y component
     */
    intersects: function() {
        var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
        var stage = this.getStage();

        // path detection
        if(this.attrs.detectionType === 'path') {
            var pathLayer = stage.pathLayer;
            var pathLayerContext = pathLayer.getContext();

            this._draw(pathLayer);

            return pathLayerContext.isPointInPath(pos.x, pos.y);
        }

        // pixel detection
        if(this.imageData) {
            var w = stage.attrs.width;
            var alpha = this.imageData.data[((w * pos.y) + pos.x) * 4 + 3];
            return (alpha);
        }

        // default
        return false;
    },
    _draw: function(layer) {
        if(layer && this.attrs.drawFunc) {
            var stage = layer.getStage();
            var context = layer.getContext();
            var family = [];
            var parent = this.parent;

            family.unshift(this);
            while(parent) {
                family.unshift(parent);
                parent = parent.parent;
            }

            context.save();
            for(var n = 0; n < family.length; n++) {
                var node = family[n];
                var t = node.getTransform();

                var m = t.getMatrix();
                context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            }

            this.tempLayer = layer;

            /*
             * pre styles include alpha, linejoin
             */
            var absAlpha = this.getAbsoluteAlpha();
            if(absAlpha !== 1) {
                context.globalAlpha = absAlpha;
            }
            this.applyLineJoin();

            // draw the shape
            this.appliedShadow = false;
            this.attrs.drawFunc.call(this);
            context.restore();
        }
    }
});

// add getters and setters
Kinetic.Node.addGettersSetters(Kinetic.Shape, ['fill', 'stroke', 'lineJoin', 'strokeWidth', 'shadow', 'drawFunc', 'filter']);

/**
 * set fill which can be a color, linear gradient object,
 *  radial gradient object, or pattern object
 * @name setFill
 * @methodOf Kinetic.Shape.prototype
 * @param {String|Object} fill
 */

/**
 * set stroke color
 * @name setStroke
 * @methodOf Kinetic.Shape.prototype
 * @param {String} stroke
 */

/**
 * set line join
 * @name setLineJoin
 * @methodOf Kinetic.Shape.prototype
 * @param {String} lineJoin.  Can be miter, round, or bevel.  The
 *  default is miter
 */

/**
 * set stroke width
 * @name setStrokeWidth
 * @methodOf Kinetic.Shape.prototype
 * @param {Number} strokeWidth
 */

/**
 * set shadow object
 * @name setShadow
 * @methodOf Kinetic.Shape.prototype
 * @param {Object} config
 */

/**
 * set draw function
 * @name setDrawFunc
 * @methodOf Kinetic.Shape.prototype
 * @param {Function} drawFunc drawing function
 */

/**
 * get fill
 * @name getFill
 * @methodOf Kinetic.Shape.prototype
 */

/**
 * get stroke color
 * @name getStrokeColor
 * @methodOf Kinetic.Shape.prototype
 */

/**
 * get line join
 * @name getLineJoin
 * @methodOf Kinetic.Shape.prototype
 */

/**
 * get stroke width
 * @name getStrokeWidth
 * @methodOf Kinetic.Shape.prototype
 */

/**
 * get shadow object
 * @name getShadow
 * @methodOf Kinetic.Shape.prototype
 */

/**
 * get draw function
 * @name getDrawFunc
 * @methodOf Kinetic.Shape.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Rect
///////////////////////////////////////////////////////////////////////
/**
 * Rect constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Rect = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            width: 0,
            height: 0,
            cornerRadius: 0
        });

        this.shapeType = "Rect";

        config.drawFunc = function() {
            var context = this.getContext();
            context.beginPath();
            if(this.attrs.cornerRadius === 0) {
                // simple rect - don't bother doing all that complicated maths stuff.
                context.rect(0, 0, this.attrs.width, this.attrs.height);
            }
            else {
                // arcTo would be nicer, but browser support is patchy (Opera)
                context.moveTo(this.attrs.cornerRadius, 0);
                context.lineTo(this.attrs.width - this.attrs.cornerRadius, 0);
                context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(this.attrs.width, this.attrs.height - this.attrs.cornerRadius);
                context.arc(this.attrs.width - this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(this.attrs.cornerRadius, this.attrs.height);
                context.arc(this.attrs.cornerRadius, this.attrs.height - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, this.attrs.cornerRadius);
                context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();

            this.fill();
            this.stroke();
        };
        // call super constructor
        this._super(config);
    },
    /**
     * set width and height
     * @name setSize
     * @methodOf Kinetic.Rect.prototype
     */
    setSize: function() {
        var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
        this.setAttrs(size);
    },
    /**
     * return rect size
     * @name getSize
     * @methodOf Kinetic.Rect.prototype
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Rect, ['width', 'height', 'cornerRadius']);

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Rect.prototype
 * @param {Number} width
 */

/**
 * set height
 * @name setHeight
 * @methodOf Kinetic.Rect.prototype
 * @param {Number} height
 */

/**
 * set corner radius
 * @name setCornerRadius
 * @methodOf Kinetic.Rect.prototype
 * @param {Number} radius
 */

/**
 * get width
 * @name getWidth
 * @methodOf Kinetic.Rect.prototype
 */

/**
 * get height
 * @name getHeight
 * @methodOf Kinetic.Rect.prototype
 */

/**
 * get corner radius
 * @name getCornerRadius
 * @methodOf Kinetic.Rect.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Ellipse
///////////////////////////////////////////////////////////////////////
/**
 * Ellipse constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Ellipse = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            radius: {
                x: 0,
                y: 0
            }
        });

        this.shapeType = "Ellipse";

        config.drawFunc = function() {
            var canvas = this.getCanvas();
            var context = this.getContext();
            var r = this.getRadius();
            context.beginPath();
            context.save();
            if(r.x !== r.y) {
                context.scale(1, r.y / r.x);
            }
            context.arc(0, 0, r.x, 0, Math.PI * 2, true);
            context.restore();
            context.closePath();
            this.fill();
            this.stroke();
        };
        // call super constructor
        this._super(config);

        this._convertRadius();

        var that = this;
        this.on('radiusChange.kinetic', function() {
            that._convertRadius();
        });
    },
    /**
     * converts numeric radius into an object
     */
    _convertRadius: function() {
        var type = Kinetic.Type;
        var radius = this.getRadius();
        // if radius is already an object then return
        if(type._isObject(radius)) {
            return false;
        }

        /*
         * directly set radius attr to avoid
         * duplicate attr change event
         */
        this.attrs.radius = type._getXY(radius);
    }
});

// Circle backwards compatibility
Kinetic.Circle = Kinetic.Ellipse;

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Ellipse, ['radius']);

/**
 * set radius
 * @name setRadius
 * @methodOf Kinetic.Ellipse.prototype
 * @param {Number|Object|Array} radius
 *  radius can be a number, in which the ellipse becomes a circle,
 *  it can be an object with an x and y component, or it
 *  can be an array in which the first element is the x component
 *  and the second element is the y component.  The x component
 *  defines the horizontal radius and the y component
 *  defines the vertical radius
 */

/**
 * get radius
 * @name getRadius
 * @methodOf Kinetic.Ellipse.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Image
///////////////////////////////////////////////////////////////////////
/**
 * Image constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 * @param {ImageObject} config.image
 * @param {Number} [config.width]
 * @param {Number} [config.height]
 * @param {Object} [config.crop]
 */
Kinetic.Image = Kinetic.Shape.extend({
    init: function(config) {
        this.shapeType = "Image";
        config.drawFunc = function() {
            if(!!this.attrs.image) {
                var width = this.getWidth();
                var height = this.getHeight();
                var canvas = this.getCanvas();
                var context = this.getContext();

                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                this.fill();
                this.stroke();

                // if cropping
                if(this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height) {
                    var cropX = this.attrs.crop.x ? this.attrs.crop.x : 0;
                    var cropY = this.attrs.crop.y ? this.attrs.crop.y : 0;
                    var cropWidth = this.attrs.crop.width;
                    var cropHeight = this.attrs.crop.height;
                    this.drawImage(this.attrs.image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height);
                }
                // no cropping
                else {
                    this.drawImage(this.attrs.image, 0, 0, width, height);
                }
            }
        };
        // call super constructor
        this._super(config);

        var that = this;
        this.on('filterChange', function() {
            that._applyFilter();
        });
    },
    /**
     * set width and height
     * @name setSize
     * @methodOf Kinetic.Image.prototype
     */
    setSize: function() {
        var size = Kinetic.GlobalObject._getSize(Array.prototype.slice.call(arguments));
        this.setAttrs(size);
    },
    /**
     * return image size
     * @name getSize
     * @methodOf Kinetic.Image.prototype
     */
    getSize: function() {
        return {
            width: this.attrs.width,
            height: this.attrs.height
        };
    },
    /**
     * get width
     * @name getWidth
     * @methodOf Kinetic.Image.prototype
     */
    getWidth: function() {
        if(this.attrs.width) {
            return this.attrs.width;
        }
        if(this.attrs.image) {
            return this.attrs.image.width;
        }
        return 0;
    },
    /**
     * get height
     * @name getHeight
     * @methodOf Kinetic.Image.prototype
     */
    getHeight: function() {
        if(this.attrs.height) {
            return this.attrs.height;
        }
        if(this.attrs.image) {
            return this.attrs.image.height;
        }
        return 0;
    },
    /**
     * apply filter
     * @name applyFilter
     * @methodOf Kinetic.Image.prototype
     * @param {Object} config
     * @param {Function} config.filter filter function
     * @param {Function} [config.callback] callback function to be called once
     *  filter has been applied
     */
    applyFilter: function(config) {
        try {
            // save transformation state
            var x = this.getX();
            var y = this.getY();
            var rotation = this.getRotation();
            var scaleX = this.getScale().x;
            var scaleY = this.getScale().y;
            var offsetX = this.getOffset().x;
            var offsetY = this.getOffset().y;

            // reset transformation state
            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scale.x = 1;
            this.attrs.scale.y = 1;
            this.attrs.offset.x = 0;
            this.attrs.offset.y = 0;

            this.saveImageData();

            // restore transformation state
            this.attrs.x = x;
            this.attrs.y = y;
            this.attrs.rotation = rotation;
            this.attrs.scale.x = scaleX;
            this.attrs.scale.y = scaleY;
            this.attrs.offset.x = offsetX;
            this.attrs.offset.y = offsetY;

            config.filter.call(this, config);
            var that = this;
            Kinetic.Type._getImage(this.getImageData(), function(imageObj) {
                that.setImage(imageObj);

                if(config.callback) {
                    config.callback();
                }
            });
        }
        catch(e) {
            Kinetic.Global.warn('Unable to apply filter.');
        }
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Image, ['image', 'crop', 'filter']);
Kinetic.Node.addSetters(Kinetic.Image, ['width', 'height']);

/**
 * set width
 * @name setWidth
 * @methodOf Kinetic.Image.prototype
 * @param {Number} width
 */

/**
 * set height
 * @name setHeight
 * @methodOf Kinetic.Image.prototype
 * @param {Number} height
 */

/**
 * set image
 * @name setImage
 * @methodOf Kinetic.Image.prototype
 * @param {ImageObject} image
 */

/**
 * set crop
 * @name setCrop
 * @methodOf Kinetic.Image.prototype
 * @param {Object} config
 */

/**
 * set filter
 * @name setFilter
 * @methodOf Kinetic.Image.prototype
 * @param {Object} config
 */

/**
 * get crop
 * @name getCrop
 * @methodOf Kinetic.Image.prototype
 */

/**
 * get image
 * @name getImage
 * @methodOf Kinetic.Image.prototype
 */

/**
 * get filter
 * @name getFilter
 * @methodOf Kinetic.Image.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Sprite
///////////////////////////////////////////////////////////////////////
/**
 * Sprite constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Sprite = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            index: 0,
            frameRate: 17
        });

        config.drawFunc = function() {
            if(!!this.attrs.image) {
                var context = this.getContext();
                var anim = this.attrs.animation;
                var index = this.attrs.index;
                var f = this.attrs.animations[anim][index];

                context.beginPath();
                context.rect(0, 0, f.width, f.height);
                context.closePath();

                this.drawImage(this.attrs.image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
            }
        };
        // call super constructor
        this._super(config);

        var that = this;
        this.on('animationChange.kinetic', function() {
            // reset index when animation changes
            that.setIndex(0);
        });
    },
    /**
     * start sprite animation
     * @name start
     * @methodOf Kinetic.Sprite.prototype
     */
    start: function() {
        var that = this;
        var layer = this.getLayer();
        var ka = Kinetic.Animation;

        // if sprite already has an animation, remove it
        if(this.anim) {
            ka._removeAnimation(this.anim);
            this.anim = null;
        }

        /*
         * animation object has no executable function because
         *  the updates are done with a fixed FPS with the setInterval
         *  below.  The anim object only needs the layer reference for
         *  redraw
         */
        this.anim = {
            node: layer
        };

        /*
         * adding the animation with the addAnimation
         * method auto generates an id
         */
        ka._addAnimation(this.anim);

        this.interval = setInterval(function() {
            var index = that.attrs.index;
            that._updateIndex();
            if(that.afterFrameFunc && index === that.afterFrameIndex) {
                that.afterFrameFunc();
            }
        }, 1000 / this.attrs.frameRate);

        ka._handleAnimation();
    },
    /**
     * stop sprite animation
     * @name stop
     * @methodOf Kinetic.Sprite.prototype
     */
    stop: function() {
        var ka = Kinetic.Animation;
        if(this.anim) {
            ka._removeAnimation(this.anim);
            this.anim = null;
        }
        clearInterval(this.interval);
    },
    /**
     * set after frame event handler
     * @name afterFrame
     * @methodOf Kinetic.Sprite.prototype
     * @param {Integer} index frame index
     * @param {Function} func function to be executed after frame has been drawn
     */
    afterFrame: function(index, func) {
        this.afterFrameIndex = index;
        this.afterFrameFunc = func;
    },
    _updateIndex: function() {
        var i = this.attrs.index;
        var a = this.attrs.animation;
        if(i < this.attrs.animations[a].length - 1) {
            this.attrs.index++;
        }
        else {
            this.attrs.index = 0;
        }
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Sprite, ['animation', 'animations', 'index']);

/**
 * set animation key
 * @name setAnimation
 * @methodOf Kinetic.Sprite.prototype
 * @param {String} anim animation key
 */

/**
 * set animations obect
 * @name setAnimations
 * @methodOf Kinetic.Sprite.prototype
 * @param {Object} animations
 */

/**
 * set animation frame index
 * @name setIndex
 * @methodOf Kinetic.Sprite.prototype
 * @param {Integer} index frame index
 */

/**
 * get animation key
 * @name getAnimation
 * @methodOf Kinetic.Sprite.prototype
 */

/**
 * get animations object
 * @name getAnimations
 * @methodOf Kinetic.Sprite.prototype
 */

/**
 * get animation frame index
 * @name getIndex
 * @methodOf Kinetic.Sprite.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Polygon
///////////////////////////////////////////////////////////////////////
/**
 * Polygon constructor.&nbsp; Polygons are defined by an array of points
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Polygon = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            points: []
        });

        this.shapeType = "Polygon";
        config.drawFunc = function() {
            var context = this.getContext();
            context.beginPath();
            context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);
            for(var n = 1; n < this.attrs.points.length; n++) {
                context.lineTo(this.attrs.points[n].x, this.attrs.points[n].y);
            }
            context.closePath();
            this.fill();
            this.stroke();
        };
        // call super constructor
        this._super(config);
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Polygon, ['points']);

/**
 * set points array
 * @name setPoints
 * @methodOf Kinetic.Polygon.prototype
 * @param {Array} points can be an array of point objects or an array
 *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
 */

/**
 * get points array
 * @name getPoints
 * @methodOf Kinetic.Polygon.prototype
 */
///////////////////////////////////////////////////////////////////////
//  RegularPolygon
///////////////////////////////////////////////////////////////////////
/**
 * RegularPolygon constructor.&nbsp; Examples include triangles, squares, pentagons, hexagons, etc.
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.RegularPolygon = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            radius: 0,
            sides: 0
        });

        this.shapeType = "RegularPolygon";
        config.drawFunc = function() {
            var context = this.getContext();
            context.beginPath();
            context.moveTo(0, 0 - this.attrs.radius);

            for(var n = 1; n < this.attrs.sides; n++) {
                var x = this.attrs.radius * Math.sin(n * 2 * Math.PI / this.attrs.sides);
                var y = -1 * this.attrs.radius * Math.cos(n * 2 * Math.PI / this.attrs.sides);
                context.lineTo(x, y);
            }
            context.closePath();
            this.fill();
            this.stroke();
        };
        // call super constructor
        this._super(config);
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ['radius', 'sides']);

/**
 * set radius
 * @name setRadius
 * @methodOf Kinetic.RegularPolygon.prototype
 * @param {Number} radius
 */

/**
 * set number of sides
 * @name setSides
 * @methodOf Kinetic.RegularPolygon.prototype
 * @param {int} sides
 */
/**
 * get radius
 * @name getRadius
 * @methodOf Kinetic.RegularPolygon.prototype
 */

/**
 * get number of sides
 * @name getSides
 * @methodOf Kinetic.RegularPolygon.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Star
///////////////////////////////////////////////////////////////////////
/**
 * Star constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Star = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            numPoints: 0,
            innerRadius: 0,
            outerRadius: 0
        });

        this.shapeType = "Star";
        config.drawFunc = function() {
            var context = this.getContext();
            context.beginPath();
            context.moveTo(0, 0 - this.attrs.outerRadius);

            for(var n = 1; n < this.attrs.numPoints * 2; n++) {
                var radius = n % 2 === 0 ? this.attrs.outerRadius : this.attrs.innerRadius;
                var x = radius * Math.sin(n * Math.PI / this.attrs.numPoints);
                var y = -1 * radius * Math.cos(n * Math.PI / this.attrs.numPoints);
                context.lineTo(x, y);
            }
            context.closePath();

            this.fill();
            this.stroke();
        };
        // call super constructor
        this._super(config);
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Star, ['numPoints', 'innerRadius', 'outerRadius']);

/**
 * set number of points
 * @name setNumPoints
 * @methodOf Kinetic.Star.prototype
 * @param {Integer} points
 */

/**
 * set outer radius
 * @name setOuterRadius
 * @methodOf Kinetic.Star.prototype
 * @param {Number} radius
 */

/**
 * set inner radius
 * @name setInnerRadius
 * @methodOf Kinetic.Star.prototype
 * @param {Number} radius
 */

/**
 * get number of points
 * @name getNumPoints
 * @methodOf Kinetic.Star.prototype
 */

/**
 * get outer radius
 * @name getOuterRadius
 * @methodOf Kinetic.Star.prototype
 */

/**
 * get inner radius
 * @name getInnerRadius
 * @methodOf Kinetic.Star.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Text
///////////////////////////////////////////////////////////////////////
/**
 * Text constructor
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Text = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            fontFamily: 'Calibri',
            text: '',
            fontSize: 12,
            align: 'left',
            verticalAlign: 'top',
            fontStyle: 'normal',
            padding: 0,
            width: 'auto',
            height: 'auto',
            detectionType: 'path',
            cornerRadius: 0,
            lineHeight: 1.2
        });

        this.dummyCanvas = document.createElement('canvas');
        this.shapeType = "Text";

        config.drawFunc = function() {
            var context = this.getContext();
            /*
             * draw rect
             */
            context.beginPath();
            var boxWidth = this.getBoxWidth();
            var boxHeight = this.getBoxHeight();

            if(this.attrs.cornerRadius === 0) {
                // simple rect - don't bother doing all that complicated maths stuff.
                context.rect(0, 0, boxWidth, boxHeight);
            }
            else {
                // arcTo would be nicer, but browser support is patchy (Opera)
                context.moveTo(this.attrs.cornerRadius, 0);
                context.lineTo(boxWidth - this.attrs.cornerRadius, 0);
                context.arc(boxWidth - this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(boxWidth, boxHeight - this.attrs.cornerRadius);
                context.arc(boxWidth - this.attrs.cornerRadius, boxHeight - this.attrs.cornerRadius, this.attrs.cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(this.attrs.cornerRadius, boxHeight);
                context.arc(this.attrs.cornerRadius, boxHeight - this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, this.attrs.cornerRadius);
                context.arc(this.attrs.cornerRadius, this.attrs.cornerRadius, this.attrs.cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();

            this.fill();
            this.stroke();
            /*
             * draw text
             */
            var p = this.attrs.padding;
            var lineHeightPx = this.attrs.lineHeight * this.getTextHeight();
            var textArr = this.textArr;

            context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
            context.textBaseline = 'middle';
            context.textAlign = 'left';
            context.save();
            context.translate(p, 0);
            context.translate(0, p + this.getTextHeight() / 2);

            // draw text lines
            for(var n = 0; n < textArr.length; n++) {
                var text = textArr[n];

                // horizontal alignment
                context.save();
                if(this.attrs.align === 'right') {
                    context.translate(this.getBoxWidth() - this._getTextSize(text).width - p * 2, 0);
                }
                else if(this.attrs.align === 'center') {
                    context.translate((this.getBoxWidth() - this._getTextSize(text).width - p * 2) / 2, 0);
                }

                this.fillText(text);
                this.strokeText(text);
                context.restore();

                context.translate(0, lineHeightPx);
            }
            context.restore();
        };
        // call super constructor
        this._super(config);

        // update text data for certain attr changes
        var attrs = ['width', 'height', 'padding', 'text', 'textStroke', 'textStrokeWidth'];
        var that = this;
        for(var n = 0; n < attrs.length; n++) {
            var attr = attrs[n];
            this.on(attr + 'Change.kinetic', that._setTextData);
        }

        that._setTextData();
    },
    /**
     * get box width
     * @name getBoxWidth
     * @methodOf Kinetic.Text.prototype
     */
    getBoxWidth: function() {
        return this.attrs.width === 'auto' ? this.getTextWidth() + this.attrs.padding * 2 : this.attrs.width;
    },
    /**
     * get box height
     * @name getBoxHeight
     * @methodOf Kinetic.Text.prototype
     */
    getBoxHeight: function() {
        return this.attrs.height === 'auto' ? (this.getTextHeight() * this.textArr.length * this.attrs.lineHeight) + this.attrs.padding * 2 : this.attrs.height;
    },
    /**
     * get text width in pixels
     * @name getTextWidth
     * @methodOf Kinetic.Text.prototype
     */
    getTextWidth: function() {
        return this.textWidth;
    },
    /**
     * get text height in pixels
     * @name getTextHeight
     * @methodOf Kinetic.Text.prototype
     */
    getTextHeight: function() {
        return this.textHeight;
    },
    _getTextSize: function(text) {
        var dummyCanvas = this.dummyCanvas;
        var context = dummyCanvas.getContext('2d');

        context.save();
        context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
        var metrics = context.measureText(text);
        context.restore();
        return {
            width: metrics.width,
            height: parseInt(this.attrs.fontSize, 10)
        };
    },
    /**
     * set text data.  wrap logic and width and height setting occurs
     * here
     */
    _setTextData: function() {
        var charArr = this.attrs.text.split('');
        var arr = [];
        var row = 0;
        var addLine = true;
        this.textWidth = 0;
        this.textHeight = this._getTextSize(this.attrs.text).height;
        var lineHeightPx = this.attrs.lineHeight * this.textHeight;
        while(charArr.length > 0 && addLine && (this.attrs.height === 'auto' || lineHeightPx * (row + 1) < this.attrs.height - this.attrs.padding * 2)) {
            var index = 0;
            var line = undefined;
            addLine = false;

            while(index < charArr.length) {
                if(charArr.indexOf('\n') === index) {
                    // remove newline char
                    charArr.splice(index, 1);
                    line = charArr.splice(0, index).join('');
                    break;
                }

                // if line exceeds inner box width
                var lineArr = charArr.slice(0, index);
                if(this.attrs.width !== 'auto' && this._getTextSize(lineArr.join('')).width > this.attrs.width - this.attrs.padding * 2) {
                    /*
                     * if a single character is too large to fit inside
                     * the text box width, then break out of the loop
                     * and stop processing
                     */
                    if(index == 0) {
                        break;
                    }
                    var lastSpace = lineArr.lastIndexOf(' ');
                    var lastDash = lineArr.lastIndexOf('-');
                    var wrapIndex = Math.max(lastSpace, lastDash);
                    if(wrapIndex >= 0) {
                        line = charArr.splice(0, 1 + wrapIndex).join('');
                        break;
                    }
                    /*
                     * if not able to word wrap based on space or dash,
                     * go ahead and wrap in the middle of a word if needed
                     */
                    line = charArr.splice(0, index).join('');
                    break;
                }
                index++;

                // if the end is reached
                if(index === charArr.length) {
                    line = charArr.splice(0, index).join('');
                }
            }
            this.textWidth = Math.max(this.textWidth, this._getTextSize(line).width);
            if(line !== undefined) {
                arr.push(line);
                addLine = true;
            }
            row++;
        }
        this.textArr = arr;
    }
});
// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'textFill', 'textStroke', 'textStrokeWidth', 'padding', 'align', 'lineHeight', 'text', 'width', 'height', 'cornerRadius', 'fill', 'stroke', 'strokeWidth', 'shadow']);

/**
 * set font family
 * @name setFontFamily
 * @methodOf Kinetic.Text.prototype
 * @param {String} fontFamily
 */

/**
 * set font size
 * @name setFontSize
 * @methodOf Kinetic.Text.prototype
 * @param {int} fontSize
 */

/**
 * set font style.  Can be "normal", "italic", or "bold".  "normal" is the default.
 * @name setFontStyle
 * @methodOf Kinetic.Text.prototype
 * @param {String} fontStyle
 */

/**
 * set text fill color
 * @name setTextFill
 * @methodOf Kinetic.Text.prototype
 * @param {String} textFill
 */

/**
 * set text stroke color
 * @name setFontStroke
 * @methodOf Kinetic.Text.prototype
 * @param {String} textStroke
 */

/**
 * set text stroke width
 * @name setTextStrokeWidth
 * @methodOf Kinetic.Text.prototype
 * @param {int} textStrokeWidth
 */

/**
 * set padding
 * @name setPadding
 * @methodOf Kinetic.Text.prototype
 * @param {int} padding
 */

/**
 * set horizontal align of text
 * @name setAlign
 * @methodOf Kinetic.Text.prototype
 * @param {String} align align can be 'left', 'center', or 'right'
 */

/**
 * set line height
 * @name setLineHeight
 * @methodOf Kinetic.Text.prototype
 * @param {Number} lineHeight default is 1.2
 */

/**
 * set text
 * @name setText
 * @methodOf Kinetic.Text.prototype
 * @param {String} text
 */

/**
 * set width of text box
 * @name setWidth
 * @methodOf Kinetic.Text.prototype
 * @param {Number} width
 */

/**
 * set height of text box
 * @name setHeight
 * @methodOf Kinetic.Text.prototype
 * @param {Number} height
 */

/**
 * set shadow of text or textbox
 * @name setShadow
 * @methodOf Kinetic.Text.prototype
 * @param {Object} config
 */

/**
 * get font family
 * @name getFontFamily
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get font size
 * @name getFontSize
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get font style
 * @name getFontStyle
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get text fill color
 * @name getTextFill
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get text stroke color
 * @name getTextStroke
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get text stroke width
 * @name getTextStrokeWidth
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get padding
 * @name getPadding
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get horizontal align
 * @name getAlign
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get line height
 * @name getLineHeight
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get text
 * @name getText
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get width of text box
 * @name getWidth
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get height of text box
 * @name getHeight
 * @methodOf Kinetic.Text.prototype
 */

/**
 * get shadow of text or textbox
 * @name getShadow
 * @methodOf Kinetic.Text.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Line
///////////////////////////////////////////////////////////////////////
/**
 * Line constructor.&nbsp; Lines are defined by an array of points
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Line = Kinetic.Shape.extend({
    init: function(config) {
        this.setDefaultAttrs({
            points: [],
            lineCap: 'butt',
            dashArray: [],
            detectionType: 'pixel'
        });

        this.shapeType = "Line";
        config.drawFunc = function() {
            var context = this.getContext();
            var lastPos = {};
            context.beginPath();

            context.moveTo(this.attrs.points[0].x, this.attrs.points[0].y);

            for(var n = 1; n < this.attrs.points.length; n++) {
                var x = this.attrs.points[n].x;
                var y = this.attrs.points[n].y;
                if(this.attrs.dashArray.length > 0) {
                    // draw dashed line
                    var lastX = this.attrs.points[n - 1].x;
                    var lastY = this.attrs.points[n - 1].y;
                    this._dashedLine(lastX, lastY, x, y, this.attrs.dashArray);
                }
                else {
                    // draw normal line
                    context.lineTo(x, y);
                }
            }

            if(!!this.attrs.lineCap) {
                context.lineCap = this.attrs.lineCap;
            }

            this.stroke();
        };
        // call super constructor
        this._super(config);
    },
    /**
     * draw dashed line.  Written by Phrogz
     */
    _dashedLine: function(x, y, x2, y2, dashArray) {
        var context = this.getContext();
        var dashCount = dashArray.length;

        var dx = (x2 - x), dy = (y2 - y);
        var xSlope = dx > dy;
        var slope = (xSlope) ? dy / dx : dx / dy;

        /*
         * gaurd against slopes of infinity
         */
        if(slope > 9999) {
            slope = 9999;
        }
        else if(slope < -9999) {
            slope = -9999;
        }

        var distRemaining = Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0, draw = true;
        while(distRemaining >= 0.1 && dashIndex < 10000) {
            var dashLength = dashArray[dashIndex++ % dashCount];
            if(dashLength === 0) {
                dashLength = 0.001;
            }
            if(dashLength > distRemaining) {
                dashLength = distRemaining;
            }
            var step = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            if(xSlope) {
                x += dx < 0 && dy < 0 ? step * -1 : step;
                y += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
            }
            else {
                x += dx < 0 && dy < 0 ? slope * step * -1 : slope * step;
                y += dx < 0 && dy < 0 ? step * -1 : step;
            }
            context[draw ? 'lineTo' : 'moveTo'](x, y);
            distRemaining -= dashLength;
            draw = !draw;
        }

        context.moveTo(x2, y2);
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Line, ['dashArray', 'lineCap', 'points']);

/**
 * set dash array.
 * @name setDashArray
 * @methodOf Kinetic.Line.prototype
 * @param {Array} dashArray
 *  examples:<br>
 *  [10, 5] dashes are 10px long and 5 pixels apart
 *  [10, 20, 0, 20] if using a round lineCap, the line will
 *  be made up of alternating dashed lines that are 10px long
 *  and 20px apart, and dots that have a radius of 5 and are 20px
 *  apart
 */

/**
 * set line cap.  Can be butt, round, or square
 * @name setLineCap
 * @methodOf Kinetic.Line.prototype
 * @param {String} lineCap
 */

/**
 * set points array
 * @name setPoints
 * @methodOf Kinetic.Line.prototype
 * @param {Array} can be an array of point objects or an array
 *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
 */

/**
 * get dash array
 * @name getDashArray
 * @methodOf Kinetic.Line.prototype
 */

/**
 * get line cap
 * @name getLineCap
 * @methodOf Kinetic.Line.prototype
 */

/**
 * get points array
 * @name getPoints
 * @methodOf Kinetic.Line.prototype
 */
///////////////////////////////////////////////////////////////////////
//  SVG Path
///////////////////////////////////////////////////////////////////////
/**
 * Path constructor.
 * @author Jason Follas
 * @constructor
 * @augments Kinetic.Shape
 * @param {Object} config
 */
Kinetic.Path = Kinetic.Shape.extend({
    init: function(config) {
        this.shapeType = "Path";
        this.dataArray = [];
        var that = this;

        config.drawFunc = function() {
            var context = this.getContext();
            var ca = this.dataArray;
            // context position
            context.beginPath();
            for(var n = 0; n < ca.length; n++) {
                var c = ca[n].command;
                var p = ca[n].points;
                switch(c) {
                    case 'L':
                        context.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        context.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];

                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;

                        context.translate(cx, cy);
                        context.rotate(psi);
                        context.scale(scaleX, scaleY);
                        context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        context.scale(1 / scaleX, 1 / scaleY);
                        context.rotate(-psi);
                        context.translate(-cx, -cy);

                        break;
                    case 'z':
                        context.closePath();
                        break;
                }
            }
            this.fill();
            this.stroke();
        };
        // call super constructor
        this._super(config);

        this.dataArray = this._getDataArray();

        this.on('dataChange', function() {
            that.dataArray = that._getDataArray();
        });
    },
    /**
     * get parsed data array from the data
     *  string.  V, v, H, h, and l data are converted to
     *  L data for the purpose of high performance Path
     *  rendering
     */
    _getDataArray: function() {

        // Path Data Segment must begin with a moveTo
        //m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
        //M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
        //l (x y)+  Relative lineTo
        //L (x y)+  Absolute LineTo
        //h (x)+    Relative horizontal lineTo
        //H (x)+    Absolute horizontal lineTo
        //v (y)+    Relative vertical lineTo
        //V (y)+    Absolute vertical lineTo
        //z (closepath)
        //Z (closepath)
        //c (x1 y1 x2 y2 x y)+ Relative Bezier curve
        //C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
        //q (x1 y1 x y)+       Relative Quadratic Bezier
        //Q (x1 y1 x y)+       Absolute Quadratic Bezier
        //t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
        //T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
        //s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
        //S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
        //a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
        //A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

        // command string
        var cs = this.attrs.data;

        // return early if data is not defined
        if(!this.attrs.data) {
            return [];
        }
        // command chars
        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
        // convert white spaces to commas
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        // create pipes so that we can split the data
        for(var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        var arr = cs.split('|');
        var ca = [];
        // init context point
        var cpx = 0;
        var cpy = 0;
        for(var n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            // remove ,- for consistency
            str = str.replace(new RegExp(',-', 'g'), '-');
            // add commas so that it's easy to split
            str = str.replace(new RegExp('-', 'g'), ',-');
            var p = str.split(',');
            if(p.length > 0 && p[0] === '') {
                p.shift();
            }
            // convert strings to floats
            for(var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }

            while(p.length > 0) {
                if(isNaN(p[0]))// case for a trailing comma before next command
                    break;

                var cmd = undefined;
                var points = [];

                // convert l, H, h, V, and v to L
                switch(c) {

                    // Note: Keep the lineTo's above the moveTo's in this switch
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;

                    // Note: lineTo handlers need to be above this point
                    case 'm':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'l';
                        // subsequent points are treated as relative lineTo
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        // subsequent points are treated as absolute lineTo
                        break;

                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C'
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift())
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift())
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q'
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        var rx = p.shift(), ry = p.shift(), psi = p.shift(), fa = p.shift(), fs = p.shift();
                        var x1 = cpx, y1 = cpy;
                        cpx = p.shift(), cpy = p.shift();
                        cmd = 'A';
                        points = this._convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        var rx = p.shift(), ry = p.shift(), psi = p.shift(), fa = p.shift(), fs = p.shift();
                        var x1 = cpx, y1 = cpy;
                        cpx += p.shift(), cpy += p.shift();
                        cmd = 'A';
                        points = this._convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }

                ca.push({
                    command: cmd || c,
                    points: points
                });

            }

            if(c === 'z' || c === 'Z')
                ca.push({
                    command: 'z',
                    points: []
                });
        }

        return ca;
    },
    _convertEndpointToCenterParameterization: function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {

        // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes

        var psi = psiDeg * (Math.PI / 180.0);

        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if(lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

        if(fa == fs)
            f *= -1;
        if(isNaN(f))
            f = 0;

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        var vMag = function(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }
        var vRatio = function(u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v))
        }
        var vAngle = function(u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        }
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);

        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);

        if(vRatio(u, v) <= -1)
            dTheta = Math.PI;
        if(vRatio(u, v) >= 1)
            dTheta = 0;

        if(fs == 0 && dTheta > 0)
            dTheta = dTheta - 2 * Math.PI;
        if(fs == 1 && dTheta < 0)
            dTheta = dTheta + 2 * Math.PI;

        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    }
});

// add getters setters
Kinetic.Node.addGettersSetters(Kinetic.Path, ['data']);

/**
 * set SVG path data string.  This method
 *  also automatically parses the data string
 *  into a data array.  Currently supported SVG data:
 *  M, m, L, l, H, h, V, v, Q, q, T, t, C, c, S, s, A, a, Z, z
 * @name setData
 * @methodOf Kinetic.Path.prototype
 * @param {String} SVG path command string
 */

/**
 * get SVG path data string
 * @name getData
 * @methodOf Kinetic.Path.prototype
 */
///////////////////////////////////////////////////////////////////////
//  Transform
///////////////////////////////////////////////////////////////////////
/*
* Last updated November 2011
* By Simon Sarris
* www.simonsarris.com
* sarris@acm.org
*
* Free to use and distribute at will
* So long as you are nice to people, etc
*/

/*
* The usage of this class was inspired by some of the work done by a forked
* project, KineticJS-Ext by Wappworks, which is based on Simon's Transform
* class.
*/


Kinetic.Transform = function() {
    this.m = [1, 0, 0, 1, 0, 0];
}

Kinetic.Transform.prototype = {
    /**
     * Apply translation
     * @param {Number} x
     * @param {Number} y
     */
    translate: function(x, y) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
    },
    /**
     * Apply scale
     * @param {Number} sx
     * @param {Number} sy
     */
    scale: function(sx, sy) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
    },
    /**
     * Apply rotation
     * @param {Number} rad  Angle in radians
     */
    rotate: function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var m11 = this.m[0] * c + this.m[2] * s;
        var m12 = this.m[1] * c + this.m[3] * s;
        var m21 = this.m[0] * -s + this.m[2] * c;
        var m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
    },
    /**
     * Returns the translation
     * @returns {Object} 2D point(x, y)
     */
    getTranslation: function() {
        return {
            x: this.m[4],
            y: this.m[5]
        };
    },
    /**
     * Transform multiplication
     * @param {Kinetic.Transform} matrix
     */
    multiply: function(matrix) {
        var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

        var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

        var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
    },
    /**
     * Invert the matrix
     */
    invert: function() {
        var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        var m0 = this.m[3] * d;
        var m1 = -this.m[1] * d;
        var m2 = -this.m[2] * d;
        var m3 = this.m[0] * d;
        var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
    },
    /**
     * return matrix
     */
    getMatrix: function() {
        return this.m;
    }
};

///////////////////////////////////////////////////////////////////////
//  Transition
///////////////////////////////////////////////////////////////////////
/**
 * Transition constructor.  The transitionTo() Node method
 *  returns a reference to the transition object which you can use
 *  to stop, resume, or restart the transition
 * @constructor
 */
Kinetic.Transition = function(node, config) {
    this.node = node;
    this.config = config;
    this.tweens = [];
    var that = this;

    // add tween for each property
    function addTween(c, attrs, obj, rootObj) {
        for(var key in c) {
            if(key !== 'duration' && key !== 'easing' && key !== 'callback') {
                // if val is an object then traverse
                if(Kinetic.Type._isObject(c[key])) {
                    obj[key] = {};
                    addTween(c[key], attrs[key], obj[key], rootObj);
                }
                else {
                    that._add(that._getTween(attrs, key, c[key], obj, rootObj));
                }
            }
        }
    }
    var obj = {};
    addTween(config, node.attrs, obj, obj);

    var finishedTweens = 0;
    for(var n = 0; n < this.tweens.length; n++) {
        var tween = this.tweens[n];
        tween.onFinished = function() {
            finishedTweens++;
            if(finishedTweens >= that.tweens.length) {
                that.onFinished();
            }
        };
    }
};
/*
 * Transition methods
 */
Kinetic.Transition.prototype = {
    /**
     * start transition
     * @name start
     * @methodOf Kinetic.Transition.prototype
     */
    start: function() {
        for(var n = 0; n < this.tweens.length; n++) {
            this.tweens[n].start();
        }
    },
    /**
     * stop transition
     * @name stop
     * @methodOf Kinetic.Transition.prototype
     */
    stop: function() {
        for(var n = 0; n < this.tweens.length; n++) {
            this.tweens[n].stop();
        }
    },
    /**
     * resume transition
     * @name resume
     * @methodOf Kinetic.Transition.prototype
     */
    resume: function() {
        for(var n = 0; n < this.tweens.length; n++) {
            this.tweens[n].resume();
        }
    },
    _onEnterFrame: function() {
        for(var n = 0; n < this.tweens.length; n++) {
            this.tweens[n].onEnterFrame();
        }
    },
    _add: function(tween) {
        this.tweens.push(tween);
    },
    _getTween: function(attrs, prop, val, obj, rootObj) {
        var config = this.config;
        var node = this.node;
        var easing = config.easing;
        if(easing === undefined) {
            easing = 'linear';
        }

        var tween = new Kinetic.Tween(node, function(i) {
            obj[prop] = i;
            node.setAttrs(rootObj);
        }, Kinetic.Tweens[easing], attrs[prop], val, config.duration);

        return tween;
    }
};

///////////////////////////////////////////////////////////////////////
//  Tween
///////////////////////////////////////////////////////////////////////
/*
* The Tween class was ported from an Adobe Flash Tween library
* to JavaScript by Xaric.  In the context of KineticJS, a Tween is
* an animation of a single Node property.  A Transition is a set of
* multiple tweens
*/
Kinetic.Tween = function(obj, propFunc, func, begin, finish, duration) {
    this._listeners = [];
    this.addListener(this);
    this.obj = obj;
    this.propFunc = propFunc;
    this.begin = begin;
    this._pos = begin;
    this.setDuration(duration);
    this.isPlaying = false;
    this._change = 0;
    this.prevTime = 0;
    this.prevPos = 0;
    this.looping = false;
    this._time = 0;
    this._position = 0;
    this._startTime = 0;
    this._finish = 0;
    this.name = '';
    this.func = func;
    this.setFinish(finish);
};
/*
 * Tween methods
 */
Kinetic.Tween.prototype = {
    setTime: function(t) {
        this.prevTime = this._time;
        if(t > this.getDuration()) {
            if(this.looping) {
                this.rewind(t - this._duration);
                this.update();
                this.broadcastMessage('onLooped', {
                    target: this,
                    type: 'onLooped'
                });
            }
            else {
                this._time = this._duration;
                this.update();
                this.stop();
                this.broadcastMessage('onFinished', {
                    target: this,
                    type: 'onFinished'
                });
            }
        }
        else if(t < 0) {
            this.rewind();
            this.update();
        }
        else {
            this._time = t;
            this.update();
        }
    },
    getTime: function() {
        return this._time;
    },
    setDuration: function(d) {
        this._duration = (d === null || d <= 0) ? 100000 : d;
    },
    getDuration: function() {
        return this._duration;
    },
    setPosition: function(p) {
        this.prevPos = this._pos;
        this.propFunc(p);
        this._pos = p;
        this.broadcastMessage('onChanged', {
            target: this,
            type: 'onChanged'
        });
    },
    getPosition: function(t) {
        if(t === undefined) {
            t = this._time;
        }
        return this.func(t, this.begin, this._change, this._duration);
    },
    setFinish: function(f) {
        this._change = f - this.begin;
    },
    getFinish: function() {
        return this.begin + this._change;
    },
    start: function() {
        this.rewind();
        this.startEnterFrame();
        this.broadcastMessage('onStarted', {
            target: this,
            type: 'onStarted'
        });
    },
    rewind: function(t) {
        this.stop();
        this._time = (t === undefined) ? 0 : t;
        this.fixTime();
        this.update();
    },
    fforward: function() {
        this._time = this._duration;
        this.fixTime();
        this.update();
    },
    update: function() {
        this.setPosition(this.getPosition(this._time));
    },
    startEnterFrame: function() {
        this.stopEnterFrame();
        this.isPlaying = true;
        this.onEnterFrame();
    },
    onEnterFrame: function() {
        if(this.isPlaying) {
            this.nextFrame();
        }
    },
    nextFrame: function() {
        this.setTime((this.getTimer() - this._startTime) / 1000);
    },
    stop: function() {
        this.stopEnterFrame();
        this.broadcastMessage('onStopped', {
            target: this,
            type: 'onStopped'
        });
    },
    stopEnterFrame: function() {
        this.isPlaying = false;
    },
    continueTo: function(finish, duration) {
        this.begin = this._pos;
        this.setFinish(finish);
        if(this._duration !== undefined) {
            this.setDuration(duration);
        }
        this.start();
    },
    resume: function() {
        this.fixTime();
        this.startEnterFrame();
        this.broadcastMessage('onResumed', {
            target: this,
            type: 'onResumed'
        });
    },
    yoyo: function() {
        this.continueTo(this.begin, this._time);
    },
    addListener: function(o) {
        this.removeListener(o);
        return this._listeners.push(o);
    },
    removeListener: function(o) {
        var a = this._listeners;
        var i = a.length;
        while(i--) {
            if(a[i] == o) {
                a.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    broadcastMessage: function() {
        var arr = [];
        for(var i = 0; i < arguments.length; i++) {
            arr.push(arguments[i]);
        }
        var e = arr.shift();
        var a = this._listeners;
        var l = a.length;
        for(var i = 0; i < l; i++) {
            if(a[i][e]) {
                a[i][e].apply(a[i], arr);
            }
        }
    },
    fixTime: function() {
        this._startTime = this.getTimer() - this._time * 1000;
    },
    getTimer: function() {
        return new Date().getTime() - this._time;
    }
};

Kinetic.Tweens = {
    'back-ease-in': function(t, b, c, d, a, p) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    'back-ease-out': function(t, b, c, d, a, p) {
        var s = 1.70158;
        return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    'back-ease-in-out': function(t, b, c, d, a, p) {
        var s = 1.70158;
        if((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    'elastic-ease-in': function(t, b, c, d, a, p) {
        // added s = 0
        var s = 0;
        if(t === 0) {
            return b;
        }
        if((t /= d) == 1) {
            return b + c;
        }
        if(!p) {
            p = d * 0.3;
        }
        if(!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    'elastic-ease-out': function(t, b, c, d, a, p) {
        // added s = 0
        var s = 0;
        if(t === 0) {
            return b;
        }
        if((t /= d) == 1) {
            return b + c;
        }
        if(!p) {
            p = d * 0.3;
        }
        if(!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    'elastic-ease-in-out': function(t, b, c, d, a, p) {
        // added s = 0
        var s = 0;
        if(t === 0) {
            return b;
        }
        if((t /= d / 2) == 2) {
            return b + c;
        }
        if(!p) {
            p = d * (0.3 * 1.5);
        }
        if(!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if(t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    'bounce-ease-out': function(t, b, c, d) {
        if((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else if(t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        }
        else if(t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    },
    'bounce-ease-in': function(t, b, c, d) {
        return c - Kinetic.Tweens['bounce-ease-out'](d - t, 0, c, d) + b;
    },
    'bounce-ease-in-out': function(t, b, c, d) {
        if(t < d / 2) {
            return Kinetic.Tweens['bounce-ease-in'](t * 2, 0, c, d) * 0.5 + b;
        }
        else {
            return Kinetic.Tweens['bounce-ease-out'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    // duplicate
    /*
     strongEaseInOut: function(t, b, c, d) {
     return c * (t /= d) * t * t * t * t + b;
     },
     */
    'ease-in': function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    'ease-out': function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    'ease-in-out': function(t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    'strong-ease-in': function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    'strong-ease-out': function(t, b, c, d) {
        return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
    },
    'strong-ease-in-out': function(t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    'linear': function(t, b, c, d) {
        return c * t / d + b;
    }
};

Kinetic.Filters.Grayscale = function() {
    var data = this.imageData.data;
    for(var i = 0; i < data.length; i += 4) {
        var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        // red
        data[i] = brightness;
        // green
        data[i + 1] = brightness;
        // blue
        data[i + 2] = brightness;
        // i+3 is alpha (the fourth element)
    }
};

