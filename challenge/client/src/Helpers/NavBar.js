import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class NavBar extends Component {
  state = {};

  componentDidMount() {
    // console.log("url ",window.location.href, this.props);
  }

  componentDidUpdate() {
    // console.log("url ",window.location.pathname, this.props);
  }

  render() {
    // console.log('url ', window.location.pathname);
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Micrograph Explorer
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li
                className={
                  window.location.pathname === '/'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <Link className="nav-link" to="/">
                  Dashboard
                </Link>
              </li>
              <li
                className={
                  window.location.pathname === '/viewer'
                    ? 'nav-item active'
                    : 'nav-item'
                }
              >
                <Link className="nav-link" to="/viewer">
                  Viewer
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

NavBar.contextTypes = {
  router: PropTypes.object
};

export default NavBar;
