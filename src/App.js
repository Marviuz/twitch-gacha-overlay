import { Component } from 'react';
import tmi from 'tmi.js';
import axios from 'axios';
import { io } from 'socket.io-client';

class App extends Component {
  constructor() {
    super();

    this.state = {
      character: {}
    };

    this.socket = io('https://twitch-gacha-server.herokuapp.com/');
    this.socket.on('marviuz', msg => {
      console.log(msg);
      this.setState({
        character: msg
      }, () => this.slide());
    });

    this.getRandomChar = this.getRandomChar.bind(this);
    this.delay = this.delay.bind(this);
    this.slide = this.slide.bind(this);
  }

  getRandomChar() {
    return axios.get('http://localhost:3000/api/get-random-character');
  }

  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  slide() {
    const allTransform = this.all.style.transform;
    const upperCapsuleTransform = this.upperCapsule.style.transform;
    const lowerCapsuleTransform = this.lowerCapsule.style.transform;
    const cardTransform = this.card.style.transform;

    this.all.style.transform = 'translateY(0)';
    this.delay(1000).then(() => {
      this.upperCapsule.style.transform = 'translateY(-200%)';
      this.lowerCapsule.style.transform = 'translateY(200%)';

      this.delay(1000).then(() => {
        this.card.style.transform = 'translate(-50%, -50%) scale(1.1)';
        this.delay(200).then(() => {
          this.card.style.transform = 'translate(-50%, -50%) scale(1)';
          this.delay(1000).then(() => {
            this.all.style.transform = allTransform;
            this.upperCapsule.style.transform = upperCapsuleTransform;
            this.lowerCapsule.style.transform = lowerCapsuleTransform;
            this.card.style.transform = cardTransform;
          });
        });
      });
    });
  }

  render() {
    const { character } = this.state;

    return (
      <>
        <div className="container" ref={_ => this.all = _}>
          <div className="card-container" ref={_ => this.card = _}>
            <img className="card" src={require('./assets/custom-yugioh-card.png')} alt={character.name} />
            <div className="character" style={{ '--bg-image': `url('${character.character_image}')` }}></div>
            <div className="card-name">{character.name}</div>
            <div className="card-description">{character.desc}</div>
          </div>
          <div className="capsule">
            <div className="upper-capsule" ref={_ => this.upperCapsule = _}></div>
            <div className="lower-capsule" ref={_ => this.lowerCapsule = _}></div>
          </div>
        </div>
      </>
    );
  }
}
export default App;
