import React, { PropTypes } from 'react';
import Header from './Header';
import s from './Layout.css';

class Layout extends React.Component {

  static propTypes = {
    pageTitle: PropTypes.string.isRequired,
  };

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  render() {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header" ref={node => { this.root = node; }}>
        <div className="mdl-layout__inner-container">
          <div className={s.ribbon}>
            <Header />
            <div className={s.container}>
              <h1 className={`mdl-typography--title ${s.tagline}`}>TFL Arrivals</h1>
              <p className={`mdl-typography--body-1 ${s.summary}`}>
                {this.props.pageTitle}
              </p>
            </div>
          </div>
          <main {...this.props} className={s.content} />
        </div>
      </div>
    );
  }
}

export default Layout;
