import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import './index.css'

class Key extends Component {
  render () {
    const {keyName, keyPitch, isBlackKey, isPressed, onKeyClick} = this.props
    return (
      <div
        className={"key" + (isBlackKey? ' isBlackKey' : '') + (isPressed? ' isPressed' : '')}
        data-key={keyName}
        onClick={onKeyClick}
      >
        <div
          className="key-name"
          data-key={keyName}
        >
          {keyName}
        </div>
        <div
          className="key-pitch"
          data-key={keyName}
        >
          {keyPitch}
        </div>
      </div>
    )
  }
}

Key.propTypes = {
  keyName: PropTypes.string,
  keyPitch: PropTypes.string,
  isBlackKey: PropTypes.bool,
  isPressed: PropTypes.bool,
  onKeyClick: PropTypes.func,
}

class App extends Component {
  constructor (props) {
    super(props)
    this.keys = ['A', 'W', 'S', 'E', 'D', 'F', 'T', 'G', 'Y', 'H', 'U', 'J', 'K']
    this.isBlackKey = [false, true, false, true, false, false, true, false, true, false, true, false, false]
    this.keysPitch = ['C1', 'C1S', 'D1', 'D1S', 'E1', 'F1', 'F1S', 'G1', 'G1S', 'A1', 'A1S', 'B1', 'C2']
    this.wavs = [
      '/wav-piano-sound/c1.wav',
      '/wav-piano-sound/c1s.wav',
      '/wav-piano-sound/d1.wav',
      '/wav-piano-sound/d1s.wav',
      '/wav-piano-sound/e1.wav',
      '/wav-piano-sound/f1.wav',
      '/wav-piano-sound/f1s.wav',
      '/wav-piano-sound/g1.wav',
      '/wav-piano-sound/g1s.wav',
      '/wav-piano-sound/a1.wav',
      '/wav-piano-sound/a1s.wav',
      '/wav-piano-sound/b1.wav',
      '/wav-piano-sound/c2.wav',
    ]
    this.state = {
      played: [],
      playedCnt: 0,
      isPressed: {
        'A': false,
        'W': false,
        'S': false,
        'E': false,
        'D': false,
        'F': false,
        'T': false,
        'G': false,
        'Y': false,
        'H': false,
        'U': false,
        'J': false,
        'K': false,
      },
    }
  }

  playSound (url) {
    let audio = document.createElement('audio')
    audio.style.display = "none"
    audio.src = url
    audio.autoplay = true
    audio.onended = function(){
      audio.remove() //Remove when played.
    }
    document.body.appendChild(audio)
  }

  playPitch (pitchId) {
    this.playSound(this.wavs[pitchId])
  }

  keyPress (key) {
    let pitchId = 0
    for (let i = 0; i < this.keys.length; ++i) {
      if (key === this.keys[i]) {
        pitchId = i
        break
      }
    }
    this.playPitch(pitchId)

    let newPlayed = JSON.parse(JSON.stringify(this.state.played))
    let newPlayedCnt = this.state.playedCnt
    if (newPlayedCnt === 0) {
      newPlayed.push(this.keysPitch[pitchId])
    } else {
      newPlayed[newPlayed.length - 1] += ' ' + this.keysPitch[pitchId]
    }

    newPlayedCnt += 1
    if (newPlayedCnt === 8) {
      newPlayedCnt = 0
    }
    this.setState({
      played: newPlayed,
      playedCnt: newPlayedCnt
    })

    let newIsPressed = JSON.parse(JSON.stringify(this.state.isPressed))
    newIsPressed[key] = true
    this.setState({
      isPressed: newIsPressed
    },() => {
      setTimeout(() => {
        let oldIsPressed = JSON.parse(JSON.stringify(this.state.isPressed))
        oldIsPressed[key] = false
        this.setState({
          isPressed: oldIsPressed
        })
      }, 600)
    })
  }

  onKeyClick (e) {
    let key = e.target.dataset.key
    this.keyPress(key)
  }

  componentDidMount () {
    document.addEventListener('keydown', (e) => {
      let key = e.key
      key = key.toUpperCase()
      if (key in this.state.isPressed) {
        this.keyPress(key)
      }
    })
  }

  render () {
    window.scrollTo(0,document.body.scrollHeight);
    return (
      <div>
        <h1>Node Piano</h1>
        <div className="played">
          <h3>Pitches you have played:</h3>
          <div className="inner">
            {this.state.played.map((p, id) =>
              <p
                key={id}
              >
                <i>
                  {p}
                </i>
              </p>
            )}
          </div>
        </div>
        <div className="keyboard-layout">
          <a target="_blank" href="/pic/keyboard-layout.png">Play with a keyboard!</a>
        </div>
        <div className="keyboard">
          <div className="inner">
            {this.keys.map((k, id) =>
              <Key
                key={id}
                keyName={k}
                keyPitch={this.keysPitch[id]}
                isBlackKey={this.isBlackKey[id]}
                isPressed={this.state.isPressed[k]}
                onKeyClick={this.onKeyClick.bind(this)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
