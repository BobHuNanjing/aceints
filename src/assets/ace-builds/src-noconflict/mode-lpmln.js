var ace = require("ace-builds")
require("ace-builds/webpack-resolver");

var Worker = require('worker-loader!./my-worker.js');

ace.define('ace/mode/lpmln', [], function (require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;

    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


    // to define highlighting we need mode and highlight rules
    // normally highlight rules are defined in a separate file, 
    // but since this is used only in one place, this function is directly in the mode
    var LpmlnHighlightRules = function () {
        this.$rules = {
            "start": [
                {
                    "token": "keyword.other.define",
                    "regex": "(\\:-)"
                },
                {
                    "token": "keyword.operator.naf",
                    "regex": "((not))"
                },
                {
                    "token": "keyword.operator.neg",
                    "regex": "([\\-])"
                },
                {
                    "token": "markup.underline.weight",
                    "regex": "(\\d+:)"
                },
                {
                    "token": "string.regexp",
                    "regex": "(^\\w+(\\.*\\d{0,2})([+*/-]\\w+(\\.*\\d{0,2}))+)"
                },
                {
                    "token": "comment.line.percentage",
                    "regex": "(\\%.*)"
                },
                {
                    "token": "support.varaiable",
                    "regex": "([\\(\\)])"
                },
                {
                    "token": "variable.parameter",
                    "regex": "(?<=\\().*?(?=\\))"
                },
                {
                    defaultToken: "text",
                }
            ]
        };
        this.normalizeRules();
    };
    /* ------------------------ END ------------------------------ */
    oop.inherits(LpmlnHighlightRules, TextHighlightRules);
    exports.LpmlnHighlightRules = LpmlnHighlightRules;

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
    var CStyleFoldMode = require("./folding/cstyle").FoldMode;


    var Mode = function () {
        this.HighlightRules = LpmlnHighlightRules;
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CStyleFoldMode();

    };
    oop.inherits(Mode, TextMode);

    (function () {
        this.$id = "ace/mode/lpmln";
        var WorkerClient = require("ace/worker/worker_client").WorkerClient;
        function WebpackWorkerClient(worker) {
            this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
            this.changeListener = this.changeListener.bind(this);
            this.onMessage = this.onMessage.bind(this);
            this.$worker = worker;
            this.callbackId = 1;
            this.callbacks = {};
            this.$worker.onmessage = this.onMessage;
        }
        WebpackWorkerClient.prototype = WorkerClient.prototype;

        this.createWorker = function (session) {
            this.$worker = new WebpackWorkerClient(new Worker());
            this.$worker.attachToDocument(session.getDocument());

            this.$worker.on("errors", function (e) {
                session.setAnnotations(e.data);
            });

            this.$worker.on("annotate", function (e) {
                session.setAnnotations(e.data);
            });

            this.$worker.on("terminate", function () {
                session.clearAnnotations();
            });

            return this.$worker;
        };


    }).call(Mode.prototype);

    exports.Mode = Mode;
});


var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/lpmln");
editor.setOption("autoScrollEditorIntoView", true);
