'use strict';

var vendors = ['webkit', 'moz'];
var requestAnimationFrame = undefined;
var cancelAnimationFrame = undefined;

for(var x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
    requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    cancelAnimationFrame = (window[vendors[x]+'CancelAnimationFrame'] ||
                            window[vendors[x]+'CancelRequestAnimationFrame']);
}

if (!requestAnimationFrame) {
  requestAnimationFrame = window.requestAnimationFrame;
  cancelAnimationFrame = window.cancelAnimationFrame;
}

function whichTransitionEvent () {
    var t,
        el = document.createElement('fake'),
        transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
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

var automatos = function automatos (element, animation, length) {
    var el = (typeof element === 'string') ? document.querySelector(element) : element,
        endEvent = whichTransitionEvent(),
        style = whichStyleName();

    el.addEventListener(endEvent, function (e) {
        console.log(e,'ended');
    });
    el.style[style+'-name'] = animation;
};

// var transitionEvent = whichTransitionEvent();
// transitionEvent && e.addEventListener(transitionEvent, function() {
// });

module.exports = automatos;
