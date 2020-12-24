import React from "react"
import {Table} from 'semantic-ui-react'




export default class DataTable extends React.Component {

  render() {
    return (
      <div className="DataTable">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.values.map((row) => {
              return (
                <Table.Row key={"table-row-" + row.id}>
                  <Table.Cell key={'table-id-' + row.id}>{row.id}</Table.Cell>
                  <Table.Cell key={'table-value-' + row.value}>{row.value}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
