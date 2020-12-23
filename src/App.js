import _ from "lodash"
import React from "react"
import BPlusTree from "./components/b-plus-tree"
import DataTable from "./components/data-table"
import "./App.css"
import {searchTree, findNextPointer, sleep} from "./ops.js"
import { Button, Input } from 'semantic-ui-react'


function QueryInputs(props){
  return (
    <div id='queryInputs'>
      <p>Type an integer value to insert or delete from the table</p>      
      <Input type='number' id="queryValue" name="queryValue" placeholder='Value...' action><input/>
        <Button id='insertButton' onClick={props.handleInsert} type='submit'>Insert</Button>
        <Button id='deleteButton' onClick={props.handleDelete} type='submit'>Delete</Button>
      </Input>
    </div>
  )
}

function SetTreeN(props) {
  return (
    <div id='setTreeN'>
      <p>Set the max values per node</p>      
      <Input type='number' id="treeN" name="treeN" placeholder={props.treeN} action><input/>
        <Button id='setTreeNButton' onClick={props.updateTreeN} type='submit'>Reset</Button>
      </Input>
    </div>
  )
}


export default class App extends React.Component {

  constructor(props) {
    super(props)
    window.app = this
    this.state = {
      treeNodes: [],
      treeN: 3,
      tableValues: [],
      tableMaxId: 0
    }
  }

  reset() {
    const N = Number(document.getElementById('treeN').value)
    this.setState((state, props) => {
      return ({
        treeNodes: [],
        treeN: N ? N : state.treeN,
        tableValues: [],
        tableMaxId: 0
      })
    })
  }

  handleInsert() {
    const v = Number(document.getElementById('queryValue').value)
    // insert into table
    this.setState(
      (state, p) => {
        return ({
          tableValues: state.tableValues.concat([{id: this.state.tableMaxId + 1, value: v}]),
          tableMaxId: state.tableMaxId + 1
        }) 
      },
      // callback to insert into index
      () => this.indexInsert(v)
    )
  }
  
  async handleDelete() {
    const v = Number(document.getElementById('queryValue').value)
    let result = await searchTree(v, this.state.treeNodes)
    if (!result){
      return
    }
    // Delete from table
    this.setState((state, p) => {
      return ({
        tableValues: _.filter(state.tableValues, (v) => {return v.id !== result.pointer})
      })
    },
    // setState callback to delete from index 
    () => this.indexDelete(v, result.path, result.ix))
  }
  
  async indexInsert(v) {
    // find the node and index for v
    let {path, ix} = await searchTree(v, this.state.treeNodes, true)
    let splitValue = v

    for (let r = 1; r <= path.length; r++) {
      // debugger;

      // first value in table
      if (this.state.treeNodes.length === 0){
        this.state.treeNodes = [[{values: [splitValue], pointers: [1], root:true, leaf:true}]]
        break
      }
      let rowIx = this.state.treeNodes.length - r
      let nodeIx = path[Math.max(path.length - (r+1), 0)] // pointer from parent or root
      let row = this.state.treeNodes[rowIx]
      let node = row[nodeIx]

      // if leaves, add to node and include new table id
      if (node.leaf){
        // style values compared
        document.querySelectorAll('#nodeRow-'+(rowIx) + ' > .Node')[nodeIx]
                .querySelectorAll('td.nodeValue')[Math.max(Math.min(ix, node.values.length-1), 0)]
                .classList.add('valueInsert')
        await sleep(1000)
        node.values.splice(ix, 0, v) 
        node.pointers.splice(ix, 0, this.state.tableMaxId)
      }
      // otherwise add to parent
      else {
        // debugger;
        let {ix, pointer} = findNextPointer(splitValue, node)
        document.querySelectorAll('#nodeRow-'+(rowIx) + ' > .Node')[nodeIx]
                .querySelectorAll('td.nodeValue')[Math.max(Math.min(ix, node.values.length-1), 0)]
                .classList.add('valueInsert')
        await sleep(1000)
        node.values.splice(ix, 0, splitValue)
        // node.pointers.push(ix+1, 0, pointer+1)
        node.pointers.push(Math.max(...node.pointers)+1)
      }

      // check if node > treeN
      if (node.values.length >= this.state.treeN) {
        let left = {
          pointers: node.pointers.slice(0, Math.floor(node.pointers.length/2)),
          values: node.values.slice(0, Math.floor(node.values.length/2)),
          leaf: node.leaf
        }
        let right = {
          pointers: node.pointers.slice(Math.floor(node.pointers.length/2), node.pointers.length),
          values: node.values.slice(Math.floor(node.values.length/2)),
          leaf: node.leaf
        }
        splitValue = right.values[0]
        // for non-leaf nodes, need to cut out splitting value
        if (!node.leaf){
          right.values = right.values.slice(1)
        }

        console.log("LEFT", left)
        console.log("RIGHT", right)
        // apply new nodes to row
        row.splice(nodeIx, 1, left, right)

        // if splitting root node
        if (node.root) {          
          // new root node
          this.state.treeNodes = [[{values: [splitValue], pointers: [0, 1], root:true}]].concat(
            this.state.treeNodes
          )
          break
        }
      }
      else {
        break
      }
    }
    // make sure updates are rendered
    this.setState((state, props) => {return({'treeNodes': state.treeNodes})})
    document.querySelectorAll('.valueInsert').forEach((e) => e.classList.remove('valueInsert'))
  }


  async indexDelete(val, path, ix) {
    console.log('DELETE', path, ix)
    if (ix === null || ix === undefined) {
      return false
    }
    var priorValuesToSteal = this.state.treeNodes.map((row, i) => {
      let valIx = row[path[i]].pointers.indexOf(path[i+1])
      return row[path[i]].values[valIx]
    })
    
    for (let r = 1; r <= (path.length - 1); r++) {
      // debugger;
      let rowIx = this.state.treeNodes.length - r
      let nodeIx = path[rowIx]
      // start at leaf
      let row = this.state.treeNodes[rowIx]
      let node = row[nodeIx]

      if (node.leaf){
        // style values to delete
        let nodeElem = document.querySelectorAll('#nodeRow-'+(rowIx) + ' > .Node')[nodeIx]
        nodeElem.querySelectorAll('td.nodeValue')[ix].classList.add('valueDelete')
        nodeElem.querySelectorAll('td.nodePointer')[ix].classList.add('valueDelete')
        await sleep(1000)
        node.values.splice(ix, 1) 
        node.pointers.splice(ix, 1)

        if (node.values.length > 0) {
          let parent = this.state.treeNodes[rowIx - 1][path[rowIx - 1]]
          let deleteIx = parent.values.indexOf(val)
          if (deleteIx >= 0){
            parent.values.splice(deleteIx, 1, node.values[0])
          }
        }
      }
      else if (node.root){
        if (node.values.length === 0) {
          this.state.treeNodes.splice(0, 1)
          this.state.treeNodes[0][0].root = true
          break
        }
        let deleteIx = node.values.indexOf(val)
        if (deleteIx >= 0) {
          node.values.splice(deleteIx, 1, priorValuesToSteal[rowIx + 1])
        }
      }
      else {
        let deleteIx = node.values.indexOf(val)
        if (deleteIx >= 0) {
          node.values.splice(deleteIx, 1, priorValuesToSteal[rowIx + 1])
        }
        
      }

      if (!node.root && node.values.length < Math.floor(this.state.treeN/2) ) {
        console.log("RESTRUCTURE")
        // try left?
        if (this.pullFromLeft(rowIx, path)) {
          continue
        }
        // try right?
        else if (this.pullFromRight(rowIx, path)){
          continue
        }
        // merge
        else {
          this.merge(rowIx, path)
        }
      }
    }
  // make sure updates are rendered
  this.setState((state, props) => {return({'treeNodes': state.treeNodes})})
  document.querySelectorAll('.valueDelete').forEach((e) => e.classList.remove('valueDelete'))

  }

  pullFromLeft(rowIx, path) {
    let row = this.state.treeNodes[rowIx]
    let nodeIx = path[rowIx]
    let parent = this.state.treeNodes[rowIx - 1][path[rowIx - 1]]
    let parentIx = parent.pointers.indexOf(nodeIx)
    // if there is no left node or left node is too small, return false
    if (nodeIx === Math.min(...parent.pointers) || row[nodeIx-1].values.length -1 < Math.floor(this.state.treeN/2)) {
      return false
    }

    let left = row[nodeIx - 1]
    let splitValue = left.values.splice(left.values.length-1, 1)[0]
    let splitPointer = left.pointers.splice(left.pointers.length-1, 1)[0]

    row[nodeIx].values.splice(0, 0, splitValue)
    row[nodeIx].pointers.splice(0, 0, splitPointer)

    parent.values.splice(parentIx - 1, 1, splitValue)
    // parent.pointers.splice(parentIx, 1, splitPointer)

    return true
  }

  pullFromRight(rowIx, path) {
    let row = this.state.treeNodes[rowIx]
    let nodeIx = path[rowIx]
    let parent = this.state.treeNodes[rowIx - 1][path[rowIx - 1]]
    let parentIx = parent.pointers.indexOf(nodeIx)
    // if there is no right node or it is too small, return false
    if (nodeIx === Math.max(...parent.pointers) || (row[nodeIx + 1].values.length - 1) < Math.floor(this.state.treeN/2)) {
      return false
    }

    let right = row[nodeIx + 1]
    let newValue = right.values.splice(0, 1)[0]
    let newPointer = right.pointers.splice(0, 1)
    let splitValue = right.values[0]

    row[nodeIx].values.push(newValue)
    row[nodeIx].pointers.push(newPointer)

    parent.values.splice(parentIx, 1, splitValue)
    // may have changed the left split value in parent
    if (parentIx !== 0) {
      parent.values.splice(parentIx-1, 1,  row[nodeIx].values[0])
    }
    

    return true
  }

  merge(rowIx, path) {
    // debugger;
    let row = this.state.treeNodes[rowIx]
    let nodeIx = path[rowIx]
    let parent = this.state.treeNodes[rowIx - 1][path[rowIx - 1]]
    let parentIx = parent.pointers.indexOf(nodeIx)

    // if we are the left-most node, move right 1.
    if (nodeIx === Math.min(...parent.pointers)){
      nodeIx ++
    }

    let node = row[nodeIx]
    let left = row[nodeIx - 1]
    
    if (!node.leaf) {
      // pull value down from parent
      left.values = left.values.concat([parent.values[Math.min(parentIx, (parent.values.length-1))]])
    }
    let combinedValues = left.values.concat(node.values)
    let combinedPointers = left.pointers.concat(node.pointers)
    let merged = {...left, ...node}

    merged.values = combinedValues
    merged.pointers = combinedPointers

    row.splice(nodeIx - 1, 2, merged)
    // get rid of parent pointer to deleted node
    parent.pointers.splice(parentIx, 1)
    parent.values.splice(Math.min(parentIx, (parent.values.length-1)), 1)

    // decrement all incremental pointers from one row higher
    this.state.treeNodes[rowIx - 1].slice(path[rowIx -1] + 1).forEach((n) => {
      n.pointers = n.pointers.map((p) => p-1)
    })
  }

  render() {
    window.tree = this.state.treeNodes
    return (
      <div id="App">
        <div id="inputs">
          <QueryInputs handleInsert={this.handleInsert.bind(this)} handleDelete={this.handleDelete.bind(this)}/>
          <SetTreeN updateTreeN={this.reset.bind(this)} treeN={this.state.treeN}/>
        </div>
        
        <BPlusTree nodes={this.state.treeNodes} n={this.state.treeN}/>
        <DataTable values={this.state.tableValues} maxId={this.state.tableMaxId}/>
      </div>
    )
  }
}
