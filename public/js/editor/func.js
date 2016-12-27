function Editor() {
    
}

Editor.prototype.base = function () {
    $(function () {
        testEditor = editormd("test-editormd", {
            width: "90%",
            height: 640,
            syncScrolling: "single",
            saveHTMLToTextarea: true,
            path: "/editor/lib/",
            imageUpload: true,
            imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL: "/upload/editor"
        });

    });
}

Editor.prototype.load = function (param) {
    $(function () {
        $.get("/blog/find/"+param, function (md) {
            if(!md){
                $('#uploadForm').html('没有这个博客记录')
                return
            }
            testEditor = editormd("test-editormd", {
                width: "90%",
                height: 740,
                path: "/editor/lib/",
                appendMarkdown: "\n" + md,
                saveHTMLToTextarea: true,
                watch: false,
                htmlDecode: true,
                toolbar: false,
                previewCodeHighlight: false,
                tex: true,
                flowChart: true,
                sequenceDiagram: true,
                emoji: true,
                taskList: true,
                imageUpload: true,
                imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                imageUploadURL: "/upload/editor",
                onload: function () {
                    console.log('onload', this);
                    this.config("lineNumbers", false);
                    this.config({
                        toc: false,
                        tex: false,
                        toolbar: true,
                        previewCodeHighlight: true, // before set previewCodeHighlight == false, editor not load pretty.js, so now codes can't highlight and display line numbers.
                        flowChart: false,
                        sequenceDiagram: false,
                        dialogLockScreen: false,
                        dialogMaskOpacity: 0.5,       // 设置透明遮罩层的透明度，全局通用，默认值为0.1
                        dialogDraggable: false,
                        dialogMaskBgColor: "#000"
                    });

                    this.config("onresize", function () {
                        console.log("onresize =>", this);
                    });

                    this.watch();
                }
            });
        });
    });
}