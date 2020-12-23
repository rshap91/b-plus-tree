import React from "react"
import NodeRow from "./node-row"
import './BPlusTree.css';


export default class BPlusTree extends React.Component {

  render() {
    if (this.props.nodes.length === 0) {
      return null
    }
    var rootNode = this.props.nodes[0]
    var levels = this.props.nodes.slice(1,this.props.nodes.length - 1)
    var leaves = this.props.nodes.slice(1).slice(-1) // last row if any
    console.log("ROOT", rootNode)
    console.log("LEVELS", levels)
    console.log("LEAVES", leaves)
    return (
      <div className="Tree">
        <div id="nodeRow-0" key="nodeRow-0" className="nodeRow root">
            <NodeRow n={this.props.n} rowIx={0} nodes={rootNode} leaves={rootNode[0].leaf}/>
        </div>
        {levels.map((row, ix) => {
            return (
              <div id={"nodeRow-"+(ix+1)} key={"nodeRow-"+(ix+1)} className="nodeRow">
                <NodeRow n={this.props.n} rowIx={ix+1} nodes={row}/>
              </div>
            )
        })}
        {leaves.map((row, ix) => {
            return (
              <div id={"nodeRow-" + (this.props.nodes.length-1)} className="nodeRow leaves" key={"nodeRow-" + (this.props.nodes.length-1)}>
                  <NodeRow n={this.props.n} rowIx={this.props.nodes.length -1} nodes={row} leaves={true}/>
              </div>
            )
        })}
      </div>
    );
  }
}
