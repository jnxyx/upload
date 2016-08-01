/**
 * [myUpload description] created by xyx
 * 支持拖拽上传
 * @param  {[type]} options [description]
 * options.element          上传标签对象       [必填]
 * options.url              上传地址           [必填]
 * options.success          上传成功回调       [选填]
 * options.error            上传失败回调       [选填]
 * options.progress         上传进度回调       [选填]
 * options.dragElement      拖拽容器对象       [选填]
 * options.dragClass        拖拽样式           [选填]
 * 
 * options.uploadContainer  上传回调容器       [选填]
 * options.uploadTemp       上传模板           [选填]
 * options.uploadTempRep    上传模板替换规则   [选填] --- 待开发
 * 
 * options.ext              允许上传文件格式   [选填] --- 待开发
 * options.size             允许上传文件大小   [选填] --- 待开发
 * 
 * options.files            当前所有文件（函数)[选填] --- 待开发
 *
 * 删除功能  --- 待开发
 * 加载功能  --- 待开发
 * 
 */
function myUpload(options) {
    if (!(this instanceof myUpload)) {
        return new myUpload(options);
    }
    this.init(options);

    return this;
}

myUpload.prototype = {
    init: function(options) {
        var self = this;
        if (!self.validateOptions(options)) {
            throw '参数错误';
        }

        self.xhr = new XMLHttpRequest();
        self.formData = new FormData();
        self.element = options.element;
        self.url = options.url;
        self.options = options;

        self.index = 0;
        self.indexContainer = [];

        //初始化ajax事件
        self.initAjaxEvent();

        //初始化元素事件
        self.initEvent();

        // self.sendFile();

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
        var filename = 'files_';

        if (file) {
            var filesArray = [file];
        } else {
            var filesArray = this.element.files;
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

    validateOptions: function(options) {
        if (!options.element || !options.url) {
            return false;
        } else {
            return true;
        }
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
        if (this.options.success) {
            this.options.success(results);
        } else if (this.options.uploadContainer) {
            var uploadContainer = this.options.uploadContainer;
            if (results.data.length) {
                for (var i = 0; i < results.data.length; i++) {
                    var item = results.data[i];
                    if (this.options.uploadTemp) {
                        var html = this.options.uploadTemp.replace(/(\{src\})/, item);
                        uploadContainer.innerHTML += html;
                    }
                }
            }
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
        return document.getElementById(id);
    },

    getClass: function(className) {
        return document.getElementsByClassName(className);
    }

}
