/**
 * [myUpload description]
 * @param  {[type]} options [description]
 * options.element          上传标签对象  [必填]
 * options.url              上传地址      [必填]
 * options.success          上传成功回调  [选填]
 * options.error            上传失败回调  [选填]
 * options.progress         上传进度回调  [选填]
 */
function myUpload(options) {
    if (!(this instanceof myUpload)) {
        return new myUpload(options);
    }
    this.init(options);
}

myUpload.prototype = {
    init: function(options) {
        if (!this.validateOptions(options)) {
            throw '参数错误';
        }

        this.xhr = new XMLHttpRequest();
        this.formdata = new FormData();
        this.element = options.element;
        this.url = options.url;
        this.options = options;

        this.initFile();

    },

    initFile: function() {
        var filename = 'files_';
        for (var i = 0; i < this.element.files.length; i++) {
            this.formdata.append(filename + i, this.element.files[0]);
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
        var self = this;
        self.xhr.upload.addEventListener("progress", function(e) {
            self.progress.call(self, e);
        }, false);
        self.addEventListener("load", function(e) {
            self.success.call(self, e);
        });
        self.addEventListener("error", function(e) {
            self.error.call(self, e);
        });

        self.xhr.open("POST", this.url);
        self.xhr.send(this.formdata);
    },

    addEventListener: function(type, callback) {
        this.xhr.addEventListener(type, callback, false);
    },

    success: function(e) {
        var response = e.target.response;
        var results = JSON.parse(response);
        this.options.success(results);
    },

    error: function(e) {
        var response = e.target.response;
        var results = JSON.parse(response);
        this.options.success(results);
    },

    progress: function(e) {
        // var response = e.target.response;
        // var results = JSON.parse(response);
        // this.options.success(results);
    }

}
