(function() {
    // CONSTANTS
    var SPACE = ' ',
        EMPTY_STRING = '',
        DOT = '.',
        GET = 'get',
        SET = 'set',
        SHAPE = 'Shape',
        STAGE = 'Stage',
        X = 'x',
        Y = 'y',
        UPPER_X = 'X',
        UPPER_Y = 'Y',
        KINETIC = 'kinetic',
        BEFORE = 'before',
        CHANGE = 'Change',
        ID = 'id',
        NAME = 'name',
        MOUSEENTER = 'mouseenter',
        MOUSELEAVE = 'mouseleave',
        DEG = 'Deg',
        ON = 'on',
        OFF = 'off',
        BEFORE_DRAW = 'beforeDraw',
        DRAW = 'draw',
        BLACK = 'black',
        RGB = 'RGB',
        R = 'r',
        G = 'g',
        B = 'b',
        UPPER_R = 'R',
        UPPER_G = 'G',
        UPPER_B = 'B',
        HASH = '#',
        CHILDREN = 'children';
        
    Kinetic.Util.addMethods(Kinetic.Node, {
        _nodeInit: function(config) {
            this._id = Kinetic.Global.idCounter++;
            this.eventListeners = {};
            this.setAttrs(config);
        },
        /**
         * bind events to the node. KineticJS supports mouseover, mousemove,
         *  mouseout, mouseenter, mouseleave, mousedown, mouseup, click, dblclick, touchstart, touchmove,
         *  touchend, tap, dbltap, dragstart, dragmove, and dragend events. Pass in a string
         *  of events delimmited by a space to bind multiple events at once
         *  such as 'mousedown mouseup mousemove'. Include a namespace to bind an
         *  event by name such as 'click.foobar'.
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} typesStr e.g. 'click', 'mousedown touchstart', 'mousedown.foo touchstart.foo'
         * @param {Function} handler The handler function is passed an event object
         * @example
         * // add click listener<br>
         * node.on('click', function() {<br>
         *   console.log('you clicked me!');<br>
         * });<br><br>
         * 
         * // get the target node<br>
         * node.on('click', function(evt) {<br>
         *   console.log(evt.targetNode);<br>
         * });<br><br>
         *
         * // stop event propagation<br>
         * node.on('click', function(evt) {<br>
         *   evt.cancelBubble = true;<br>
         * });<br><br>
         *
         * // bind multiple listeners<br>
         * node.on('click touchstart', function() {<br>
         *   console.log('you clicked/touched me!');<br>
         * });<br><br>
         *
         * // namespace listener<br>
         * node.on('click.foo', function() {<br>
         *   console.log('you clicked/touched me!');<br>
         * });
         */
        on: function(typesStr, handler) {
            var types = typesStr.split(SPACE),
                len = types.length,
                n, type, event, parts, baseEvent, name;
            
             /*
             * loop through types and attach event listeners to
             * each one.  eg. 'click mouseover.namespace mouseout'
             * will create three event bindings
             */
            for(n = 0; n < len; n++) {
                type = types[n];
                event = type;
                parts = event.split(DOT);
                baseEvent = parts[0];
                name = parts.length > 1 ? parts[1] : EMPTY_STRING;

                if(!this.eventListeners[baseEvent]) {
                    this.eventListeners[baseEvent] = [];
                }

                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });
            }
            return this;
        },
        /**
         * remove event bindings from the node. Pass in a string of
         *  event types delimmited by a space to remove multiple event
         *  bindings at once such as 'mousedown mouseup mousemove'.
         *  include a namespace to remove an event binding by name
         *  such as 'click.foobar'. If you only give a name like '.foobar',
         *  all events in that namespace will be removed.
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} typesStr e.g. 'click', 'mousedown touchstart', '.foobar'
         * @example
         * // remove listener<br>
         * node.off('click');<br><br>
         *
         * // remove multiple listeners<br>
         * node.off('click touchstart');<br><br>
         *
         * // remove listener by name<br>
         * node.off('click.foo');
         */
        off: function(typesStr) {
            var types = typesStr.split(SPACE),
                len = types.length,
                n, type, event, parts, baseEvent;
                
            for(n = 0; n < len; n++) {
                type = types[n];
                event = type;
                parts = event.split(DOT);
                baseEvent = parts[0];

                if(parts.length > 1) {
                    if(baseEvent) {
                        if(this.eventListeners[baseEvent]) {
                            this._off(baseEvent, parts[1]);
                        }
                    }
                    else {
                        for(var type in this.eventListeners) {
                            this._off(type, parts[1]);
                        }
                    }
                }
                else {
                    delete this.eventListeners[baseEvent];
                }
            }
            return this;
        },
        /**
         * remove self from parent, but don't destroy
         * @method
         * @memberof Kinetic.Node.prototype
         * @example
         * node.remove();
         */
        remove: function() {
            var parent = this.getParent();
            
            if(parent && parent.children) {
                parent.children.splice(this.index, 1);
                parent._setChildrenIndices();
            }
            delete this.parent;
        },
        /**
         * remove and destroy self
         * @method
         * @memberof Kinetic.Node.prototype
         * @example
         * node.destroy();
         */
        destroy: function() {
            var parent = this.getParent(), 
                stage = this.getStage(), 
                dd = Kinetic.DD, 
                go = Kinetic.Global;

            // destroy children
            while(this.children && this.children.length > 0) {
                this.children[0].destroy();
            }

            // remove from ids and names hashes
            go._removeId(this.getId());
            go._removeName(this.getName(), this._id);

            // TODO: stop transitions
 
            this.remove();
        },
        /**
         * get attr
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} attr  
         * @example
         * var x = node.getAttr('x');
         */
        getAttr: function(attr) {
            var method = GET + Kinetic.Util._capitalize(attr);
            if(Kinetic.Util._isFunction(this[method])) {
                return this[method]();
            }
            // otherwise get directly
            else {
                return this.attrs[attr];
            }
        },
        /**
         * set attr
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} attr  
         * #param {*} val
         * @example
         * node.setAttr('x', 5);
         */
        setAttr: function() {
            var args = Array.prototype.slice.call(arguments),
                attr = args[0],
                method = SET + Kinetic.Util._capitalize(attr),
                func = this[method];

            args.shift();
            if(Kinetic.Util._isFunction(func)) {
                func.apply(this, args);
            }
            // otherwise get directly
            else {
                this.attrs[attr] = args[0];
            }
        },
        /**
         * get attrs object literal
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getAttrs: function() {
            return this.attrs || {};
        },
        createAttrs: function() {
            if(this.attrs === undefined) {
                this.attrs = {};
            }
        },
        
        /**
         * set multiple attrs at once using an object literal
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} config object containing key value pairs
         * @example
         * node.setAttrs({<br>
         *   x: 5,<br>
         *   fill: 'red'<br>
         * });<br>
         */
        setAttrs: function(config) {
            var key, method;
            
            if(config) {
                for(key in config) {
                    if (key === CHILDREN) {
                   
                    }
                    else {
                        method = SET + Kinetic.Util._capitalize(key);
                        // use setter if available
                        if(Kinetic.Util._isFunction(this[method])) {
                            this[method](config[key]);
                        }
                        // otherwise set directly
                        else {
                            this._setAttr(key, config[key]);
                        }
                    }
                }
            }
        },
        /**
         * determine if node is visible or not.  Node is visible only
         *  if it's visible and all of its ancestors are visible.  If an ancestor
         *  is invisible, this means that the node is also invisible
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getVisible: function() {
            var visible = this.attrs.visible, 
                parent = this.getParent();
              
            // default  
            if (visible === undefined) {
                visible = true;  
            }
            
            if(visible && parent && !parent.getVisible()) {
                return false;
            }
            return visible;
        },
        /**
         * determine if node is listening or not.  Node is listening only
         *  if it's listening and all of its ancestors are listening.  If an ancestor
         *  is not listening, this means that the node is also not listening
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getListening: function() {
            var listening = this.attrs.listening, 
                parent = this.getParent();
                
            // default  
            if (listening === undefined) {
                listening = true;  
            }
            
            if(listening && parent && !parent.getListening()) {
                return false;
            }
            return listening;
        },
        /**
         * show node
         * @method
         * @memberof Kinetic.Node.prototype
         */
        show: function() {
            this.setVisible(true);
        },
        /**
         * hide node.  Hidden nodes are no longer detectable
         * @method
         * @memberof Kinetic.Node.prototype
         */
        hide: function() {
            this.setVisible(false);
        },
        /**
         * get zIndex relative to the node's siblings who share the same parent
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getZIndex: function() {
            return this.index || 0;
        },
        /**
         * get absolute z-index which takes into account sibling
         *  and ancestor indices
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getAbsoluteZIndex: function() {
            var level = this.getLevel(),
                stage = this.getStage(),
                that = this,
                index = 0,
                nodes, len, n, child;
                
            function addChildren(children) {
                nodes = [];
                len = children.length;
                for(n = 0; n < len; n++) {
                    child = children[n];
                    index++;

                    if(child.nodeType !== SHAPE) {
                        nodes = nodes.concat(child.getChildren().toArray());
                    }

                    if(child._id === that._id) {
                        n = len;
                    }
                }

                if(nodes.length > 0 && nodes[0].getLevel() <= level) {
                    addChildren(nodes);
                }
            }
            if(that.nodeType !== STAGE) {
                addChildren(that.getStage().getChildren());
            }

            return index;
        },
        /**
         * get node level in node tree.  Returns an integer.<br><br>
         *  e.g. Stage level will always be 0.  Layers will always be 1.  Groups and Shapes will always
         *  be >= 2
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getLevel: function() {
            var level = 0,
                parent = this.parent;
                
            while(parent) {
                level++;
                parent = parent.parent;
            }
            return level;
        },
        /**
         * set node position relative to parent
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} x
         * @param {Number} y
         * @example
         * // set x and y<br>
         * node.setPosition(5, 10);<br><br>
         *
         * // set x only<br>
         * node.setPosition({<br>
         *   x: 5<br>
         * });<br><br>
         *
         * // set x and y using an array<br>
         * node.setPosition([5, 10]);<br><br>
         *
         * // set both x and y to 5<br>
         * node.setPosition(5);
         */
        setPosition: function() {
            var pos = Kinetic.Util._getXY([].slice.call(arguments));
            this.setX(pos.x);
            this.setY(pos.y);
        },
        /**
         * get node position relative to parent
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getPosition: function() {
            return {
                x: this.getX(),
                y: this.getY()
            };
        },
        /**
         * get absolute position relative to the top left corner of the stage container div
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getAbsolutePosition: function() {
            var trans = this.getAbsoluteTransform(),
                o = this.getOffset();
                
            trans.translate(o.x, o.y);
            return trans.getTranslation();
        },
        /**
         * set absolute position
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} x
         * @param {Number} y
         */
        setAbsolutePosition: function() {
            var pos = Kinetic.Util._getXY([].slice.call(arguments)),
                trans = this._clearTransform(),
                it;
                
            // don't clear translation
            this.attrs.x = trans.x;
            this.attrs.y = trans.y;
            delete trans.x;
            delete trans.y;

            // unravel transform
            it = this.getAbsoluteTransform();

            it.invert();
            it.translate(pos.x, pos.y);
            pos = {
                x: this.attrs.x + it.getTranslation().x,
                y: this.attrs.y + it.getTranslation().y
            };

            this.setPosition(pos.x, pos.y);
            this._setTransform(trans);
        },
        /**
         * move node by an amount relative to its current position
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} x
         * @param {Number} y
         * @example
         * // move node in x direction by 1px and y direction by 2px<br>
         * node.move(1, 2);<br><br>
         *
         * // move node in x direction by 1px<br>
         * node.move({<br>
         *   x: 1<br>
         * });
         */
        move: function() {
            var pos = Kinetic.Util._getXY([].slice.call(arguments)),
                x = this.getX(),
                y = this.getY();

            if(pos.x !== undefined) {
                x += pos.x;
            }

            if(pos.y !== undefined) {
                y += pos.y;
            }

            this.setPosition(x, y);
        },
        _eachAncestorReverse: function(func, includeSelf) {
            var family = [], 
                parent = this.getParent(),
                len, n;

            // build family by traversing ancestors
            if(includeSelf) {
                family.unshift(this);
            }
            while(parent) {
                family.unshift(parent);
                parent = parent.parent;
            }

            len = family.length;
            for(n = 0; n < len; n++) {
                func(family[n]);
            }
        },
        /**
         * rotate node by an amount in radians relative to its current rotation
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} theta
         */
        rotate: function(theta) {
            this.setRotation(this.getRotation() + theta);
        },
        /**
         * rotate node by an amount in degrees relative to its current rotation
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} deg
         */
        rotateDeg: function(deg) {
            this.setRotation(this.getRotation() + Kinetic.Util._degToRad(deg));
        },
        /**
         * move node to the top of its siblings
         * @method
         * @memberof Kinetic.Node.prototype
         */
        moveToTop: function() {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        },
        /**
         * move node up
         * @method
         * @memberof Kinetic.Node.prototype
         */
        moveUp: function() {
            var index = this.index,
                len = this.parent.getChildren().length;
            if(index < len - 1) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index + 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
        },
        /**
         * move node down
         * @method
         * @memberof Kinetic.Node.prototype
         */
        moveDown: function() {
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index - 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
        },
        /**
         * move node to the bottom of its siblings
         * @method
         * @memberof Kinetic.Node.prototype
         */
        moveToBottom: function() {
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.unshift(this);
                this.parent._setChildrenIndices();
                return true;
            }
        },
        /**
         * set zIndex relative to siblings
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Integer} zIndex
         */
        setZIndex: function(zIndex) {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.splice(zIndex, 0, this);
            this.parent._setChildrenIndices();
        },
        /**
         * get absolute opacity
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getAbsoluteOpacity: function() {
            var absOpacity = this.getOpacity();
            if(this.getParent()) {
                absOpacity *= this.getParent().getAbsoluteOpacity();
            }
            return absOpacity;
        },
        /**
         * move node to another container
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Container} newContainer
         * @example
         * // move node from current layer into layer2<br>
         * node.moveTo(layer2);
         */
        moveTo: function(newContainer) {
            Kinetic.Node.prototype.remove.call(this);
            newContainer.add(this);
        },
        /**
         * convert Node into an object for serialization.  Returns an object.
         * @method
         * @memberof Kinetic.Node.prototype
         */
        toObject: function() {
            var type = Kinetic.Util, 
                obj = {}, 
                attrs = this.getAttrs(),
                key, val;

            obj.attrs = {};

            // serialize only attributes that are not function, image, DOM, or objects with methods
            for(key in attrs) {
                val = attrs[key];
                if(!type._isFunction(val) && !type._isElement(val) && !(type._isObject(val) && type._hasMethods(val))) {
                    obj.attrs[key] = val;
                }
            }

            obj.className = this.getClassName();
            return obj;
        },
        /**
         * convert Node into a JSON string.  Returns a JSON string.
         * @method
         * @memberof Kinetic.Node.prototype
         */
        toJSON: function() {
            return JSON.stringify(this.toObject());
        },
        /**
         * get parent container
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getParent: function() {
            return this.parent;
        },
        /**
         * get layer ancestor
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getLayer: function() {
            return this.getParent().getLayer();
        },
        /**
         * get stage ancestor
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getStage: function() {
            if(this.getParent()) {
                return this.getParent().getStage();
            }
            else {
                return undefined;
            }
        },
        /**
         * fire event
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} eventType event type.  can be a regular event, like click, mouseover, or mouseout, or it can be a custom event, like myCustomEvent
         * @param {EventObject} evt event object
         * @param {Boolean} bubble setting the value to false, or leaving it undefined, will result in the event 
         *  not bubbling.  Setting the value to true will result in the event bubbling.
         * @example
         * // manually fire click event<br>
         * node.fire('click');<br><br>
         *
         * // fire custom event<br>
         * node.fire('foo');<br><br>
         *
         * // fire custom event with custom event object<br>
         * node.fire('foo', {<br>
         *   bar: 10<br>
         * });<br><br>
         *
         * // fire click event that bubbles<br>
         * node.fire('click', null, true);
         */
        fire: function(eventType, evt, bubble) {
            // bubble
            if (bubble) {
                this._fireAndBubble(eventType, evt || {});
            }
            // no bubble
            else {
                this._fire(eventType, evt || {});
            }
        },
        /**
         * get absolute transform of the node which takes into
         *  account its ancestor transforms
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getAbsoluteTransform: function() {
            // absolute transform
            var am = new Kinetic.Transform(),
                m;

            this._eachAncestorReverse(function(node) {
                m = node.getTransform();
                am.multiply(m);
            }, true);
            return am;
        },
        _getAndCacheTransform: function() {
            var m = new Kinetic.Transform(), 
                x = this.getX(), 
                y = this.getY(), 
                rotation = this.getRotation(),
                scaleX = this.getScaleX(), 
                scaleY = this.getScaleY(), 
                skewX = this.getSkewX(), 
                skewY = this.getSkewY(), 
                offsetX = this.getOffsetX(), 
                offsetY = this.getOffsetY();
                
            if(x !== 0 || y !== 0) {
                m.translate(x, y);
            }
            if(rotation !== 0) {
                m.rotate(rotation);
            }
            if(skewX !== 0 || skewY !== 0) {
                m.skew(skewX, skewY);
            }
            if(scaleX !== 1 || scaleY !== 1) {
                m.scale(scaleX, scaleY);
            }
            if(offsetX !== 0 || offsetY !== 0) {
                m.translate(-1 * offsetX, -1 * offsetY);
            }
             
            // cache result
            this.cachedTransform = m;
            return m;
        },
        /**
         * get transform of the node
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getTransform: function(useCache) {
            var cachedTransform = this.cachedTransform;
            if (useCache && cachedTransform) {
                return cachedTransform;
            }
            else {
                return this._getAndCacheTransform();
            }
        },
        /**
         * clone node.  Returns a new Node instance with identical attributes.  You can also override
         *  the node properties with an object literal, enabling you to use an existing node as a template
         *  for another node
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} attrs override attrs
         * @example
         * // simple clone<br>
         * var clone = node.clone();<br><br>
         *
         * // clone a node and override the x position<br>
         * var clone = rect.clone({<br>
         *   x: 5<br>
         * });
         */
        clone: function(obj) {
            // instantiate new node
            var className = this.getClassName(),
                node = new Kinetic[className](this.attrs),
                key, allListeners, len, n, listener;

            // copy over listeners
            for(key in this.eventListeners) {
                allListeners = this.eventListeners[key];
                len = allListeners.length;
                for(n = 0; n < len; n++) {
                    listener = allListeners[n];
                    /*
                     * don't include kinetic namespaced listeners because
                     *  these are generated by the constructors
                     */
                    if(listener.name.indexOf(KINETIC) < 0) {
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
         * Creates a composite data URL. If MIME type is not
         * specified, then "image/png" will result. For "image/jpeg", specify a quality
         * level as quality (range 0.0 - 1.0)
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toDataURL: function(config) {
            var config = config || {},
                mimeType = config.mimeType || null, 
                quality = config.quality || null,
                stage = this.getStage(),
                x = config.x || 0, 
                y = config.y || 0,
                canvas = new Kinetic.SceneCanvas({
                    width: config.width || stage.getWidth(), 
                    height: config.height || stage.getHeight(),
                    pixelRatio: 1
                }),
                context = canvas.getContext();
            
            context.save();

            if(x || y) {
                context.translate(-1 * x, -1 * y);
            }

            this.drawScene(canvas);
            context.restore();

            return canvas.toDataURL(mimeType, quality);
        },
        /**
         * converts node into an image.  Since the toImage
         *  method is asynchronous, a callback is required.  toImage is most commonly used
         *  to cache complex drawings as an image so that they don't have to constantly be redrawn
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         * @example
         * var image = node.toImage({<br>
         *   callback: function(img) {<br>
         *     // do stuff with img<br>
         *   }<br>
         * });
         */
        toImage: function(config) {
            Kinetic.Util._getImage(this.toDataURL(config), function(img) {
                config.callback(img);
            });
        },
        /**
         * set size
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function() {
            // set stage dimensions
            var size = Kinetic.Util._getSize(Array.prototype.slice.call(arguments));
            this.setWidth(size.width);
            this.setHeight(size.height);
        },
        /**
         * get size
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getSize: function() {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        /**
         * get width
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getWidth: function() {
            return this.attrs.width || 0;
        },
        /**
         * get height
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getHeight: function() {
            return this.attrs.height || 0;
        },
        /**
         * get class name, which may return Stage, Layer, Group, or shape class names like Rect, Circle, Text, etc.
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getClassName: function() {
            return this.className || this.nodeType;
        },
        /**
         * get the node type, which may return Stage, Layer, Group, or Node
         * @method
         * @memberof Kinetic.Node.prototype
         */
        getType: function() {
            return this.nodeType;
        },
        _get: function(selector) {
            return this.nodeType === selector ? [this] : [];
        },
        _off: function(type, name) {
            var evtListeners = this.eventListeners[type],
                i;
                
            for(i = 0; i < evtListeners.length; i++) {
                if(evtListeners[i].name === name) {
                    evtListeners.splice(i, 1);
                    if(evtListeners.length === 0) {
                        delete this.eventListeners[type];
                        break;
                    }
                    i--;
                }
            }
        },
        _clearTransform: function() {

            var trans = {
                x: this.getX(),
                y: this.getY(),
                rotation: this.getRotation(),
                scaleX: this.getScaleX(),
                scaleY: this.getScaleY(),
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                skewX: this.getSkewX(),
                skewY: this.getSkewY()
            };

            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scaleX = 1;
            this.attrs.scaleY = 1;
            this.attrs.offsetX = 0;
            this.attrs.offsetY = 0;
            this.attrs.skewX = 0;
            this.attrs.skewY = 0;

            return trans;
        },
        _setTransform: function(trans) {
            var key;
            
            for(key in trans) {
                this.attrs[key] = trans[key];
            }

            this.cachedTransform = null;
        },
        _fireBeforeChangeEvent: function(attr, oldVal, newVal) {
            this._fire(BEFORE + Kinetic.Util._capitalize(attr) + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        _fireChangeEvent: function(attr, oldVal, newVal) {
            this._fire(attr + CHANGE, {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        /**
         * set id
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} id
         */
        setId: function(id) {
            var oldId = this.getId(), 
                stage = this.getStage(), 
                go = Kinetic.Global;
                
            go._removeId(oldId);
            go._addId(this, id);
            this._setAttr(ID, id);
        },
        /**
         * set name
         * @method
         * @memberof Kinetic.Node.prototype
         * @param {String} name
         */
        setName: function(name) {
            var oldName = this.getName(), 
                stage = this.getStage(), 
                go = Kinetic.Global;
                
            go._removeName(oldName, this._id);
            go._addName(this, name);
            this._setAttr(NAME, name);
        },
        _setAttr: function(key, val) {
            var oldVal;
            if(val !== undefined) {
                oldVal = this.attrs[key];
                this._fireBeforeChangeEvent(key, oldVal, val);
                this.attrs[key] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _fireAndBubble: function(eventType, evt, compareShape) {
            if(evt && this.nodeType === SHAPE) {
                evt.targetNode = this;
            }
            var stage = this.getStage();
            var el = this.eventListeners;
            var okayToRun = true;

            if(eventType === MOUSEENTER && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }
            else if(eventType === MOUSELEAVE && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }

            if(okayToRun) {                
                this._fire(eventType, evt);

                // simulate event bubbling
                if(evt && !evt.cancelBubble && this.parent) {
                    if(compareShape && compareShape.parent) {
                        this._fireAndBubble.call(this.parent, eventType, evt, compareShape.parent);
                    }
                    else {
                        this._fireAndBubble.call(this.parent, eventType, evt);
                    }
                }
            }
        },
        _fire: function(eventType, evt) {
            var events = this.eventListeners[eventType],
                len, i;
                
            if (events) {
                len = events.length;
                for(i = 0; i < len; i++) {
                    events[i].handler.call(this, evt);
                }
            }
        },
        /*
         * draw both scene and hit graphs.  If the node being drawn is the stage, all of the layers will be cleared and redra
         * @method
         * @memberof Kinetic.Node.prototype
         *  the scene renderer
         */
        draw: function() {
            var evt = {
                node: this
            };
            
            this._fire(BEFORE_DRAW, evt);
            this.drawScene();
            this.drawHit();
            this._fire(DRAW, evt);
        },
        shouldDrawHit: function() { 
            return this.isVisible() && this.isListening() && !Kinetic.Global.isDragging(); 
        }
    });

    // add getter and setter methods
    Kinetic.Node.addGetterSetter = function(constructor, attr, def, isTransform) {
        this.addGetter(constructor, attr, def);
        this.addSetter(constructor, attr, isTransform);
    };
    Kinetic.Node.addPointGetterSetter = function(constructor, attr, def, isTransform) {
        this.addPointGetter(constructor, attr);
        this.addPointSetter(constructor, attr);  

        // add invdividual component getters and setters
        this.addGetter(constructor, attr + UPPER_X, def);
        this.addGetter(constructor, attr + UPPER_Y, def);
        this.addSetter(constructor, attr + UPPER_X, isTransform);
        this.addSetter(constructor, attr + UPPER_Y, isTransform);
    };
    Kinetic.Node.addRotationGetterSetter = function(constructor, attr, def, isTransform) {
        this.addRotationGetter(constructor, attr, def);
        this.addRotationSetter(constructor, attr, isTransform);    
    };
    Kinetic.Node.addColorGetterSetter = function(constructor, attr) {
        this.addGetter(constructor, attr);
        this.addSetter(constructor, attr); 
  
        // component getters 
        this.addColorRGBGetter(constructor, attr);
        this.addColorComponentGetter(constructor, attr, R);
        this.addColorComponentGetter(constructor, attr, G);
        this.addColorComponentGetter(constructor, attr, B);

        // component setters
        this.addColorRGBSetter(constructor, attr);
        this.addColorComponentSetter(constructor, attr, R);
        this.addColorComponentSetter(constructor, attr, G);
        this.addColorComponentSetter(constructor, attr, B);
    };
    Kinetic.Node.addColorRGBGetter = function(constructor, attr) {
        var method = GET + Kinetic.Util._capitalize(attr) + RGB;
        constructor.prototype[method] = function() {
            return Kinetic.Util.getRGB(this.attrs[attr]);
        };
    };
    Kinetic.Node.addColorRGBSetter = function(constructor, attr) {
        var method = SET + Kinetic.Util._capitalize(attr) + RGB;

        constructor.prototype[method] = function(obj) {
            var r = obj && obj.r !== undefined ? obj.r | 0 : this.getAttr(attr + UPPER_R),
                g = obj && obj.g !== undefined ? obj.g | 0 : this.getAttr(attr + UPPER_G),
                b = obj && obj.b !== undefined ? obj.b | 0 : this.getAttr(attr + UPPER_B);

            this._setAttr(attr, HASH + Kinetic.Util._rgbToHex(r, g, b));
        };
    };
    Kinetic.Node.addColorComponentGetter = function(constructor, attr, c) {
        var prefix = GET + Kinetic.Util._capitalize(attr),
            method = prefix + Kinetic.Util._capitalize(c);
        constructor.prototype[method] = function() {
            return this[prefix + RGB]()[c];
        };
    };
    Kinetic.Node.addColorComponentSetter = function(constructor, attr, c) {
        var prefix = SET + Kinetic.Util._capitalize(attr),
            method = prefix + Kinetic.Util._capitalize(c);
        constructor.prototype[method] = function(val) {
            var obj = {};
            obj[c] = val;
            this[prefix + RGB](obj);
        };
    };
    Kinetic.Node.addSetter = function(constructor, attr, isTransform) {
        var that = this,
            method = SET + Kinetic.Util._capitalize(attr);
            
        constructor.prototype[method] = function(val) {
            this._setAttr(attr, val);
            if (isTransform) {
                this.cachedTransform = null;
            }
        };
    };
    Kinetic.Node.addPointSetter = function(constructor, attr) {
        var that = this,
            baseMethod = SET + Kinetic.Util._capitalize(attr);
            
        constructor.prototype[baseMethod] = function() {
            var pos = Kinetic.Util._getXY([].slice.call(arguments)),
                oldVal = this.attrs[attr],
                x = 0,
                y = 0;

            if (pos) {
              x = pos.x;
              y = pos.y;

              this._fireBeforeChangeEvent(attr, oldVal, pos);
              if (x !== undefined) {
                this[baseMethod + UPPER_X](x);
              }
              if (y !== undefined) {
                this[baseMethod + UPPER_Y](y);
              }
              this._fireChangeEvent(attr, oldVal, pos);
            }    
        };
    };
    Kinetic.Node.addRotationSetter = function(constructor, attr, isTransform) {
        var that = this,
            method = SET + Kinetic.Util._capitalize(attr);
            
        // radians
        constructor.prototype[method] = function(val) {
            this._setAttr(attr, val);
            if (isTransform) {
                this.cachedTransform = null;
            }
        };
        // degrees
        constructor.prototype[method + DEG] = function(deg) {
            this._setAttr(attr, Kinetic.Util._degToRad(deg));
            if (isTransform) {
                this.cachedTransform = null;
            }
        };
    };
    Kinetic.Node.addGetter = function(constructor, attr, def) {
        var that = this,
            method = GET + Kinetic.Util._capitalize(attr);
           
        constructor.prototype[method] = function(arg) {
            var val = this.attrs[attr];
            if (val === undefined) {
                val = def; 
            }

            return val;    
        };
    };
    Kinetic.Node.addPointGetter = function(constructor, attr) {
        var that = this,
            baseMethod = GET + Kinetic.Util._capitalize(attr);
            
        constructor.prototype[baseMethod] = function(arg) {
            var that = this;
            return {
                x: that[baseMethod + UPPER_X](),
                y: that[baseMethod + UPPER_Y]()
            };  
        };
    };
    Kinetic.Node.addRotationGetter = function(constructor, attr, def) {
        var that = this,
            method = GET + Kinetic.Util._capitalize(attr);
            
        // radians
        constructor.prototype[method] = function() {
            var val = this.attrs[attr];
            if (val === undefined) {
                val = def; 
            }
            return val;
        };
        // degrees
        constructor.prototype[method + DEG] = function() {
            var val = this.attrs[attr];
            if (val === undefined) {
                val = def; 
            }
            return Kinetic.Util._radToDeg(val);
        };
    };
    /**
     * create node with JSON string.  De-serializtion does not generate custom
     *  shape drawing functions, images, or event handlers (this would make the
     * 	serialized object huge).  If your app uses custom shapes, images, and
     *  event handlers (it probably does), then you need to select the appropriate
     *  shapes after loading the stage and set these properties via on(), setDrawFunc(),
     *  and setImage() methods
     * @method
     * @memberof Kinetic.Node
     * @param {String} JSON string
     * @param {DomElement} [container] optional container dom element used only if you're
     *  creating a stage node
     */
    Kinetic.Node.create = function(json, container) {
        return this._createNode(JSON.parse(json), container);
    };
    Kinetic.Node._createNode = function(obj, container) {
        var className = Kinetic.Node.prototype.getClassName.call(obj),
            children = obj.children,
            no, len, n;

        // if container was passed in, add it to attrs
        if(container) {
            obj.attrs.container = container;
        }

        no = new Kinetic[className](obj.attrs);
        if(children) {
            len = children.length;
            for(n = 0; n < len; n++) {
                no.add(this._createNode(children[n]));
            }
        }

        return no;
    };
    // add getters setters
    Kinetic.Node.addGetterSetter(Kinetic.Node, 'x', 0, true);

    /**
     * set x position
     * @name setX
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} x
     */

    /**
     * get x position
     * @name getX
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addGetterSetter(Kinetic.Node, 'y', 0, true);

    /**
     * set y position
     * @name setY
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} y
     */

    /**
     * get y position
     * @name getY
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addGetterSetter(Kinetic.Node, 'opacity', 1);

    /**
     * set opacity.  Opacity values range from 0 to 1.
     *  A node with an opacity of 0 is fully transparent, and a node
     *  with an opacity of 1 is fully opaque
     * @name setOpacity
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Object} opacity
     */

    /**
     * get opacity.
     * @name getOpacity
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addGetter(Kinetic.Node, 'name');

     /**
     * get name
     * @name getName
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addGetter(Kinetic.Node, 'id');

    /**
     * get id
     * @name getId
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addRotationGetterSetter(Kinetic.Node, 'rotation', 0, true);

    /**
     * set rotation in radians
     * @name setRotation
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} theta
     */

    /**
     * set rotation in degrees
     * @name setRotationDeg
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} deg
     */

    /**
     * get rotation in degrees
     * @name getRotationDeg
     * @method
     * @memberof Kinetic.Node.prototype
     */

    /**
     * get rotation in radians
     * @name getRotation
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addPointGetterSetter(Kinetic.Node, 'scale', 1, true);

    /**
     * set scale
     * @name setScale
     * @param {Number} scale
     * @method
     * @memberof Kinetic.Node.prototype
     * @example
     * // set x and y to the same value<br>
     * shape.setScale(5);<br><br>
     *
     * // set x and y<br>
     * shape.setScale(20, 40);<br><br>
     *
     * // set x only <br>
     * shape.setScale({<br>
     *   x: 20<br>
     * });<br><br>
     *
     * // set x and y using an array<br>
     * shape.setScale([20, 40]);
     */

     /**
     * set scale x
     * @name setScaleX
     * @param {Number} x
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * set scale y
     * @name setScaleY
     * @param {Number} y
     * @method
     * @memberof Kinetic.Node.prototype
     */

    /**
     * get scale
     * @name getScale
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * get scale x
     * @name getScaleX
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * get scale y
     * @name getScaleY
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addPointGetterSetter(Kinetic.Node, 'skew', 0, true);

    /**
     * set skew
     * @name setSkew
     * @param {Number} x
     * @param {Number} y
     * @method
     * @memberof Kinetic.Node.prototype
     * @example
     * // set x and y<br>
     * shape.setSkew(20, 40);<br><br>
     *
     * // set x only <br>
     * shape.setSkew({<br>
     *   x: 20<br>
     * });<br><br>
     *
     * // set x and y using an array<br>
     * shape.setSkew([20, 40]);<br><br>
     *
     * // set x and y to the same value<br>
     * shape.setSkew(5);
     */

     /**
     * set skew x
     * @name setSkewX
     * @param {Number} x
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * set skew y
     * @name setSkewY
     * @param {Number} y
     * @method
     * @memberof Kinetic.Node.prototype
     */

    /**
     * get skew 
     * @name getSkew
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * get skew x
     * @name getSkewX
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * get skew y
     * @name getSkewY
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addPointGetterSetter(Kinetic.Node, 'offset', 0, true);

    /**
     * set offset.  A node's offset defines the position and rotation point
     * @name setOffset
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} x
     * @param {Number} y
     * @example
     * // set x and y<br>
     * shape.setOffset(20, 40);<br><br>
     *
     * // set x only <br>
     * shape.setOffset({<br>
     *   x: 20<br>
     * });<br><br>
     *
     * // set x and y using an array<br>
     * shape.setOffset([20, 40]);<br><br>
     *
     * // set x and y to the same value<br>
     * shape.setOffset(5);
     */

     /**
     * set offset x
     * @name setOffsetX
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} x
     */

     /**
     * set offset y
     * @name setOffsetY
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} y
     */

    /**
     * get offset
     * @name getOffset
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * get offset x
     * @name getOffsetX
     * @method
     * @memberof Kinetic.Node.prototype
     */

     /**
     * get offset y
     * @name getOffsetY
     * @method
     * @memberof Kinetic.Node.prototype
     */

    Kinetic.Node.addSetter(Kinetic.Node, 'width');

    /**
     * set width
     * @name setWidth
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} width
     */

    Kinetic.Node.addSetter(Kinetic.Node, 'height');

    /**
     * set height
     * @name setHeight
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Number} height
     */

    Kinetic.Node.addSetter(Kinetic.Node, 'listening');

    /**
     * listen or don't listen to events
     * @name setListening
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Boolean} listening
     */

    Kinetic.Node.addSetter(Kinetic.Node, 'visible');

    /**
     * set visible
     * @name setVisible
     * @method
     * @memberof Kinetic.Node.prototype
     * @param {Boolean} visible
     */

    // aliases
    /**
     * Alias of getListening()
     * @name isListening
     * @method
     * @memberof Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening;
    /**
     * Alias of getVisible()
     * @name isVisible
     * @method
     * @memberof Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible;
    
    Kinetic.Collection.mapMethods(['on', 'off', 'draw']);
})();
