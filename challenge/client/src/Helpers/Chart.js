import React, { Component } from 'react';
import './Chart.css';
import axios from 'axios';

class Chart extends Component {
  state = {
    data: [
      [
        1575715229381,
        1575715418090,
        1575715419088,
        1575715420088,
        1575715421093,
        1575715422091,
        1575715423088,
        1575715424089,
        1575715425091,
        1575715426093,
        1575715427088
      ],
      [1200, 1927, 613, 1601, 897, 1236, 678, 862, 924, 1375, 1356, 1827]
    ],
    opts: {
      title: 'Real-time Data',
      id: 'chart1',
      class: 'my-chart',
      width: 800,
      height: 600,
      spanGaps: true,
      axes: {
        x: {
          space: 100
        },
        y: [
          {
            space: 50
          }
        ]
      },
      series: {
        y: [
          {
            show: true,
            label: 'Value',
            value: rawValue => rawValue,
            color: 'red',
            width: 1,
            fill: 'rgba(255, 0, 0, 0.3)'
          }
        ]
      }
    }
  };

  componentDidMount() {
    //console.log('props ', this.props, this.state.data);
    this.interval = setInterval(() => this.getChartData(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getChartData = async () => {
    var timestamp = +new Date();
    let response = await axios.get(this.props.url + '/random');

    var xaxis,
      yaxis = [];

    if (response.data) {
      xaxis = [...this.state.data[0], timestamp];
      yaxis = [...this.state.data[1], response.data.data];
      var data = [xaxis, yaxis];
      //console.log('response ', data, data.length);
      await this.setState({ data });
      if (data.length > 0) {
        var removeDiv = document.getElementById('chart1');
        if (removeDiv != null) {
          document.getElementById('chart').removeChild(removeDiv);
        }
        await this.renderChart(data);
      }
    }
  };

  renderChart = async data => {
    //console.log('format ', this.state.data);
    if (data.length !== undefined && data[0].length > 10) {
      let uplot = new window.uPlot.Line(this.state.opts, data);
      document.getElementById('chart').appendChild(uplot.root);
    }
  };

  render() {
    return (
      <div>
        <div id="chart">
          <div id="chart1" className="my-chart">
            Loading.....
          </div>
        </div>
      </div>
    );
  }
}

export default Chart;
