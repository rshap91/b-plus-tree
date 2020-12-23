function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchTree(val, tree, insert=false) {
    if (tree.length === 0) {
        return {pointer: 0, path: [0], ix: 0}
    }
    let itr = tree[Symbol.iterator]()
    let path = [0]
    // {value: row, done: BOOL}
    let next = itr.next()
    let rowNum = 0
    let root = next.value[rowNum]
    let elem = document.querySelector('#nodeRow-0 > div.Node:nth-child(1)')
    
    var {ix, pointer} = findNextPointer(val, root)
    
    // color the path of pointers followed
    elem.classList.add('pointerPath')
    elem.querySelectorAll('td.nodePointer')[ix].classList.add('pointerPath')
    await sleep(1000)

    path.push(pointer)
    next = itr.next()
    // if only root node
    if (next.done) {
        document.querySelectorAll('.pointerPath').forEach((e) => e.classList.remove('pointerPath'))
        return {path: [0], ...findNextPointer(val, root)}
    }
    rowNum++
    while (!next.value[pointer].leaf) {
        // follow pointer to new element
        let result = _followPath(val, rowNum, next, pointer, ix)
        ix = result['ix']
        pointer = result['pointer']
        path.push(pointer)
        next = itr.next()
        rowNum++
        
        await sleep(1000)
    }
    // Leaf node holds pointer to Row ID
    elem = document.querySelectorAll('#nodeRow-'+rowNum + ' > div.Node')[pointer]
    let result = insert ? findNextPointer(val, next.value[pointer]) : findNodeValue(val, next.value[pointer])
    if (!result) {
        document.querySelectorAll('.pointerPath').forEach((e) => e.classList.remove('pointerPath'))
        return
    }
    ix = result['ix']
    pointer = result['pointer']
    elem.classList.add('pointerPath')
    elem.querySelectorAll('td.nodePointer')[ix].classList.add('pointerPath')
    
    path.push(pointer)
        
    await sleep(1000)
    document.querySelectorAll('.pointerPath').forEach((e) => e.classList.remove('pointerPath'))

    return {pointer, path, ix}
}


function _followPath(val, rowNum, next, pointer, ix) {
    // follow pointer to new element
    let elem = document.querySelectorAll('#nodeRow-'+rowNum + ' > div.Node')[pointer]
    let result = findNextPointer(val, next.value[pointer])
    ix = result['ix']
    pointer = result['pointer']
    // color path
    elem.classList.add('pointerPath')
    elem.querySelectorAll('td.nodePointer')[ix].classList.add('pointerPath')

    return {ix, pointer}
}


function findNodeValue(val, node) {
    for (var i=0; i < node.values.length; i++) {
        if (val === node.values[i]) {
            return {ix: i, pointer: node.pointers[i]}
        }
    }
}

function findNextPointer(val, node) {
    for (var i=0; i < node.values.length; i++) {
        if (val < node.values[i]) {
            return {ix: i, pointer: node.pointers[i]}
        }
    }
    return (
        node.leaf ? {ix: node.pointers.length, pointer: node.pointers[i]}
                  : {ix: node.pointers.length-1, pointer: node.pointers[node.pointers.length-1]})
}


export {searchTree, findNodeValue, findNextPointer, sleep}