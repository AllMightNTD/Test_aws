import React, { useState } from 'react';
import './App.css';

const SYMBOLS = {
  bau: { emoji: '🍈', name: 'Bầu' },
  cua: { emoji: '🦀', name: 'Cua' },
  tom: { emoji: '🦐', name: 'Tôm' },
  ca: { emoji: '🐟', name: 'Cá' },
  ga: { emoji: '🐓', name: 'Gà' },
  nai: { emoji: '🦌', name: 'Nai' }
};

const CHIP_VALUES = [100, 500, 1000, 5000, 10000];

function App() {
  const [balance, setBalance] = useState(100000);
  const [bets, setBets] = useState({});
  const [dice, setDice] = useState(['?', '?', '?']);
  const [isRolling, setIsRolling] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [selectedChip, setSelectedChip] = useState(1000);
  const [shake, setShake] = useState(false);

  const placeBet = (symbol) => {
    if (isRolling) return;
    if (balance < selectedChip) {
      alert('Không đủ tiền để cược!');
      return;
    }

    setBets(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + selectedChip
    }));
    setBalance(prev => prev - selectedChip);
  };

  const rollDice = () => {
    if (Object.keys(bets).length === 0) {
      alert('Bạn chưa đặt cược cửa nào!');
      return;
    }

    setIsRolling(true);
    setShake(true);
    setResultMsg('');
    setDice(['?', '?', '?']);

    setTimeout(() => {
      const keys = Object.keys(SYMBOLS);
      const results = Array(3).fill().map(() => keys[Math.floor(Math.random() * keys.length)]);

      setDice(results.map(key => SYMBOLS[key].emoji));
      setShake(false);

      let win = 0;
      const winDoors = new Set();

      results.forEach(res => {
        if (bets[res]) {
          win += bets[res] * 3; // Tỷ lệ ăn cao hơn cho vui
          winDoors.add(SYMBOLS[res].name);
        }
      });

      if (win > 0) {
        setBalance(prev => prev + win);
        setResultMsg(`🎉 CHÚC MỪNG! Thắng ${win.toLocaleString()} coin ở: ${[...winDoors].join(', ')}`);
      } else {
        setResultMsg('😔 Thua rồi! Thử lại nhé!');
      }

      setBets({});
      setIsRolling(false);
    }, 2500);
  };

  const resetGame = () => {
    setBalance(100000);
    setBets({});
    setDice(['?', '?', '?']);
    setResultMsg('');
  };

  return (
    <div className="app">
      {/* Header giống SV88 */}
      <header className="header">
        <div className="logo">SV88 Casino</div>
        <nav className="nav">
          <a href="#">Trang Chủ</a>
          <a href="#">Casino</a>
          <a href="#">Thể Thao</a>
          <a href="#">Bầu Cua</a>
        </nav>
        <div className="user-info">VIP Member</div>
      </header>

      <div className="main-container">
        {/* Sidebar menu */}
        <aside className="sidebar">
          <h3>Trò Chơi Nổi Bật</h3>
          <ul>
            <li>Bầu Cua Tôm Cá</li>
            <li>Roulette</li>
            <li>Blackjack</li>
            <li>Slot Game</li>
          </ul>
        </aside>

        {/* Game Content */}
        <main className="game-content">
          <div className="container">
            <h1 className="title">BẦU CUA TÔM CÁ</h1>

            <div className="balance-section">
              <div className="balance">
                Số dư: <strong>{balance.toLocaleString()}</strong> VNĐ
              </div>
              <button className="reset-btn" onClick={resetGame}>Reset</button>
            </div>

            <div className={`dice-container ${shake ? 'shake' : ''}`}>
              {dice.map((d, i) => (
                <div key={i} className="dice">
                  <span className="dice-face">{d}</span>
                </div>
              ))}
            </div>

            <div className={`result ${resultMsg.includes('Thắng') ? 'win' : 'lose'}`}>
              {resultMsg || 'Đặt cược và lắc ngay!'}
            </div>

            {/* Chips */}
            <div className="chips">
              {CHIP_VALUES.map(val => (
                <div
                  key={val}
                  className={`chip ${selectedChip === val ? 'selected' : ''}`}
                  onClick={() => setSelectedChip(val)}
                >
                  {val >= 1000 ? `${val/1000}K` : val}
                </div>
              ))}
            </div>

            {/* Betting Board */}
            <div className="betting-board">
              {Object.entries(SYMBOLS).map(([key, { emoji, name }]) => (
                <div
                  key={key}
                  className={`bet-item ${bets[key] > 0 ? 'has-bet' : ''}`}
                  onClick={() => placeBet(key)}
                >
                  <div className="symbol">{emoji}</div>
                  <div className="name">{name}</div>
                  <div className="bet-amount">
                    {bets[key] > 0 ? bets[key].toLocaleString() : '0'}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="roll-btn"
              onClick={rollDice}
              disabled={isRolling}
            >
              {isRolling ? 'ĐANG LẮC...' : 'LẮC XÚC XẮC NGAY!'}
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>SV88 - Giải Trí Trực Tuyến An Toàn & Uy Tín | Game vui, không cờ bạc thật!</p>
      </footer>
    </div>
  );
}

export default App;