import React, { PropTypes, Component } from 'react';
import css from './status.css';

export class Status extends Component {
  render () {
    const todos = this.props.todoList.filter(t => !t.done);
    const allDone = <span className={css.todoCount}>All tasks done!</span>;
    const stillTodo = <span className={css.todoCount}><strong>{todos.length}</strong> tasks left</span>;
    return (
      <footer className={css.footer}>
        {todos.length > 0 ? stillTodo : allDone}
      </footer>
    );
  }
}
Status.propTypes = {
  todoList: PropTypes.array.isRequired
};
