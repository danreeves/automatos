(function (window, document, undefined) {
    'use strict';

    var vendors = ['webkit', 'moz'];
    // var requestAnimationFrame;
    // var cancelAnimationFrame;

    // for(var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
    //     requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    //     cancelAnimationFrame = (window[vendors[x]+'CancelAnimationFrame'] ||
    //                             window[vendors[x]+'CancelRequestAnimationFrame']);
    // }

    // if (!requestAnimationFrame) {
    //     requestAnimationFrame = window.requestAnimationFrame;
    //     cancelAnimationFrame = window.cancelAnimationFrame;
    // }

    function whichTransitionEvent () {
        var t,
            el = document.createElement('fake'),
            transitions = {
                'animation': 'animationend',
                'OAnimation': 'oAnimationEnd',
                'MozAnimation': 'Animationend',
                'WebkitAnimation': 'webkitAnimationEnd'
            };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    function whichStyleName () {
        var el = document.createElement('fake'),
            names = ['animation', '-webkit-animation'];

        for (var i = names.length - 1; i >= 0; i--) {
            if (el.style[names[i]] != null) return names[i];
        }
    }

    function loop (ts) {
        // console.log(ts);
        requestAnimationFrame(loop);
    }

    function automatos (element, animationName, animationLength) {
        var el = (typeof element === 'string') ? document.querySelector(element) : element,
            endEvent = whichTransitionEvent(),
            style = whichStyleName();
        var auto = new Promise(function (resolve) {

            el.addEventListener(endEvent, function (e) {
                el.style[style+'-name'] = null;
                el.style[style+'-duration'] = null;
                el.removeEventListener(endEvent);
                resolve();
            });
            el.style[style+'-name'] = animationName;
            el.style[style+'-duration'] = animationLength + 's';

        });
        auto.start = Math.floor( Date.now() / 1000);
        auto.after = function (ms, callback) {
            console.log(ms, this.start-Math.floor(Date.now()/1000));
            requestAnimationFrame(loop);
            return this;
        };
        return auto;
    }

    // var transitionEvent = whichTransitionEvent();
    // transitionEvent && e.addEventListener(transitionEvent, function() {
    // });

    if (typeof define === 'function' && define.amd) {
        define(function() { return automatos; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = automatos;
    } else if (typeof window !== 'undefined') {
        window.automatos = window.swal = automatos;
    }

})(window, document);
