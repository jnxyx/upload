var tools = {};

var each = tools.each = function(loopable, callback, self) {

        //保存追加参数
        var additionalArgs = Array.prototype.slice.call(arguments, 3);

        if (loopable) {
            //数组类型
            if (loopable.length === +loopable.length) {

                var i;
                for (i = 0; i < loopable.length; i++) {
                    callback.apply(self, [loopable[i], i].concat(additionalArgs));
                }
            }
            //对象类型
            else {

                for (var item in loopable) {
                    callback.apply(self, [loopable[item], item].concat(additionalArgs));
                }
            }
        }
    },

    cloneObject = tools.cloneObject = function(obj) {

        var objClone = {};

        each(obj, function(value, key) {
            if (obj.hasOwnProperty(key)) {
                objClone[key] = value;
            }
        });

        return objClone;
    },

    extend = tools.extend = function(base) {

        each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {

            each(extensionObject, function(value, key) {

                if (extensionObject.hasOwnProperty(key)) {
                    base[key] = value;
                }
            });
        });

        return base;
    },

    preExtend = tools.preExtend = function(base) {

        each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {

            each(extensionObject, function(value, key) {

                if (extensionObject.hasOwnProperty(key) && base.hasOwnProperty(key)) {
                    base[key] = value;
                }
            });
        });

        return base;
    },

    merge = tools.merge = function(base, master) {

        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift({});

        return extend.apply(null, args);
    };
