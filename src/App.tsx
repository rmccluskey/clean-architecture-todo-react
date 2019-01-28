import React, { Component } from 'react';
import './App.css';

import { TodoInteractor } from "clean-architecture-todo/dist/interactors/todoInteractor";
import { TodoLocalStorageApi } from "clean-architecture-todo/dist/framework/todoLocalStorageApi";
import { TodoList } from 'clean-architecture-todo/dist/entities/todoList';
import * as Todo from 'clean-architecture-todo/dist/entities/todo';

let todoInteractor = new TodoInteractor(new TodoLocalStorageApi());

type Props = any;
type State = {
  todoList: TodoList;
  todoTitle: string;
}

class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { 
      todoList: [],
      todoTitle: "",
     };
    this.loadTodos();
    this.addTodo = this.addTodo.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
  }

  async loadTodos() {
    let todoList = await todoInteractor.getTodoList();
    this.setState({
      todoList
    });
  }

  async addTodo() {
    let todoList = await todoInteractor.addTodo(this.state.todoList, this.state.todoTitle);
    this.setState({
      todoList
    });
  }

  async removeTodo(evt: any, todo: Todo.Todo) {
    evt.stopPropagation();
    let todoList = await todoInteractor.removeTodo(this.state.todoList, todo);
    this.setState({
      todoList
    });
  }

  async toggleTodo(todo: Todo.Todo) {
    let todoList = await todoInteractor.toggleTodo(this.state.todoList, todo);
    this.setState({
      todoList
    });
  }

  updateTitle(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      todoTitle: evt.target.value
    });
  }

  render() {
    let todoList = this.state.todoList ? this.state.todoList.map(todo => <div onClick={() => this.toggleTodo(todo)}>
      <span>{`[${Todo.isDone(todo) ? "x" : ""}] `}</span>
      <span>{Todo.title(todo)}</span>
      <span> - {Todo.age(todo)}</span>
      <button onClick={(evt) => this.removeTodo(evt, todo)}>X</button>
    </div>): <></>;

    return (
      <div className="App">
        <input value={this.state.todoTitle} onChange={this.updateTitle}></input>
        <button onClick={this.addTodo}>Add TODO</button>
        {todoList}        
      </div>
    );
  }
}

export default App;
