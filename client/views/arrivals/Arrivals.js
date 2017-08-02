import React, { PropTypes } from 'react';
import * as moment from 'moment';
import Layout from '../../components/Layout';
import s from './Arrivals.css';

const title = 'Canonbury Arrivals';

class Arrivals extends React.Component {

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
        <div className={s.liveBoard}>
          <ol className={s.liveBoardFeed}>
              {this.props.arrivals.sort(this.comparePredictions).map((prediction, i) =>
              (<li key={i} className={s.liveBoardFeedItem}>
                <span className={s.overground}></span>
                <span className={s.trainDestination}>{prediction.destinationName}</span>
                <span className={s.liveBoardEta}>{moment.default().add(prediction.timeToStation, 'seconds').fromNow().toString()}</span>
                </li>),
            )}
            </ol>
        </div>
      </Layout>
    );
  }

  comparePredictions = (a, b) => {
    if (a.timeToStation < b.timeToStation) {
      return -1;
    }
    if (a.timeToStation > b.timeToStation) {
      return 1;
    }
    return 0;
  }
}

export default Arrivals;
