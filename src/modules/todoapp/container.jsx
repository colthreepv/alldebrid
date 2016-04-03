import React, { PropTypes, Component } from 'react';
import { List } from './list.jsx';
const css = require('./container.css');

class Create extends Component {
  render () {
    const { text, typeHandler, submitHandler } = this.props;
    return (
      <div>
        <form onSubmit={submitHandler}>
          <input type="text" placeholder="What needs to be done?" className={css.newTodo}
            onChange={typeHandler} value={text} autoFocus/>
        </form>
      </div>
    );
  }
}
Create.propTypes = {
  text: PropTypes.string,
  typeHandler: PropTypes.func,
  submitHandler: PropTypes.func
};

export class Container extends Component {
  render () {
    const { text, typeHandler, submitHandler } = this.props;
    const { todoList, toggleElem } = this.props;
    return (
      <div className={css.todoContainer}>
        <Create text={text} typeHandler={typeHandler} submitHandler={submitHandler} />
        <List list={todoList} toggleElem={toggleElem}/>
      </div>
    );
  }
}
Container.propTypes = {
  text: PropTypes.string,
  typeHandler: PropTypes.func,
  submitHandler: PropTypes.func,
  todoList: PropTypes.array,
  toggleElem: PropTypes.func
};
