import React from "react"




export default class DataTable extends React.Component {

  render() {
    return (
      <div className="DataTable">
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Value</th>
            </tr>
            {this.props.values.map((row) => {
              return (
                <tr key={"table-row-" + row.id}>
                  <td key={'table-id-' + row.id}>{row.id}</td>
                  <td key={'table-value-' + row.value}>{row.value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
