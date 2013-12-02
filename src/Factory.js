 (function() {
    // CONSTANTS
    var ABSOLUTE_OPACITY = 'absoluteOpacity',
        ABSOLUTE_TRANSFORM = 'absoluteTransform',
        ADD = 'add',
        B = 'b',
        BEFORE = 'before',
        BLACK = 'black',
        CHANGE = 'Change',
        CHILDREN = 'children',
        DEG = 'Deg',
        DOT = '.',
        EMPTY_STRING = '',
        G = 'g',
        GET = 'get',
        HASH = '#',
        ID = 'id',
        KINETIC = 'kinetic',
        LISTENING = 'listening',
        MOUSEENTER = 'mouseenter',
        MOUSELEAVE = 'mouseleave',
        NAME = 'name',
        OFF = 'off',
        ON = 'on',
        PRIVATE_GET = '_get',
        R = 'r',
        RGB = 'RGB',
        SET = 'set',
        SHAPE = 'Shape',
        SPACE = ' ',
        STAGE = 'Stage',
        TRANSFORM = 'transform',
        UPPER_B = 'B',
        UPPER_G = 'G',
        UPPER_HEIGHT = 'Height',
        UPPER_R = 'R',
        UPPER_WIDTH = 'Width',
        UPPER_X = 'X',
        UPPER_Y = 'Y',
        VISIBLE = 'visible',
        X = 'x',
        Y = 'y';

    Kinetic.Factory = {
        addGetterSetter: function() {
            var constructor = arguments[0],
                baseAttr = arguments[1],
                util = Kinetic.Util,
                def, component, index;

            // base method
            if (arguments.length <= 3) {
                def = arguments[2];
                if (util._isArray(def)) {
                    def = util.cloneArray(def);
                }
                this._addGetter(constructor, baseAttr, def);
                this._addSetter(constructor, baseAttr);
            }
            // component method
            else {
                component = arguments[2];
                index = arguments[3];
                def = arguments[4];
                this._addComponentGetter(constructor, baseAttr, component, index, def);
                this._addComponentSetter(constructor, baseAttr, component, index);
            }
        },
        _addGetter: function(constructor, baseAttr, def) {
            var method = GET + Kinetic.Util._capitalize(baseAttr);

            constructor.prototype[method] = function() {
                var val = this.attrs[baseAttr];
                return val === undefined ? def : val;
            };
        },
        _addSetter: function(constructor, baseAttr) {
            var method = SET + Kinetic.Util._capitalize(baseAttr);

            constructor.prototype[method] = function(val) {
                this._setAttr(baseAttr, val);   
            };
        },
        _addComponentGetter: function(constructor, baseAttr, component, index, def) {
            var method = GET + Kinetic.Util._capitalize(baseAttr) + Kinetic.Util._capitalize(component);

            constructor.prototype[method] = function() {
                var base = this.attrs[baseAttr],
                    val = base && base[index];
                return val === undefined ? def : val;
            };
        },
        _addComponentSetter: function(constructor, baseAttr, component, index) {
            var method = SET + Kinetic.Util._capitalize(baseAttr) + Kinetic.Util._capitalize(component);

            constructor.prototype[method] = function(val) {
                this._setComponentAttr(baseAttr, index, val);   
            };
        },





        // ------------------------------- old methods to be deprecated -----------------------------------








        addXYGetterSetter: function(constructor, attr, def) {
            var that = this,
                capitalAttr = Kinetic.Util._capitalize(attr),
                getter = GET + capitalAttr,
                setter = SET + capitalAttr;

            // getters
            constructor.prototype[getter] = function() {
                var val = this.attrs[attr];
                return val === undefined ? [def,def] : val;
            };

            constructor.prototype[getter + UPPER_X] = function() {
                var baseVal = this.attrs[attr],
                    val = baseVal && baseVal[0];
                return val === undefined ? def : val;
            };

            constructor.prototype[getter + UPPER_Y] = function() {
                var baseVal = this.attrs[attr],
                    val = baseVal && baseVal[1];
                return val === undefined ? def : val;
            };

            // setters
            constructor.prototype[setter] = function(val) {
                this._setAttr(attr, val);  
            };
        },
        addBoxGetterSetter: function(constructor, attr, def) {
            this.addGetter(constructor, attr, def);
            this.addSetter(constructor, attr);

            // add invdividual component getters and setters
            this.addGetter(constructor, attr + UPPER_X, def);
            this.addGetter(constructor, attr + UPPER_Y, def);
            this.addGetter(constructor, attr + UPPER_WIDTH, def);
            this.addGetter(constructor, attr + UPPER_HEIGHT, def);

            this.addSetter(constructor, attr + UPPER_X);
            this.addSetter(constructor, attr + UPPER_Y);
            this.addSetter(constructor, attr + UPPER_WIDTH);
            this.addSetter(constructor, attr + UPPER_HEIGHT);
        },
        addPointsGetterSetter: function(constructor, attr) {
            this.addGetter(constructor, attr);
            this.addSetter(constructor, attr);
        },
        addRotationGetterSetter: function(constructor, attr, def) {
            this.addRotationGetter(constructor, attr, def);
            this.addRotationSetter(constructor, attr);
        },
        addColorGetterSetter: function(constructor, attr) {
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
        },

        // getter adders
        addColorRGBGetter: function(constructor, attr) {
            var method = GET + Kinetic.Util._capitalize(attr) + RGB;
            constructor.prototype[method] = function() {
                return Kinetic.Util.getRGB(this.attrs[attr]);
            };
        },

        addColorComponentGetter: function(constructor, attr, c) {
            var prefix = GET + Kinetic.Util._capitalize(attr),
                method = prefix + Kinetic.Util._capitalize(c);
            constructor.prototype[method] = function() {
                return this[prefix + RGB]()[c];
            };
        },
        addGetter: function(constructor, attr, def) {
            var that = this,
                method = GET + Kinetic.Util._capitalize(attr);

            constructor.prototype[method] = function() {
                var val = this.attrs[attr];
                return val === undefined ? def : val;
            };
        },
        addRotationGetter: function(constructor, attr, def) {
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
        },

        // setter adders
        addColorRGBSetter: function(constructor, attr) {
            var method = SET + Kinetic.Util._capitalize(attr) + RGB;

            constructor.prototype[method] = function(obj) {
                var r = obj && obj.r !== undefined ? obj.r | 0 : this.getAttr(attr + UPPER_R),
                    g = obj && obj.g !== undefined ? obj.g | 0 : this.getAttr(attr + UPPER_G),
                    b = obj && obj.b !== undefined ? obj.b | 0 : this.getAttr(attr + UPPER_B);

                this._setAttr(attr, HASH + Kinetic.Util._rgbToHex(r, g, b));
            };
        },

        addColorComponentSetter: function(constructor, attr, c) {
            var prefix = SET + Kinetic.Util._capitalize(attr),
                method = prefix + Kinetic.Util._capitalize(c);
            constructor.prototype[method] = function(val) {
                var obj = {};
                obj[c] = val;
                this[prefix + RGB](obj);
            };
        },
        addSetter: function(constructor, attr) {
            var method = SET + Kinetic.Util._capitalize(attr);

            constructor.prototype[method] = function(val) {
                this._setAttr(attr, val);   
            };
        },
        addRotationSetter: function(constructor, attr) {
            var that = this,
                method = SET + Kinetic.Util._capitalize(attr);

            // radians
            constructor.prototype[method] = function(val) {
                this._setAttr(attr, val);
            };
            // degrees
            constructor.prototype[method + DEG] = function(deg) {
                this._setAttr(attr, Kinetic.Util._degToRad(deg));
            };
        }
    };
})();