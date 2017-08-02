import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';

const title = 'Canonbury Arrivals';

class Home extends React.Component {

  static propTypes = {
    arrivals: PropTypes.array.isRequired,
  };

  componentDidMount() {
    document.title = title;
  }

  render() {
    return (
      <Layout>
        <h1 className="mdl-typography--title">Live arrivals at {new Date().toLocaleTimeString()}</h1>
        <ol>
          {this.props.arrivals.map((prediction, i) =>
            <li key={i}>
              <span>{prediction.destinationName}</span>
              <span>{prediction.timeToStation}</span>
            </li>
          )}
        </ol>
      </Layout>
    );
  }
}

export default Home;
