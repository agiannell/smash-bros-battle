import {Component} from 'react';
import Header from './Components/Header'
import Battlefield from './Components/Battlefield'
import Fighters from './Components/Fighters'
import './reset.css';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      contenders: []
    }
  }

  componentDidMount() {
    axios.get('/api/contenders')
      .then(res => {
        this.setState({contenders: res.data});
      })
      .catch(err => console.log(err));
  }

  chooseContender = (contender) => {
    axios.post('/api/contenders', {contender: contender})
      .then(res => {
        this.setState({contenders: res.data});
      })
      .catch(err => console.log(err));
  }

  editName = (id, newName) => {
    let body = {name: newName};

    axios.put(`/api/contenders/${id}`, body)
      .then(res => {
        this.setState({contenders: res.data});
      })
      .catch(err => console.log(err));
  }

  replaceContender = (id) => {
    axios.delete(`/api/contenders/${id}`)
      .then(res => {
        this.setState({contenders: res.data});
      })
      .catch(err => console.log(err));
  }
  
  render() {
    const {contenders} = this.state;
    const {chooseContender, editName, replaceContender} = this;
    console.log(contenders);
    return (
      <section className="App">
        <Header />
        <Battlefield
          contenders={contenders}
          editNameFn={editName}
          replaceFn={replaceContender} />
        <Fighters
          chooseFn={chooseContender} />
      </section>
    );
  }
}

export default App;
