export const pathify = stringPath => stringPath.split('.') // TODO use regex for brackets

export const select = (path, obj) => {
    const ps = path.slice()

    let node = obj[ps.shift()]

    while (ps.length) {
        node = node[ps.shift()]

        if (node === undefined) {
            return
        }
    }

    return node
}

export const place = (path, value, obj) => {
    const ps = path.slice(0, -1)
    const leaf = path[path.length - 1]

    const workingObj = {...obj}

    let parentNode = workingObj

    while (ps.length) {
        const index = ps.shift()
        const _node = parentNode[index]
        const node = Array.isArray(_node) ? [..._node] : {..._node}

        parentNode[index] = node
        parentNode = node
    }

    parentNode[leaf] = value

    return workingObj
}

const isPrimitive = value => {
    if (typeof value === 'object') {
        return value === null
    }

    return true
}

// fn(acc, path, value) => obj => obj
export const visitReduce = (fn, obj, initialAcc) => {
    let acc = Array.isArray(initialAcc) ? [...initialAcc] : {...initialAcc}

    const visit = (maybeObj, path=[]) => {
        if (isPrimitive(maybeObj)) {
            acc = fn(acc, path, maybeObj)
        } else {
            for (const key in maybeObj) {
                visit(maybeObj[key], path.concat(key))
            }
        }
    }

    return visit(obj), acc
}
