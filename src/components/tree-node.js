import React from "react"

class TreeNode extends React.Component {

    render() {
        return (
            <table className="nodeTableElement">
                <tbody>
                    <tr>
                    {this.props.values.map((v, i) => {
                            
                            return ([
                                <td key={this.props.nodeIx + '-pointer-' + i} className="nodePointer">
                                    {this.props.pointers[i]}
                                </td>,
                                <td key={this.props.nodeIx + '-value-' + i} className="nodeValue">{v}</td>
                            ])
                    })}   
                    <td key={this.props.nodeIx + "-pointer-" + (this.props.pointers.length - 1)} className="nodePointer">
                        {this.props.pointers[this.props.pointers.length-1]}
                    </td>
                    </tr>
                </tbody>
            </table>
        )
    }
     
}

class LeafNode extends React.Component {

    render() {
        return (
            <table className="nodeTableElement leaf">
                <tbody>
                    <tr>
                    {this.props.values.map((v, i) => {
                            
                            return ([
                                <td key={this.props.nodeIx + '-pointer-' + i} className="nodePointer">
                                    {this.props.pointers[i]}
                                </td>,
                                <td key={this.props.nodeIx + '-value-' + i} className="nodeValue">{v}</td>
                            ])
                    })}
                        <td key={this.props.nodeIx + "-pointer-" + (this.props.nodeIx + 1)} className="nodePointer">
                            {"Node-" + (this.props.nodeIx + 1)}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export {TreeNode, LeafNode}
