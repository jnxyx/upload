/**
 * [Upload description] created by xyx
 * 支持拖拽上传
 * @param  {[type]} options [description]
 * options.id               上传标签对象ID       [必填]
 * options.url              上传地址           [必填]
 * options.success          上传成功回调       [选填]
 * options.error            上传失败回调       [选填]
 * options.progress         上传进度回调       [选填]
 * options.dragElement      拖拽容器对象       [选填]
 * options.dragClass        拖拽样式           [选填]
 * 
 * options.ext              允许上传文件格式   [选填] 
 * options.size             允许上传文件大小   [选填] 
 * options.validateCallBack 上传文件验证失败回调   [选填]
 * 
 * options.files            当前所有文件（函数)[选填] --- 待开发
 *
 * 删除功能  --- 待开发
 * 加载功能  --- 待开发
 * 上传数量限制、回调展示形式
 * 
 */
;
(function(global, factory) {

    if (typeof module === "object" && typeof module.exports === "object") {
        // 模块导出
        module.exports = global.document ?
            factory.call(global) :
            function(w) {
                if (!w.document) {
                    throw new Error("upload requires a window with a document");
                }
                return factory.call(global);
            };
    } else {
        factory.call(global);
    }

})(this, function() {

    var global = this;

    function upload(options) {

        if (!(this instanceof upload)) {
            return new upload(options);
        }
        this.init(options);

        return this;
    }

    var tools = upload.tools = {};

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

    upload.prototype = {
        init: function(options) {

            var self = this;

            options = cloneObject(options);

            self.options = {
                id: '',
                url: '',
                success: '',
                error: '',
                progress: '',
                dragElement: '',
                dragClass: '',
                ext: '',
                size: '',
                validateCallBack: ''
            };

            self.options = preExtend(self.options, options);

            if (!options.id || !options.url) {
                throw '缺少必要参数！';
            }

            self.xhr = new XMLHttpRequest();
            self.formData = new FormData();
            self.url = options.url;

            //初始化上传控件
            self.renderUploadElement();

            self.index = 0;
            self.indexContainer = [];

            //初始化ajax事件
            self.initAjaxEvent();

            //初始化元素事件
            self.initEvent();

        },

        initAjaxEvent: function() {

            var self = this;
            var xhr = self.xhr;

            // self.xhr.setRequestHeader("Content-type", "application/json");

            self.xhr.upload.addEventListener("progress", function(e) {
                self.progress.call(self, e);
            }, false);

            self.addEvent(xhr, "load", function(e) {
                self.success.call(self, e);
            });

            self.addEvent(xhr, "error", function(e) {
                self.error.call(self, e);
            });

            self.addEvent(xhr, "readystatechange", function(e) {
                // console.log(self.xhr.readyState);
                // console.log(self.xhr.status);
            });

        },

        initEvent: function() {

            var self = this;

            if (self.options.dragElement) {

                var dragElement = self.options.dragElement;
                var dragClass = self.options.dragClass || '';

                self.addEvent(dragElement, 'dragover', function(e) {
                    //阻止浏览器默认事件
                    e.preventDefault();
                    //阻止浏览器默认事件扩散
                    e.stopPropagation();
                    if (dragClass) {
                        dragElement.classList.add(dragClass);
                    }
                });
                self.addEvent(dragElement, 'dragleave', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (dragClass) {
                        dragElement.classList.remove(dragClass);
                    }
                });
                self.addEvent(dragElement, 'drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.sendFile(e.dataTransfer.files[0]);
                });
            }

            if (self.options.element) {

                var element = self.options.element;

                self.addEvent(element, 'change', function(e) {
                    self.sendFile();
                });
            }

        },

        //向服务器发送文件
        sendFile: function(file) {

            var self = this;
            file = file || null;

            if (!self.validateFile(file)) {

                if (self.validateInfo) {
                    if (self.options.validateCallBack) {
                        self.options.validateCallBack(self.validateInfo);
                    } else {
                        alert(self.validateInfo);
                    }
                }

                return;

            }

            var filename = 'files_';

            if (file) {
                var filesArray = [file];
            } else {
                var filesArray = self.element.files;
            }

            var formData = self.formData;

            //chrome支持，firefox不支持
            if (formData.forEach) {

                formData.forEach(function(file, key) {
                    if (formData.has(key)) {
                        formData.delete(key);
                    }
                });

            } else {

                for (var j in self.indexContainer) {

                    var item = self.indexContainer[j];
                    var key = filename + item;

                    if (formData.has(key)) {
                        formData.delete(key);
                    }
                }

                self.indexContainer = [];
            }

            for (var i = 0; i < filesArray.length; i++) {

                self.indexContainer.push(self.index);
                formData.append(filename + self.index, filesArray[0]);
                self.index++;
            }

            this.send();
        },

        validateFile: function(file) {

            var self = this;
            file = file ? file : self.element.files[0];

            if (file) {
                if (self.options.size && !self.validateSize(file)) {
                    self.validateInfo = '文件大小不符合要求！';
                    return false;
                }
                if (self.options.ext && !self.validateExt(file)) {
                    self.validateInfo = '文件格式不符合要求！';
                    return false;
                }
            }

            return true;
        },

        validateSize: function(file) {

            var self = this,
                size = file.size,
                limitSize = self.options.size.toLowerCase(),
                rules = /[gmkb]b?/.exec(limitSize);

            if (rules.length === 0) {
                return false;
            }

            var unit = rules[0].charAt(0);

            limitSize = parseInt(limitSize.split(unit)[0]);

            if (isNaN(limitSize)) {
                return false;
            }

            switch (unit) {
                case 'g':
                    limitSize *= 1024 * 1024 * 1024;
                    break;
                case 'm':
                    limitSize *= 1024 * 1024;
                    break;
                case 'k':
                    limitSize *= 1024;
                    break;
            }

            if (limitSize < size) {
                return false;
            }

            return true;
        },

        validateExt: function(file) {

            var self = this,
                ext = '.' + file.name.split('.')[file.name.split('.').length - 1],
                limitExt = self.options.ext.split(',');

            for (var i = 0; i < limitExt.length; i++) {
                limitExt[i].replace(/( )/g, '');
            }

            if (limitExt.indexOf(ext) == -1) {
                return false;
            }

            return true;
        },

        send: function() {
            this.xhr.open("POST", this.url);
            this.xhr.send(this.formData);
        },

        addEvent: function(el, type, callback) {
            el.addEventListener(type, callback, false);
        },

        success: function(e) {
            var response = e.target.response;
            var results = JSON.parse(response);

            this.renderSuccessCallback(results);

            if (this.options.success) {

                this.options.success(results);

            }

        },

        error: function(e) {
            if (this.options.error) {
                this.options.error(e);
            }
        },

        progress: function(e) {

            var percent = 100 * e.loaded / e.total;
            percent = percent.toFixed(2);
            percent += '%';

            if (this.options.progress) {

                this.options.progress(percent);

            }
        },

        getId: function(id) {
            return global.document.getElementById(id);
        },

        getClass: function(className) {
            return global.document.getElementsByClassName(className);
        },

        getElements: function(selectors) {
            return global.document.querySelector(selectors);
        },

        css: function(el, styleObject) {
            extend(el.style, styleObject);

            return el;
        },

        renderUploadElement: function() {

            var self = this;

            self.options.uploadContainer = self.getId(self.options.id);

            var uploadElement = global.document.createElement('a');

            self.css(uploadElement, {
                display: 'inline-block',
                width: '100px',
                height: '100px',
                border: '1px solid #eeeeee',
                backgroundImage: 'url("../img/add.jpg")',
                backgroundSize: 'cover',
                borderRadius: '5px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                margin: '5px'
            });

            uploadElement.onmouseover = function() {
                self.css(uploadElement, {
                    opacity: '0.8',
                    filter: 'alpha(opacity=80)'
                });
            };

            uploadElement.onmouseout = function() {
                self.css(uploadElement, {
                    opacity: '1',
                    filter: 'alpha(opacity=100)'
                });
            };

            var uploadInput = global.document.createElement('input');

            uploadInput.setAttribute('type', 'file');

            self.css(uploadInput, {
                position: 'absolute',
                right: '0',
                top: '0',
                fontSize: '99px',
                opacity: '0',
                outline: 'none',
                cursor: 'pointer',
                filter: 'alpha(opacity=0)'
            });

            uploadElement.appendChild(uploadInput);

            self.options.uploadContainer.appendChild(uploadElement);

            self.element = self.options.element = uploadInput;
        },

        renderSuccessCallback: function(results) {

            var self = this;

            if (results.data.length) {

                for (var i = 0; i < results.data.length; i++) {

                    var item = results.data[i];

                    var anchorElement = global.document.createElement('a');

                    self.css(anchorElement, {
                        display: 'inline-block',
                        width: '100px',
                        height: '100px',
                        border: '1px solid #eeeeee',
                        borderRadius: '5px',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        margin: '5px'
                    });

                    var imgElement = global.document.createElement('img');

                    imgElement.setAttribute('src', '../img/loading.gif');

                    self.preLoadImage(item, function() {
                        imgElement.setAttribute('src', item);
                    });

                    self.css(imgElement, {
                        width: '100%',
                        height: '100%'
                    });

                    anchorElement.appendChild(imgElement);

                    self.options.uploadContainer.insertBefore(anchorElement, self.element.parentNode);

                }
            }

        },

        //图片预加载
        preLoadImage: function(imgUrl, callback) {
            var imgElement = global.document.createElement('img');

            imgElement.src = imgUrl;

            imgElement.onload = callback;
        }

    }

    //模块导出
    if (typeof define === "function" && define.amd) {
        define("upload", [], function() {
            return upload;
        });
    }

    global.Upload = upload;

    return upload;

});
