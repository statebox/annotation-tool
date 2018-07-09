
// monkey patch a ready function onto document
// from https://gist.github.com/tjbenton/4186f003329c623e53f5d4a31744b054
; (function (doc, win, add, remove, loaded, load) {
    doc.ready = new Promise(function (resolve) {
        if (doc.readyState === 'complete') {
            resolve();
        } else {
            function onReady() {
                resolve();
                doc[remove](loaded, onReady, true);
                win[remove](load, onReady, true);
            }
            doc[add](loaded, onReady, true);
            win[add](load, onReady, true);
        }
    });
})(document, window, 'addEventListener', 'removeEventListener', 'DOMContentLoaded', 'load');
