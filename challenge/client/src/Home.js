import React, { Component } from 'react';
import Card from './Helpers/Card';
import axios from 'axios';
import Chart from './Helpers/Chart';
import NavBar from './Helpers/NavBar';

import { formatData } from './Helpers/core';

class Home extends Component {
  state = {
    count: 0,
    url: 'http://localhost:5000/api',
    averages: {},

    data: [
      { name: 'Average Motion Curvature', key: 'motion_curvature' },
      { name: 'Average CTF FIT to A', key: 'ctf_fit_to_A' },
      { name: 'Average Pick NCC Median', key: 'pick_ncc_median' },
      { name: 'Average Pick Power Median', key: 'pick_pow_median' },
      { name: 'Average Astigmatisms', key: 'df_ast' },
      { name: 'Average Number of Picks', key: 'num_particles' },
      { name: 'Average Motion', key: 'motion_total_pix' }
    ]
  };

  async componentDidMount() {
    // console.log('actiiosn ', typeof fetchCount);
    this.fetchCount(this.state.url + '/count');
    this.fetchAverages(this.state.url + '/averages');
    // console.log("count ",count);
  }

  fetchCount = async url => {
    let response = await axios.get(url);
    // console.log('response ', response);
    if (response.data.success) {
      await this.setState({ count: response.data.data });
    }
  };

  fetchAverages = async url => {
    let response = await axios.get(url);
    // console.log('response fetchAverages ', response);
    if (response.data.success) {
      await this.setState({ averages: response.data.data });
    }
  };

  render() {
    let { count, averages, data } = this.state;

    return (
      <div>
        <NavBar />
        <div className="body">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <Card name="Total Micrographs" value={count} />
              </div>
              {Object.keys(data).map(key => {
                console.log(
                  'data',
                  data,
                  data[key],
                  key,
                  data[key].name,
                  data[key].key
                );
                return (
                  <div className="col-md-4">
                    <Card
                      name={data[key].name}
                      value={formatData(averages[data[key].key])}
                    />
                  </div>
                );
              })}
            </div>
            <br />
            <Chart url={this.state.url} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
