import React from 'react'

class Program extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        title: "Welcome",
        start: false,
        resultsTitle: "Program Results"
      };
      
      this.handleStart = this.handleStart.bind(this);
    }

    handleStart(){
        this.setState({start: true, title: "Loading..."})
    }
  
    render() {
      return (
        <div>
            <h1>{this.state.title}</h1>
            <button onClick={this.handleStart}>Start Program</button>
            <h2>{this.state.resultsTitle}</h2>
        </div>
      );
    }
  }

  export default Program;