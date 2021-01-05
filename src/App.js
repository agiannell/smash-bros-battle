import {Component} from 'react';
import Header from './Components/Header'
import WinHeader from './Components/WinHeader'
import DrawHeader from './Components/DrawHeader'
import Battlefield from './Components/Battlefield'
import Fighters from './Components/Fighters'
import './reset.css';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      randFighters: [],
      allFighters: [],
      contenders: [],
      winnerName: '',
      winner: false,
      draw: false,
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
            this.setState({randFighters: res.data})
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
        this.setState({
          contenders: res.data,
          winner: false,
          draw: false
        });
      })
      .catch(err => console.log(err));

      this.getFighters();
  }

  battleFn = () => {
    const {contenders} = this.state;

    if(contenders[0].hp > contenders[1].hp) {
      this.setState({
        winnerName: contenders[0].name,
        winner: true
      })
    } else if(contenders[0].hp < contenders[1].hp) {
      this.setState({
        winnerName: contenders[1].name,
        winner: true
      })
    } else {
      this.setState({draw: true})
    }
  }
  
  render() {
    const {contenders, randFighters, winnerName, winner, draw} = this.state;
    const {chooseContender, editName, replaceContender, battleFn, clearContenders} = this;
    console.log(contenders)

    let header;

    if (winner === true && draw === false) {
      header = <WinHeader name={winnerName} clearFn={clearContenders} />
    }else if(winner === false && draw === true) {
      header = <DrawHeader clearFn={clearContenders} />
    }else {
      header = <Header />
    }
    return (
      <section className="App">
        {header}
        <Battlefield
          contenders={contenders}
          editNameFn={editName}
          replaceFn={replaceContender}
          battleFn={battleFn} />
        <Fighters
          randFighters={randFighters}
          chooseFn={chooseContender}
          length={contenders.length}
          clearFn={clearContenders} />
      </section>
    );
  }
}

export default App;
