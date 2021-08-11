import { html, css, LitElement } from 'lit-element';
import './components/TicTacToeBox.js';
import './components/ModalDialog.js';

export class LitTicTacToe extends LitElement {
  static get styles() {
    return css`
      :host {
        --board-bg-color: #e5d6c2;
      }
      .board {
        width: 540px;
        height: 540px;
        padding: 20px;
        background: var(--board-bg-color);
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        justify-content: space-between;
        border-radius: 13px;
      }
    `;
  }

  static get properties() {
    return {
      board: { type: Array },
      currentPlayer: { type: Number },
      plays: { type: Object },
      turn: { type: Number }
    };
  }

  constructor() {
    super();
    this.initGame();
    this.addEventListener('player-win', e => {
      const modal = this.shadowRoot.querySelector('modal-dialog');
      modal.open = true;
      modal.title = 'Congratulations 🎉';
      modal.text = `Player ${e.detail.player} has won!`;
    });

    this.addEventListener('tie', () => {
      const modal = this.shadowRoot.querySelector('modal-dialog');
      modal.open = true;
      modal.title = 'mmh';
      modal.text = `It seems i'ts a tie 🤨`;
    });
  }

  render() {
    return html`
      <modal-dialog @reset-game="${this.resetGame}"></modal-dialog>
      <div class="board">
        ${this.board.map((row, rowIndex) =>
          row.map((col, colIndex) => 
            html`
              <tic-tac-toe-box 
                .symbol=''
                .col=${colIndex}
                .row=${rowIndex}
                @click="${this._handleClick}"
              >
              </tic-tac-toe-box>`
          ))}
      </div>
    `;
  }

  resetGame() {
    this.resetTiles();
    this.initGame();
  }

  initGame() {
    this.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.turn = 1;
    this.currentPlayer = 1;
    this.plays = { 1: 0, 2: 0 };
  }

  resetTiles() {
    const children = this.shadowRoot.querySelectorAll('tic-tac-toe-box');
    children.forEach(item => {
      item.symbol = '';
    });
  }

  _handleClick(e) {
    if (this.board[e.target.row][e.target.col] !== 0) {
      return;
    }

    e.target.symbol = this.currentPlayer === 1 ? 'cross' : 'circle';

    this.board[e.target.row][e.target.col] = this.currentPlayer;
    this.plays[this.currentPlayer]++;
    if (this.checkVictory(this.currentPlayer)) {
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('player-win', {
          detail: {
            player: this.currentPlayer
          }
        }));
      }, 500)
    } else if (this.plays[1] + this.plays[2] === 9) {
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('tie'));
      }, 500);
    } else {
      this.turn++;
      this.changePlayer();
    }
  }

  changePlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  checkHorizontal(player) {
    for (let row = 0; row < this.board.length; row++) {
      let count = 0;
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === player) {
          count++;
        } else {
          break;
        }
  
        if (count === this.board.length) {
          return true;
        }
      }
    }
    return false;
  }
  
  checkVertical(player) {
    for (let col = 0; col < this.board.length; col++) {
      let count = 0;
      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] === player) {
          count ++;
        } else {
          break;
        }
  
        if (count === this.board.length) {
          return true;
        }
      }
    }
    return false;
  }
  
  checkDiagonal(player) {
    let count = 0
    for (let row = 0, col = 0; row < this.board.length; row++, col++) {
      if (this.board[row][col] === player) {
        count++;
      } else {
        break;
      }
      if (count === this.board.length) {
        return true;
      }
    }
    count = 0;
    for (let row = 0, col = this.board.length - 1; 
          row < this.board.length; row++, col--) {
      if (this.board[row][col] === player) {
        count++;
      } else {
        break;
      }
      if (count === this.board.length) {
        return true;
      }
    }
    return false;
  }
  
  checkVictory(player) {
    return this.checkHorizontal(player)
        || this.checkVertical(player)
        || this.checkDiagonal(player);
  }
}
