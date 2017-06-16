(function() {
    "use strict";

    var ws = new WebSocket("ws://192.168.4.114:3000/websocket");

    ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);

        if (msg.type === "file_change") {
            window.location.reload();
            return;
        }
    };

    ws.onclose = function() {
        console.log("close");
    };

    ws.onerror = function(evt) {
        console.log(evt);
    };
}());
