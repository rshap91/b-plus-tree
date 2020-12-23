import React from "react"
import {TreeNode, LeafNode} from "./tree-node"


export default class NodeRow extends React.Component {
    render(){
        return (
            this.props.nodes.map((node, ix) => {
                return (
                    this.props.leaves ?
                        <div key={"Node-" + ix} className="leaf Node">
                            <LeafNode 
                                n={this.props.n} 
                                rowIx={this.props.rowIx} 
                                nodeIx={ix} 
                                pointers={node.pointers} 
                                values={node.values}
                            />
                        </div>
                        :
                        <div key={"Node-" + ix} className="Node">
                            <TreeNode 
                                n={this.props.n} 
                                rowIx={this.props.rowIx} 
                                nodeIx={ix} 
                                pointers={node.pointers} 
                                values={node.values}
                            />
                        </div>
                )
            })
        )
    }
}