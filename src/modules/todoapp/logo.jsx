import React, { Component } from 'react';
const css = require('./logo.css');

export class Logo extends Component {
  render () {
    return <h1 className={css.todoLogo}>todos</h1>;
  }
}
