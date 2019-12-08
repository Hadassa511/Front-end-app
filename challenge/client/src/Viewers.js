import React, { Component } from 'react';
import Table from './Helpers/Table';
import axios from 'axios';
import NavBar from './Helpers/NavBar';

class Viewers extends Component {
  state = {
    row: {
      ctf_fit_to_A: 3.39656400680542,
      df_ast: 71.1044921875,
      df_avg: 12415.78125,
      fname: '14sep05c_00024sq_00003hl_00002es.frames_rigid_aligned.mrc',
      motion_curvature: 2.25360603816634,
      motion_total_pix: 45.6746927577485,
      num_particles: 969,
      pick_ncc_median: 0.381327420473099,
      pick_pow_median: 1101.99816894531,
      uid: 1
    },
    currentRow: 0,
    limit: 10,
    url: 'http://localhost:5000/api/',
    data: [],
    image: '',
    rowClicked: false
  };

  componentDidMount() {
    this.getData();
    this.getImage();
  }

  loadMore = async () => {
    let currentRow = this.state.currentRow + this.state.limit;
    await this.setState({ currentRow });
    this.getData();
  };

  getData = async () => {
    let url =
      this.state.url +
      'query/?skip=' +
      this.state.currentRow +
      '&limit=' +
      this.state.limit;

    //console.log('url ', url, typeof this.state.data);

    let response = await axios.get(url);
    // console.log(
    //   'data ',
    //   response.data.data,
    //   response.data.data.length,
    //   response.data.data[2]
    // );

    let data = [...this.state.data];
    for (let i = 0; i < response.data.data.length; i++) {
      data.push(response.data.data[i]);
    }
    // console.log('final data ', data);
    if (response.data) {
      await this.setState({ data });
    }
  };

  rowSelected = async row => {
    console.log('parent row ', row);
    this.formatRows();
    await this.setState({ row, rowClicked: true });
    this.getImage();
  };

  formatData = data => {
    return parseFloat(Math.ceil(data * 1000) / 1000);
  };

  getImage = async () => {
    if (this.state.row.fname !== undefined) {
      let url = this.state.url + 'image?filename=' + this.state.row.fname;
      // console.log("url ",url);
      await this.setState({ image: url });
    }
  };

  formatRows = () => {
    var tags = document.getElementsByTagName('tr');
    console.log(
      'tags ',
      tags.length > 0,
      typeof tags,
      Object.keys(tags),
      tags[0]
    );

    if (typeof tags === 'object') {
      Object.keys(tags).map(key => {
        return (tags[key].style.backgroundColor = 'white');
      });
    }
  };

  render() {
    const { data, row, image, rowClicked } = this.state;

    return (
      <div>
        <NavBar />
        <div className="body">
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                <Table
                  rowSelected={this.rowSelected}
                  data={data}
                  formatData={this.formatData}
                  loadmore={this.loadMore}
                  rowClicked={rowClicked}
                />
              </div>
              <div className="col-md-4">
                <div className="">
                  <h1>Micrograph {row.uid}</h1>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td>Number of Picks</td>
                        <td>{row.num_particles}</td>
                      </tr>
                      <tr>
                        <td>Motion Curvature</td>
                        <td>{this.formatData(row.motion_curvature)}</td>
                      </tr>
                      <tr>
                        <td>Total Motion</td>
                        <td>{this.formatData(row.motion_total_pix)}</td>
                      </tr>
                      <tr>
                        <td>Pick Power Median</td>
                        <td>{this.formatData(row.motion_curvature)}</td>
                      </tr>
                      <tr>
                        <td>Pick NCC Median</td>
                        <td>{this.formatData(row.pick_ncc_median)}</td>
                      </tr>
                      <tr>
                        <td>CTF Fit to A</td>
                        <td>{this.formatData(row.ctf_fit_to_A)}</td>
                      </tr>
                      <tr>
                        <td>Defocus</td>
                        <td>{this.formatData(row.df_avg)}</td>
                      </tr>
                      <tr>
                        <td>Astigmatisms</td>
                        <td>{this.formatData(row.df_ast)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <img src={image} className="img-fluid" alt={row.uid} />
                </div>
              </div>
            </div>
          </div>
        </div>{' '}
      </div>
    );
  }
}

export default Viewers;
