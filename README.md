# simple-object-translation

`parseTranslationMap` builds two translator functions from an object map. The first function takes an object from the shape implied by the map's paths to the map structure, and the second from the map structure to the implied object shape.

```js
import { parseTranslationMap } from 'simple-object-translation'

const foosToXsTranslationMap = {
    foo: 'x',
    bar: 'y.y',
    baz: 'y.z'
}

const [toFoos, toXs] = parseTranslationMap(foosToXsTranslationMap)

const foos = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
}

const xs = {
    x: 'x',
    y: {
        y: 'y',
        z: 'z'
    }
}

expect(toFoos(xs)).toEqual({
    foo: 'x',
    bar: 'y',
    baz: 'z'
})

expect(toXs(foos)).toEqual({
    x: 'foo',
    y: {
        y: 'bar',
        z: 'baz'
    }
})
```
