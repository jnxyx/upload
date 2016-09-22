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
    
    /**{{ body }}**/
    /**  代码主体此处插入    **/

});