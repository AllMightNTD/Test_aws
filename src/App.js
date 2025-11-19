import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  FaUser, FaWallet, FaHistory, FaVolumeUp, FaVolumeMute, 
  FaSun, FaMoon, FaTimes 
} from 'react-icons/fa';

const SYMBOLS = {
  bau: { emoji: 'Bầu', name: 'Bầu' },
  cua: { emoji: 'Cua', name: 'Cua' },
  tom: { emoji: 'Tôm', name: 'Tôm' },
  ca: { emoji: 'Cá', name: 'Cá' },
  ga: { emoji: 'Gà', name: 'Gà' },
  nai: { emoji: 'Nai', name: 'Nai' }
};

const CHIP_VALUES = [100, 500, 1000, 5000, 10000];

const WIN_SOUND = 'https://assets.mixkit.co/sfx/preview/mixkit-coin-win-notification-1939.mp3';
const LOSE_SOUND = 'https://assets.mixkit.co/sfx/preview/mixkit-failure-arcade-alert-notification-240.mp3';

function App() {
  const [balance, setBalance] = useState(100000);
  const [bets, setBets] = useState({});
  const [dice, setDice] = useState(['?', '?', '?']);
  const [isRolling, setIsRolling] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [selectedChip, setSelectedChip] = useState(1000);
  const [shake, setShake] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Ref cho input
  const usernameRef = useRef('');
  const passwordRef = useRef('');

  // Load user + balance từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('casinoUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setBalance(parsed.balance || 100000);
    }
    const savedHistory = localStorage.getItem('gameHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Lưu balance + history khi thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('casinoUser', JSON.stringify({ ...user, balance }));
    }
  }, [balance, user]);

  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(history));
  }, [history]);

  const playSound = (url) => {
    if (!isMuted) {
      new Audio(url).play().catch(() => {});
    }
  };

  const login = () => {
    const username = usernameRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    if (!username || !password) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    const newUser = { username, balance: 100000 };
    setUser(newUser);
    setBalance(100000);
    localStorage.setItem('casinoUser', JSON.stringify(newUser));
    setShowLogin(false);
  };

  const logout = () => {
    setUser(null);
    setBalance(100000);
    localStorage.removeItem('casinoUser');
  };

  const deposit = (amount) => {
    if (!user) return;
    setBalance(prev => prev + amount);
    setHistory(prev => [{
      type: 'deposit',
      amount,
      date: new Date().toLocaleString('vi-VN')
    }, ...prev]);
  };

  const placeBet = (symbol) => {
    if (isRolling || !user) return;
    if (balance < selectedChip) {
      alert('Không đủ tiền! Nạp thêm nhé');
      return;
    }
    setBets(prev => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + selectedChip
    }));
    setBalance(prev => prev - selectedChip);
  };

  const rollDice = () => {
    if (!user) return alert('Vui lòng đăng nhập!');
    if (Object.keys(bets).length === 0) return alert('Chưa đặt cược!');

    setIsRolling(true);
    setShake(true);
    setResultMsg('');
    setDice(['?', '?', '?']);

    setTimeout(() => {
      const keys = Object.keys(SYMBOLS);
      const results = Array(3).fill().map(() => keys[Math.floor(Math.random() * keys.length)]);

      setDice(results.map(k => SYMBOLS[k].emoji));
      setShake(false);

      const totalBet = Object.values(bets).reduce((a, b) => a + b, 0);
      let winAmount = 0;
      const winDoors = new Set();

      results.forEach(res => {
        if (bets[res]) {
          winAmount += bets[res] * 3; // Tỉ lệ 1 ăn 2 → tổng nhận gấp 3
          winDoors.add(SYMBOLS[res].name);
        }
      });

      const profit = winAmount - totalBet;
      setBalance(prev => prev + winAmount);

      const round = {
        date: new Date().toLocaleString('vi-VN'),
        bet: totalBet,
        result: results.map(k => SYMBOLS[k].name),
        win: winAmount,
        profit
      };

      setHistory(prev => [round, ...prev].slice(0, 50));

      if (winAmount > 0) {
        setResultMsg(`THẮNG LỚN! +${profit.toLocaleString()} VNĐ ở: ${[...winDoors].join(', ')}`);
        playSound(WIN_SOUND);
      } else {
        setResultMsg(`Thua ${totalBet.toLocaleString()} VNĐ – Thử lại nhé!`);
        playSound(LOSE_SOUND);
      }

      setBets({});
      setIsRolling(false);
    }, 2800);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="logo"><span className="gold">SV88</span> CASINO</div>
        <nav className="main-nav">
          <a href="#" className="active">Bầu Cua</a>
          <a href="#">Xóc Đĩa</a>
          <a href="#">Slot</a>
          <a href="#">Thể Thao</a>
        </nav>
        <div className="user-bar">
          {user ? (
            <>
              <div className="welcome"><FaUser /> {user.username}</div>
              <div className="balance-display">
                <FaWallet /> <strong>{balance.toLocaleString()}</strong>đ
              </div>
              <button onClick={() => setShowHistory(true)} className="icon-btn"><FaHistory /></button>
              <button onClick={() => setIsMuted(!isMuted)} className="icon-btn">
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="icon-btn">
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button onClick={logout} className="logout-btn">Thoát</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} className="login-btn">Đăng Nhập</button>
          )}
        </div>
      </header>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-content">
          Nạp 1 triệu tặng 500K! • Hoàn tiền 1.5% không giới hạn! • Giftcode hàng ngày!
        </div>
      </div>

      <div className="main-container">
        <aside className="sidebar">
          <h3>Game Hot</h3>
          <ul><li className="active">Bầu Cua Tôm Cá</li><li>Tài Xỉu</li><li>Xóc Đĩa</li></ul>
          <div className="quick-deposit">
            <h4>Nạp Nhanh</h4>
            <div className="quick-amounts">
              {[100000, 500000, 1000000].map(a => (
                <button key={a} onClick={() => deposit(a)} disabled={!user}>
                  +{a/1000}K
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="game-area">
          <div className="game-container">
            <h1 className="game-title">BẦU CUA TÔM CÁ</h1>

            <div className={`dice-container ${shake ? 'shake' : ''}`}>
              {dice.map((d, i) => (
                <div key={i} className="dice"><span>{d}</span></div>
              ))}
            </div>

            <div className={`result ${resultMsg.includes('THẮNG') ? 'win' : resultMsg.includes('Thua') ? 'lose' : ''}`}>
              {resultMsg || 'Chọn chip → Đặt cược → Lắc ngay!'}
            </div>

            <div className="chip-selector">
              {CHIP_VALUES.map(v => (
                <div
                  key={v}
                  className={`chip ${selectedChip === v ? 'selected' : ''}`}
                  onClick={() => setSelectedChip(v)}
                >
                  <div className="chip-value">{v >= 1000 ? `${v/1000}K` : v}</div>
                </div>
              ))}
            </div>

            <div className="betting-table">
              {Object.entries(SYMBOLS).map(([key, { emoji, name }]) => (
                <div
                  key={key}
                  className={`bet-box ${bets[key] ? 'betting' : ''}`}
                  onClick={() => placeBet(key)}
                >
                  <div className="symbol">{emoji}</div>
                  <div className="name">{name}</div>
                  {bets[key] > 0 && (
                    <div className="bet-chips">
                      <div className="chip-on-table">
                        {(bets[key]/1000).toFixed(bets[key] < 1000 ? 1 : 0)}K
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="roll-button" onClick={rollDice} disabled={isRolling || !user}>
              {isRolling ? 'ĐANG LẮC...' : 'LẮC NGAY – ĂN GẤP 3!'}
            </button>

            <div className="total-bet">
              Tổng cược: <strong>{Object.values(bets).reduce((a,b) => a+b, 0).toLocaleString()}</strong> VNĐ
            </div>
          </div>
        </main>
      </div>

      {/* Modal Login */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLogin(false)}><FaTimes /></button>
            <h2>Đăng Nhập SV88</h2>
            <input ref={usernameRef} type="text" placeholder="Tên đăng nhập" />
            <input ref={passwordRef} type="password" placeholder="Mật khẩu" />
            <div className="modal-actions">
              <button onClick={login}>Đăng Nhập</button>
              <button onClick={() => setShowLogin(false)} className="cancel">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal History */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal history-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowHistory(false)}><FaTimes /></button>
            <h2>Lịch Sử Chơi</h2>
            <div className="history-list">
              {history.length === 0 ? <p>Chưa có ván nào</p> : history.map((h, i) => (
                <div key={i} className={`history-item ${h.profit > 0 ? 'win' : 'lose'}`}>
                  <span>{h.date}</span>
                  <span>Cược: {h.bet.toLocaleString()}</span>
                  <span>{h.result.join(' ')}</span>
                  <strong>{h.profit > 0 ? '+' : ''}{h.profit.toLocaleString()}đ</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        © 2025 SV88 Casino – Chơi vui, có trách nhiệm. Chỉ từ 18 tuổi
      </footer>
    </div>
  );
}

export default App;