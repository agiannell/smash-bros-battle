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
      allFighters: [],
      contenders: []
    }
  }

  componentDidMount() {
    this.getFighters()
    this.getContenders()
  }

  getContenders = () => {
    axios.get('/api/contenders')
      .then(res => {
        this.setState({contenders: res.data});
      })
      .catch(err => console.log(err));
  }

  getFighters = () => {
    axios.get('/api/fighters')
        .then(res => {
            this.setState({allFighters: res.data})
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

  clearContenders = () => {
    axios.get('api/clear-contenders')
      .then(res => {
        this.setState({contenders: res.data});
      })
      .catch(err => console.log(err));

      this.getFighters();
  }

  battleFn = () => {
    const {contenders} = this.state;

    if(contenders[0].hp > contenders[1].hp) {
      alert(`${contenders[0].name} wins!`)
    } else if(contenders[0].hp < contenders[1].hp) {
      alert(`${contenders[1].name} wins!`)
    } else {
      alert('Draw!')
    }

    // this.getFighters();
    this.clearContenders();
  }
  
  render() {
    const {contenders, allFighters} = this.state;
    const {chooseContender, editName, replaceContender, battleFn, clearContenders} = this;
    console.log(contenders)
    return (
      <section className="App">
          <Header />
          <Battlefield
            contenders={contenders}
            editNameFn={editName}
            replaceFn={replaceContender}
            battleFn={battleFn} />
        <Fighters
          allFighters={allFighters}
          chooseFn={chooseContender}
          length={contenders.length}
          clearFn={clearContenders} />
      </section>
    );
  }
}

export default App;
