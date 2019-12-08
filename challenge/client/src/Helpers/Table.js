import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { formatData } from './core';

class Table extends Component {
  state = {};

  componentDidUpdate() {
    // console.log('selected row', this.props.rowSelected);
    var tags = document.getElementsByTagName('tr');
    if (typeof tags === 'object' && this.props.rowClicked === false) {
      tags[1].style.backgroundColor = '#007bff';
    }
  }

  showmore = async () => {
    let currentRow = this.state.currentRow + this.state.limit;
    await this.setState({ currentRow });
  };

  render() {
    const { data, loadmore } = this.props;
    //console.log('dataa', this.props);
    const options = {
      onRowClick: this.props.rowSelected,
      bgColor: 'blue'
    };

    const selectRowProp = {
      mode: 'checkbox',
      bgColor: '#007bff',
      hideSelectColumn: true,
      clickToSelect: true,
      color: '#fff'
    };

    return (
      <div>
        <BootstrapTable
          data={data}
          striped
          hover
          options={options}
          selectRow={selectRowProp}
        >
          <TableHeaderColumn isKey dataField="uid" dataSort={true}>
            UID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="num_particles" dataSort={true}>
            Number of Picks
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="motion_curvature"
            dataSort={true}
            dataFormat={formatData}
          >
            Motive Curvature
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="ctf_fit_to_A"
            dataSort={true}
            dataFormat={formatData}
          >
            CTF Fit to A
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="df_ast"
            dataSort={true}
            dataFormat={formatData}
          >
            Astigmatisms
          </TableHeaderColumn>
        </BootstrapTable>
        <br />
        <button className="btn btn-primary" onClick={loadmore}>
          Show More
        </button>
      </div>
    );
  }
}

export default Table;
