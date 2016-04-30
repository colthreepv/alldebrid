import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
const css = require('./list.css');

export class List extends Component {
  render () {
    const { list, toggleElem } = this.props;
    return (
      <div className="todoList">
        {list.map(elem => <TodoElem key={elem.id}
          done={elem.done}
          text={elem.text}
          toggleElem={() => toggleElem(elem.id)}/>)
        }
      </div>
    );
  }
}
List.propTypes = {
  list: PropTypes.array,
  toggleElem: PropTypes.func.isRequired
};

export class TodoElem extends Component {
  render () {
    const { done, text, toggleElem } = this.props;
    const classes = classNames(css.label, done ? css.labelDone : false);
    return (
      <div className={css.listElem}>
        <input type="checkbox" className={css.toggle} checked={done} onChange={toggleElem}/>
        <span className={classes}>{text}</span>
      </div>
    );
  }
}
TodoElem.propTypes = {
  done: PropTypes.bool,
  text: PropTypes.string,
  toggleElem: PropTypes.func
};
