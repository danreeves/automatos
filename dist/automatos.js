/**
 * automatos - A CSS Animation controller
 * @version v0.0.0
 * @author Dan Reeves <hey@danreev.es> (http://danreev.es/)
 * @link https://github.com/danreeves/automatos
 * @license MIT
 */
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

    function automatos (opts) {

        if (opts == null) throw 'NotEnoughArguments Error!';
        if (!opts.el || !opts.name || !opts.duration) throw 'NotEnoughArguments Error!';

        var options = {
            el: opts.el || false,
            name: opts.name || false,
            duration: opts.duration || false,
            iterations: opts.iterations || false,
            direction: opts.direction || false,
            delay: opts.delay || false,
            fillMode: opts.fillMode || false,
            timingFunc: opts.timingFunc || false
        };

        var el = (typeof options.el === 'string') ? document.querySelector(options.el) : options.el,
            endEvent = whichTransitionEvent(),
            style = whichStyleName();

        // Promise definition
        var auto = {};
        auto.promise = new Promise(function (resolve) {
            var eh = function (e) {
                auto.stopped = true;
                el.style[style+'-name'] = null;
                el.style[style+'-duration'] = null;
                el.style[style+'-play-state'] = null;
                el.style[style+'-iteration-count'] = null;
                el.style[style+'-timing-function'] = null;
                el.style[style+'-fill-mode'] = null;
                el.style[style+'-direction'] = null;
                el.style[style+'-delay'] = null;
                el.removeEventListener(endEvent, eh);
                setTimeout(function () {
                    auto._runThens();
                    resolve(el);
                }, 0);
            };
            el.addEventListener(endEvent, eh);
            el.style[style+'-name'] = options.name;
            if (options.duration != null) el.style[style+'-duration'] = (options.duration/1000) + 's';
            if (options.iterations != null) el.style[style+'-iteration-count'] = options.iterations;
            if (options.direction != null) el.style[style+'-direction'] = options.direction;
            if (options.delay != null) el.style[style+'-delay'] = options.delay;
            if (options.fillMode != null) el.style[style+'-fill-mode'] = options.fillMode;
            if (options.timingFunction != null) el.style[style+'-timing-function'] = options.timingFunction;
        });

        auto.el = el;
        auto.start = Math.floor(Date.now());
        auto.stopped = false;
        auto.queue = [];
        auto.thenQueue = [];

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
        auto._runThens = function () {
            this.thenQueue.forEach(function (v, i, a) {
                a = a.splice(1, a.length);
                if (typeof v === 'function') v();
            });
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
        auto.then = function (callback) {
            this.thenQueue.push(callback.bind(this));
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
