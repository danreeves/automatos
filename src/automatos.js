(function (window, document, undefined) {
    'use strict';

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

    function automatos (element, animationName, animationLength, iterationCount, direction) {
        var el = (typeof element === 'string') ? document.querySelector(element) : element,
            endEvent = whichTransitionEvent(),
            style = whichStyleName();

        // Promise definition
        var auto = {};
        auto = new Promise(function (resolve) {
            el.addEventListener(endEvent, function (e) {
                auto.stopped = true;
                el.style[style+'-name'] = null;
                el.style[style+'-duration'] = null;
                el.style[style+'-play-state'] = null;
                el.style[style+'-iteration-count'] = null;
                el.removeEventListener(endEvent);
                setTimeout(function () {
                    resolve(el);
                }, 0);
            });
            el.style[style+'-name'] = animationName;
            if (animationLength != null) el.style[style+'-duration'] = (animationLength/1000) + 's';
            if (iterationCount != null) el.style[style+'-iteration-count'] = iterationCount;
            if (direction != null) el.style[style+'-direction'] = direction;
        });

        auto.el = el;
        auto.start = Math.floor(Date.now());
        auto.stopped = false;
        auto.queue = [];

        // "Private" methods
        auto._runQueue = function () {
            var that = this;
            setTimeout(function () {
                if (that.queue.length) {
                    var now = Math.floor(Date.now());
                    if ((now - that.start) >= that.queue[0].ms) {
                        that.queue[0].callback.bind(that)();
                        that.start = now;
                        that.queue = that.queue.slice(1, that.queue.length);
                    }
                    if (that.queue.length) that._runQueue();
                }
            }, 0);
        };

        // Public methods
        auto.after = function (ms, callback) {
            this.queue.push({
                ms: ms,
                callback: callback
            });
            this._runQueue();
            return this;
        };
        auto.play = function () {
            this.el.style[style+'-play-state'] = 'running';
            return this;
        };
        auto.pause = function () {
            this.el.style[style+'-play-state'] = 'paused';
            return this;
        };
        auto.stop = function () {
            var event = document.createEvent('AnimationEvent');
            event.initEvent(endEvent);
            this.el.dispatchEvent(event);
            return this;
        };
        auto.direction = function (direction) {
            this.el.style[style+'-direction'] = direction;
            return this;
        };

        return auto;
    }

    if (typeof define === 'function' && define.amd) {
        define(function() { return automatos; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = automatos;
    } else if (typeof window !== 'undefined') {
        window.automatos = automatos;
    }

})(window, document);
