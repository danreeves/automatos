# Automatos
> A CSS Animation library

Automatos is a small Javascript library for controlling CSS Animations.

## Usage

```
automatos({
    el: '.demo',
    name: 'fadeIn',
    duration: 1000,
});
```

## Options

```
{
    el: DOM node or selector string,
    name: string,
    duration: integer,
    iterations: integer or string,
    direction: string,
    delay: string,
    fillMode: string,
    timingFunc: string
}
```
e.g.

```
{
    el: document.querySelector('.demo'),
    name: 'bounce',
    duration: 1000,
    iterations: 'infinite',
    direction: 'reverse',
    delay: '1s',
    fillMode: 'forwards',
    timingFunc: 'ease-in-out'
}
```

## Methods

### `.after`

Calls a callback after the specified milliseconds.

e.g.

```
[...]
.after(100, function () {
    console.log('calls after 100ms');
})
```

### `.then`

Calls a callback when the animation is complete.

e.g.

```
[...]
.then(function () {
   console.log(this.el, 'has finished animating');
});
```

### `.play`

Sets the play-state to running.

e.g.

```
[...]
.play()
```

### `.pause`

Sets the play-state to paused.

e.g.

```
[...]
.pause()
```

### `.stop`

Stops the animation and emits the animation stopped event.

e.g.

```
[...]
.stop()
```

### `.promise`

A reference to the promise attached to the animation-end event.

e.g.

```
[...]
.promise.then(function () {
    // called when the animation is over
});

// or

var a1 = automatos(//put options here);
var a2 = automatos(//put options here);

Promise.all([a1.promise, a2.promise]).then(function () {
    // called when all animations are over
});

```
