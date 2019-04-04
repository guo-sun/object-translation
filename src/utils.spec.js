import { pathify, select, place, visitReduce } from './utils'

describe('pathify', () => {
    it('should transform a string into a string array', () => {
        expect(pathify('propA.propB'))
            .toEqual([ 'propA', 'propB' ])
    })
})

describe('select', () => {
    it('should select a value from an object', () => {
        expect(select(['propA'], {propA: 'value in propA'}))
            .toEqual('value in propA')
    })

    it('should select a nested value', () => {
        expect(select(['propA', 'propB'], {
            propA: {
                propB: 'value in propB'
            }
        })).toEqual('value in propB')
    })

    it('should return undefined if the path does not exist', () => {
        expect(select(['missingPath'], {})).toBeUndefined()
    })
})

describe('place', () => {
    it('should place a value at a path of an object', () => {
        expect(place(['propA'], 'value in propA', {}))
            .toEqual({
                propA: 'value in propA'
            })
    })

    it('should place a value at a deep path', () => {
        expect(place(['propA', 'propB'], 'value in propB', {}))
            .toEqual({
                propA: {
                    propB: 'value in propB'
                }
            })
    })

    it('should not change sibling properties in path', () => {
        expect(place(['propA'], 'value in propA', {foo: 'foo'}))
            .toEqual({
                propA: 'value in propA',
                foo: 'foo'
            })

        expect(place(['propA', 'propB'], 'value in propB', {foo: 'foo'}))
            .toEqual({
                propA: {
                    propB: 'value in propB'
                },
                foo: 'foo'
            })

        expect(place(
            ['propA', 'propB', 'propC'],
            'value in propC',
            {
                propA:
                {
                    propB: {
                        baz: 'baz'
                    },
                    bar: 'bar'
                },
                foo: 'foo'
            }
        )).toEqual(
            {
                propA: {
                    propB: {
                        propC: 'value in propC',
                        baz: 'baz'
                    },
                    bar: 'bar'
                },
                foo: 'foo'
            }
        )
    })

    it('should not mutate the object', () => {
        const original = {foo: 'foo'}

        expect(place(['propA', 'propB'], 'value in propB', original))
            .toEqual({
                propA: {
                    propB: 'value in propB'
                },
                foo: 'foo'
            })

        expect(original).toEqual({
            foo: 'foo'
        })
    })

    it('should maintain array structures', () => {
        expect(place(['arr','0'], 'foo', {arr:['a','b']})).toEqual({
            arr: expect.arrayContaining([
                'foo','b'
            ])
        })
    })
})

describe('visitReduce', () => {
    it('should visit all paths of primitives in an object', () => {
        const obj = {
            propA: {
                propB: {
                    propC: 'value in propC',
                    baz: 'baz',
                    undef: undefined
                },
                bar: 'bar'
            },
            foo: 'foo',
            notHere: null,
            arr: [
                '0th',
                '1st',
                '2nd'
            ]
        }

        const valuesAtPath = (valuePaths, path, value) =>
            valuePaths.concat(`${path.join('/')} contains ${value}`)

        const allValuesAtPaths = visitReduce(valuesAtPath, obj, [])
        const expectedValuesAtPaths = [
            'propA/propB/propC contains value in propC',
            'propA/propB/baz contains baz',
            'propA/bar contains bar',
            'foo contains foo',
            'notHere contains null',
            'propA/propB/undef contains undefined',
            'arr/0 contains 0th',
            'arr/1 contains 1st',
            'arr/2 contains 2nd',
        ]

        expect(allValuesAtPaths).toEqual(expect.arrayContaining(expectedValuesAtPaths)) 
        expect(allValuesAtPaths).toHaveLength(expectedValuesAtPaths.length)
    })

    it('should not mutate the initial accumulator', () => {
        const target = {
            propA: 'propA',
            propB: 'propB'
        }

        const source = {
            foo: 'foo',
            propA: 'another propA'
        }

        const copy = (acc, path, value) => place(path, value, acc)

        expect(visitReduce(copy, source, target)).toEqual({
            propA: 'another propA',
            propB: 'propB',
            foo: 'foo'
        })

        expect(target).toEqual({
            propA: 'propA',
            propB: 'propB'
        })

        expect(source).toEqual({
            foo: 'foo',
            propA: 'another propA'
        })
    })
})
