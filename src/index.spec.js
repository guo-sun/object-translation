import { buildArrow, bundleArrows, parseTranslationMap } from './'

describe('buildArrow', () => {
    const fooToBarArrow = buildArrow(['foo'],['bar'])

    it('should build a binary function which creates an object from a target object and one value in the tree of another origin object', () => {

        expect(fooToBarArrow({foo: 'foo', baz: 'baz'}, {quix: 'quix'}))
            .toEqual({
                bar: 'foo',
                quix: 'quix'
            })
    })

    describe('arrow', () => {
        it('should not mutate the origin or target', () => {
            const origin = {
                propA: 'propA',
                foo: 'foo'
            }

            const target = {
                propA: 'A',
                bar: 'bar'
            }

            expect(fooToBarArrow(origin, target)).toEqual({
                propA: 'A',
                bar: 'foo'
            })

            expect(origin).toEqual({
                propA: 'propA',
                foo: 'foo'
            })

            expect(target).toEqual({
                propA: 'A',
                bar: 'bar'
            })
        })

        it('should point to deep paths', () => {
            const fooBarBazToXYZ = buildArrow(['foo','bar','baz'], ['x','y','z'])

            const origin = {
                foo: {
                    bar: {
                        baz: 'baz'
                    }
                }
            }

            const target = {
                x: {
                    y: {
                        z: 'z'
                    }
                }
            }

            expect(fooBarBazToXYZ(origin, target)).toEqual({
                x: {
                    y: {
                        z: 'baz'
                    }
                }
            })
        })

        it('should not change or place any values except for the target path', () => {
            const fooBarBazToXYZ = buildArrow(['foo','bar','baz'], ['x','y','z'])

            const origin = {
                foo: {
                    bar: {
                        baz: 'baz',
                        quix: 'quix'
                    },

                }
            }

            const target = {
                x: {
                    y: {
                        z: 'z',
                        propC: 'propC'
                    },
                    propB: 'b'
                },
                propA: 'a'
            }

            expect(fooBarBazToXYZ(origin, target)).toEqual({
                x: {
                    y: {
                        z: 'baz',
                        propC: 'propC'
                    },
                    propB: 'b'
                },
                propA: 'a'
            })
        })
    })
})

describe('bundleArrows', () => {
    it('should build a function which applies a list of arrows', () => {
        const arrows = [
            buildArrow(['foo'], ['x']),
            buildArrow(['bar'], ['y']),
            buildArrow(['baz'], ['z'])
        ]

        const foosToXs = bundleArrows(arrows)

        expect(foosToXs({
            foo: 'foo',
            bar: 'bar',
            baz: 'baz'
        }, { quix: 'quix'})).toEqual({
            x: 'foo',
            y: 'bar',
            z: 'baz',
            quix: 'quix'
        })
    })
})

describe('parseTranslationMap', () => {
    it('should produce toThis and toOther arrow bundles', () => {
        const foosToXsTranslationMap = {
            foo: 'x',
            bar: 'y',
            baz: 'z'
        }

        const [toFoos, toXs] = parseTranslationMap(foosToXsTranslationMap)

        const foos = {
            foo: 'foo',
            bar: 'bar',
            baz: 'baz',
        }

        const xs = {
            x: 'x',
            y: 'y',
            z: 'z'
        }

        expect(toFoos(xs)).toEqual({
            foo: 'x',
            bar: 'y',
            baz: 'z'
        })

        expect(toXs(foos)).toEqual({
            x: 'foo',
            y: 'bar',
            z: 'baz'
        })
    })

    it('should produce arrows for nested maps', () => {
        const nestedMapBazToZ = {
            foo: {
                bar: {
                    baz: 'x.y.z'
                }
            }
        }

        const baz = {
            foo: {
                bar: {
                    baz: 'baz'
                }
            }
        }

        const z = {
            x: {
                y: {
                    z: 'z'
                }
            }
        }

        const [toBaz, toZ] = parseTranslationMap(nestedMapBazToZ)

        expect(toBaz(z)).toEqual({
            foo: {
                bar: {
                    baz: 'z'
                }
            }
        })

        expect(toZ(baz)).toEqual({
            x: {
                y: {
                    z: 'baz'
                }
            }
        })
    })

    it('should produce arrows for partially nested maps', () => {
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
    })

    it('should produce arrows for maps which point to objects', () => {
        const nestedMapBazToZ = {
            foo: {
                bar: 'x.y'
            }
        }

        const baz = {
            foo: {
                bar: {
                    baz: 'baz'
                }
            }
        }

        const z = {
            x: {
                y: {
                    z: 'z'
                }
            }
        }

        const [toBaz, toZ] = parseTranslationMap(nestedMapBazToZ)

        expect(toBaz(z)).toEqual({
            foo: {
                bar: {
                    z: 'z'
                }
            }
        })

        expect(toZ(baz)).toEqual({
            x: {
                y: {
                    baz: 'baz'
                }
            }
        })
    })

    it('should produce arrows for maps on objects containing arrays', () => {
        const fooArrayMap = {
            fooArr: 'barArr'
        }

        const fooObj = {
            fooArr: [
                '0th',
                '1st',
                '2nd'
            ]
        }

        const barObj = {
            barArr: [
                'a',
                'b',
                'c'
            ]
        }

        const [toFoo, toBar] = parseTranslationMap(fooArrayMap)

        expect(toFoo(barObj)).toEqual({
            fooArr: expect.arrayContaining([
                'a','b','c'
            ])
        })

        expect(toBar(fooObj)).toEqual({
            barArr: expect.arrayContaining([
                '0th','1st','2nd'
            ])
        })
    })
})
