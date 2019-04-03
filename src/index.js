import {
    pathify,
    select,
    place,
    visitReduce
} from './utils'

export const buildArrow = (from, to) => (origin, target) => place(to, select(from, origin), target)

export const bundleArrows = arrows => (origin, target) =>
    arrows.reduce(
        (acc, arrow) => arrow(origin, acc),
        {...target}
    )

export const parseTranslationMap = translationMap => {
    const isArrowDefinition = value => typeof value === 'string'

    const parseNodes = ([toThis, toOther], mapNodePath, mapNodeValue) => {
        if (isArrowDefinition(mapNodeValue)) {
            const otherPath = pathify(mapNodeValue)
            const thisPath = mapNodePath

            toThis.push(buildArrow(otherPath, thisPath)),
            toOther.push(buildArrow(thisPath, otherPath))
        }

        return [toThis, toOther]
    }

    const [toThis, toOther] = visitReduce(parseNodes, translationMap, [[],[]])

    return [bundleArrows(toThis), bundleArrows(toOther)]
}
