import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import * as actions from '../../actions';

import css from '../../../css/style.scss';

class App extends Component {
  render () {
    const { torrents } = this.props;
    return (
      <div>
        <h1>Hello World!!</h1>
        {torrents.map(t => <span key={t.key}>{t.name}</span>)}
      </div>
    );
  }
}
App.propTypes = {
  torrents: PropTypes.array.isRequired
};

// from Handlers to ActionCreators
function addTodo (evt, text) {
  evt.preventDefault();
  return actions.addTodo(text);
}

function mapStateToProps (state) {
  return { torrents: state.torrents.list };
}

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators({
//     addTodo: wrapActions(addTodo, dispatch),
//     typeTodo: wrapActions(typeTodo, dispatch),
//     checkTodo: wrapActions(checkTodo, dispatch)
//   }, dispatch);
// }

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(App);
