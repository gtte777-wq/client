import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // 🚀 게임 상태
  const gameState = useRef({
    player: { x: 400, y: 300, size: 20, speed: 3.5, hp: 100, maxHp: 100, angle: 0 },
    weapons: {
      gun: { level: 1, dmg: 15, cooldown: 35, lastShot: 0, speed: 10, count: 1 },
      orbital: { level: 0, dmg: 10, count: 0, radius: 80, angle: 0, speed: 0.08 },
      // ⚡ [수정] 데미지를 0.5 -> 2로 상향 (0 뜨는 문제 해결)
      field: { level: 0, dmg: 2, radius: 0 }, 
      missile: { level: 0, dmg: 40, cooldown: 100, lastShot: 0 }
    },
    bullets: [],
    enemies: [],
    gems: [],
    particles: [],
    damageTexts: [],
    keys: {},
    spawnTimer: 0,
    score: 0,
    xp: 0,
    maxXp: 20,
    level: 1,
    isRunning: false,
    frameCount: 0
  });

  const [uiState, setUiState] = useState({ score: 0, hp: 100, level: 1, xpRatio: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpOptions, setLevelUpOptions] = useState([]);

  // 키보드 핸들러
  useEffect(() => {
    const down = (e) => { gameState.current.keys[e.code] = true; };
    const up = (e) => { gameState.current.keys[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // 메인 루프
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let reqId;

    const render = () => {
      if (!gameState.current.isRunning) return;
      const state = gameState.current;
      state.frameCount++;

      // 1. 배경
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 배경 별 (반짝임 효과 추가)
      for(let i=0; i<40; i++) {
        const x = (state.frameCount * ((i%3)+0.5) * 0.2 + i * 137) % canvas.width;
        const y = (i * 49) % canvas.height;
        const flicker = Math.abs(Math.sin(state.frameCount * 0.05 + i));
        ctx.globalAlpha = 0.2 + flicker * 0.5;
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#a78bfa';
        ctx.fillRect(x, y, i%2===0 ? 2 : 3, i%2===0 ? 2 : 3);
      }
      ctx.globalAlpha = 1;

      handlePlayer(state, canvas);
      handleWeapons(state, ctx);
      handleEnemies(state, canvas, ctx);
      handleEffects(state, ctx);
      drawPlayer(ctx, state.player); // 플레이어 그리기

      if (state.frameCount % 10 === 0) {
        setUiState({ score: state.score, hp: state.player.hp, level: state.level, xpRatio: state.xp / state.maxXp });
      }
      reqId = requestAnimationFrame(render);
    };

    if (gameState.current.isRunning) render();
    return () => cancelAnimationFrame(reqId);
  }, [gameStarted, isGameOver, showLevelUp]);

  // --- 로직 ---

  const handlePlayer = (state, canvas) => {
    const p = state.player;
    if ((state.keys['KeyW'] || state.keys['ArrowUp']) && p.y > p.size) p.y -= p.speed;
    if ((state.keys['KeyS'] || state.keys['ArrowDown']) && p.y < canvas.height - p.size) p.y += p.speed;
    if ((state.keys['KeyA'] || state.keys['ArrowLeft']) && p.x > p.size) p.x -= p.speed;
    if ((state.keys['KeyD'] || state.keys['ArrowRight']) && p.x < canvas.width - p.size) p.x += p.speed;
  };

  const handleWeapons = (state, ctx) => {
    const p = state.player;
    const w = state.weapons;

    // 🔫 메인 건
    if (state.frameCount - w.gun.lastShot > w.gun.cooldown) {
      const target = getClosestEnemy(state);
      if (target) {
        const angle = Math.atan2(target.y - p.y, target.x - p.x);
        for(let i=0; i<w.gun.count; i++) {
            const spread = (i - (w.gun.count-1)/2) * 0.15;
            state.bullets.push({
              x: p.x, y: p.y, vx: Math.cos(angle + spread) * w.gun.speed, vy: Math.sin(angle + spread) * w.gun.speed,
              dmg: w.gun.dmg, size: 4, color: '#38bdf8', type: 'gun', life: 60
            });
        }
        w.gun.lastShot = state.frameCount;
      }
    }

    // 🚀 미사일
    if (w.missile.level > 0 && state.frameCount - w.missile.lastShot > w.missile.cooldown) {
        const target = getClosestEnemy(state);
        if (target) {
            state.bullets.push({
                x: p.x, y: p.y, vx: 0, vy: 0, speed: 5, target: target,
                dmg: w.missile.dmg, size: 6, color: '#f43f5e', type: 'missile', life: 120
            });
            w.missile.lastShot = state.frameCount;
        }
    }

    // 🛡️ 오비탈
    if (w.orbital.level > 0) {
        w.orbital.angle += w.orbital.speed;
        for(let i=0; i<w.orbital.count; i++) {
            const angle = w.orbital.angle + (Math.PI * 2 / w.orbital.count) * i;
            const ox = p.x + Math.cos(angle) * w.orbital.radius;
            const oy = p.y + Math.sin(angle) * w.orbital.radius;
            
            // 오비탈 디자인 (코어 + 꼬리)
            ctx.shadowBlur = 15; ctx.shadowColor = '#f59e0b';
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(ox, oy, 8, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // ⚡ 썬더 필드 (전기 효과)
    if (w.field.level > 0) {
        w.field.radius = 70 + (w.field.level * 15);
        
        ctx.save();
        ctx.translate(p.x, p.y);
        
        // 전기장 그리기 (지직거리는 효과)
        ctx.beginPath();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10; ctx.shadowColor = '#8b5cf6';
        
        for (let i = 0; i <= 360; i += 10) {
            const rad = (i * Math.PI) / 180;
            const jitter = Math.random() * 10; // 지직거림
            const r = w.field.radius + jitter;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
  };

  const handleEnemies = (state, canvas, ctx) => {
    // 적 생성
    if (state.frameCount % Math.max(15, 55 - state.level*2) === 0) {
        const edge = Math.floor(Math.random()*4);
        let x, y;
        if (edge===0) {x=Math.random()*canvas.width; y=-30;}
        else if (edge===1) {x=canvas.width+30; y=Math.random()*canvas.height;}
        else if (edge===2) {x=Math.random()*canvas.width; y=canvas.height+30;}
        else {x=-30; y=Math.random()*canvas.height;}
        
        const isBoss = Math.random() < (0.03 * state.level);
        state.enemies.push({
            x, y, size: isBoss? 35:18, 
            hp: isBoss? 50*state.level : 3*state.level, 
            maxHp: isBoss? 50*state.level : 3*state.level,
            speed: isBoss? 0.8 : 1.2 + Math.random()*0.5, 
            type: isBoss?'boss':'normal',
            angle: 0
        });
    }

    for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        const angle = Math.atan2(state.player.y - e.y, state.player.x - e.x);
        e.x += Math.cos(angle) * e.speed;
        e.y += Math.sin(angle) * e.speed;
        e.angle += 0.05; // 회전 애니메이션용

        // 🎨 적 그리기 (개선된 디자인)
        drawEnemy(ctx, e, state.frameCount);

        // 총알 충돌
        for (let j = state.bullets.length - 1; j >= 0; j--) {
            const b = state.bullets[j];
            if (b.type === 'missile' && b.target && state.enemies.includes(b.target)) {
                const ma = Math.atan2(b.target.y - b.y, b.target.x - b.x);
                b.vx = Math.cos(ma) * b.speed; b.vy = Math.sin(ma) * b.speed;
            }

            if (Math.hypot(e.x - b.x, e.y - b.y) < e.size + b.size) {
                damageEnemy(state, i, b.dmg);
                if (b.type !== 'field') state.bullets.splice(j, 1);
                break;
            }
            b.x += b.vx; b.y += b.vy; b.life--;
            
            // 총알 그리기 (미사일은 꼬리 추가)
            ctx.fillStyle = b.color;
            ctx.beginPath(); ctx.arc(b.x, b.y, b.size, 0, Math.PI*2); ctx.fill();
            if(b.life <= 0) state.bullets.splice(j, 1);
        }

        // 오비탈 충돌
        if (state.weapons.orbital.level > 0) {
            const w = state.weapons.orbital;
            for(let k=0; k<w.count; k++) {
                const ang = w.angle + (Math.PI*2/w.count)*k;
                const ox = state.player.x + Math.cos(ang)*w.radius;
                const oy = state.player.y + Math.sin(ang)*w.radius;
                if (Math.hypot(e.x - ox, e.y - oy) < e.size + 10) {
                    if (state.frameCount % 10 === 0) damageEnemy(state, i, w.dmg);
                }
            }
        }

        // ⚡ 썬더 필드 충돌 (데미지 로직 수정됨!)
        if (state.weapons.field.level > 0) {
            if (Math.hypot(e.x - state.player.x, e.y - state.player.y) < state.weapons.field.radius) {
                // 5프레임마다 타격
                if (state.frameCount % 5 === 0) damageEnemy(state, i, state.weapons.field.dmg);
            }
        }

        // 플레이어 충돌
        if (Math.hypot(e.x - state.player.x, e.y - state.player.y) < e.size + state.player.size) {
            state.player.hp -= 0.5;
            if (state.player.hp <= 0) { setIsGameOver(true); state.isRunning = false; }
        }
    }
  };

  const damageEnemy = (state, idx, dmg) => {
    const e = state.enemies[idx];
    e.hp -= dmg;
    e.hit = 3; // 피격 플래시
    // 데미지 텍스트 (0이 아니면 표시)
    if (Math.floor(dmg) > 0) {
        state.damageTexts.push({ x: e.x, y: e.y, text: Math.floor(dmg), alpha: 1, life: 20, color: '#fff' });
    }

    if (e.hp <= 0) {
        // 💥 폭발 이펙트 (파편 많이)
        const particleCount = e.type === 'boss' ? 20 : 8;
        for(let i=0; i<particleCount; i++) {
            state.particles.push({ 
                x: e.x, y: e.y, 
                vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, 
                life: 30, color: e.type === 'boss' ? '#ef4444' : '#a855f7', size: Math.random()*4 
            });
        }
        state.gems.push({ x: e.x, y: e.y, val: e.type==='boss'?50:10, color: e.type==='boss'?'#f472b6':'#4ade80' });
        state.score += e.type==='boss'?100:10;
        state.enemies.splice(idx, 1);
    }
  };

  const handleEffects = (state, ctx) => {
    // 보석
    for (let i = state.gems.length - 1; i >= 0; i--) {
        const g = state.gems[i];
        const dist = Math.hypot(g.x - state.player.x, g.y - state.player.y);
        if (dist < 150) { g.x += (state.player.x - g.x)*0.15; g.y += (state.player.y - g.y)*0.15; }
        
        ctx.shadowBlur = 8; ctx.shadowColor = g.color;
        ctx.fillStyle = g.color;
        // 보석 모양 (마름모)
        ctx.beginPath(); 
        ctx.moveTo(g.x, g.y-5); ctx.lineTo(g.x+5, g.y); ctx.lineTo(g.x, g.y+5); ctx.lineTo(g.x-5, g.y); 
        ctx.fill();
        ctx.shadowBlur = 0;

        if (dist < 25) {
            state.xp += g.val;
            state.gems.splice(i, 1);
            if (state.xp >= state.maxXp) levelUp(state);
        }
    }
    // 파티클
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        if (p.life <= 0) state.particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    // 데미지 텍스트
    ctx.font = 'bold 14px Arial';
    for (let i = state.damageTexts.length - 1; i >= 0; i--) {
        const t = state.damageTexts[i];
        t.y -= 1; t.life--;
        ctx.fillStyle = t.color;
        ctx.globalAlpha = t.life / 20;
        ctx.fillText(t.text, t.x, t.y);
        if (t.life <= 0) state.damageTexts.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  };

  // 🎨 [디자인] 적 그리기 (꿈틀거리는 외계인)
  const drawEnemy = (ctx, e, frame) => {
    ctx.save();
    ctx.translate(e.x, e.y);
    
    const color = e.type === 'boss' ? '#ef4444' : '#a855f7';
    const coreColor = e.type === 'boss' ? '#7f1d1d' : '#581c87';
    
    ctx.fillStyle = e.hit ? '#ffffff' : color;
    ctx.shadowBlur = 15; ctx.shadowColor = color;

    // 몸통 (울렁거리는 원)
    ctx.beginPath();
    const spikes = e.type === 'boss' ? 8 : 5; // 가시 개수
    const outerRadius = e.size;
    const innerRadius = e.size * 0.7;

    for (let i = 0; i < spikes * 2; i++) {
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        // 울렁거림 추가
        const wobble = Math.sin(frame * 0.1 + i) * 2;
        const angle = (Math.PI / spikes) * i + (frame * 0.02); // 회전
        const x = Math.cos(angle) * (r + wobble);
        const y = Math.sin(angle) * (r + wobble);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // 눈 (코어)
    ctx.fillStyle = e.hit ? '#ff0000' : '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, e.size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // HP바 (보스만)
    if (e.type === 'boss') {
        ctx.fillStyle = 'red';
        ctx.fillRect(-20, -e.size - 10, 40, 4);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-20, -e.size - 10, 40 * (e.hp / e.maxHp), 4);
    }

    ctx.restore();
  };

  // 🎨 [디자인] 플레이어 (네온 우주선)
  const drawPlayer = (ctx, p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    
    // 회전 (마우스가 없으므로 이동 방향으로 기울기 효과 정도만 줄 수도 있지만, 일단 고정)
    
    // 엔진 불꽃 (여러개)
    ctx.shadowBlur = 15; ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = '#0ea5e9';
    
    // 왼쪽 엔진 불꽃
    ctx.beginPath();
    ctx.moveTo(-12, 10); ctx.lineTo(-8, 10); 
    ctx.lineTo(-10, 10 + Math.random() * 15);
    ctx.fill();
    // 오른쪽 엔진 불꽃
    ctx.beginPath();
    ctx.moveTo(8, 10); ctx.lineTo(12, 10); 
    ctx.lineTo(10, 10 + Math.random() * 15);
    ctx.fill();

    // 본체 디자인
    ctx.fillStyle = '#ffffff'; // 흰색 코어
    ctx.beginPath();
    ctx.moveTo(0, -20); 
    ctx.lineTo(15, 15); 
    ctx.lineTo(0, 8); 
    ctx.lineTo(-15, 15); 
    ctx.closePath();
    ctx.fill();

    // 네온 라인
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 콕핏 (조종석)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -5, 4, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
  };

  const getClosestEnemy = (state) => {
    let closest = null, minDist = 500;
    state.enemies.forEach(e => {
        const d = Math.hypot(e.x - state.player.x, e.y - state.player.y);
        if (d < minDist) { minDist = d; closest = e; }
    });
    return closest;
  };

  const levelUp = (state) => {
    state.isRunning = false;
    state.level++;
    state.xp = 0;
    state.maxXp = Math.floor(state.maxXp * 1.3);
    const pool = [
        { id: 'gun', title: '플라즈마 캐논', desc: '발사체 개수 +1', icon: '🔫' },
        { id: 'speed', title: '연사 속도', desc: '공격 속도 20% 증가', icon: '⚡' },
        { id: 'orbital', title: '오비탈', desc: '회전 방어체 +1', icon: '🛰️' },
        { id: 'field', title: '썬더 필드', desc: '전기장 범위 증가', icon: '🌀' },
        { id: 'missile', title: '스마트 미사일', desc: '유도 미사일 발사', icon: '🚀' },
        { id: 'heal', title: '긴급 수리', desc: 'HP 50% 회복', icon: '❤️' }
    ];
    setLevelUpOptions(pool.sort(() => 0.5 - Math.random()).slice(0, 3));
    setShowLevelUp(true);
  };

  const selectUpgrade = (option) => {
    const s = gameState.current;
    const w = s.weapons;
    if (option.id === 'gun') w.gun.count++;
    if (option.id === 'speed') w.gun.cooldown *= 0.8;
    if (option.id === 'orbital') { w.orbital.level++; w.orbital.count++; }
    if (option.id === 'field') { w.field.level++; w.field.dmg += 1; } // 데미지도 같이 증가
    if (option.id === 'missile') w.missile.level++;
    if (option.id === 'heal') s.player.hp = Math.min(s.player.maxHp, s.player.hp + 50);
    setShowLevelUp(false);
    s.isRunning = true;
  };

  const startGame = () => {
    gameState.current = {
        player: { x: 400, y: 300, size: 20, speed: 3.5, hp: 100, maxHp: 100 },
        // 무기 초기화 (썬더필드 데미지 2로 설정)
        weapons: { gun: { level: 1, dmg: 15, cooldown: 35, lastShot: 0, speed: 10, count: 1 }, orbital: { level: 0, dmg: 10, count: 0, radius: 80, angle: 0, speed: 0.08 }, field: { level: 0, dmg: 2, radius: 0 }, missile: { level: 0, dmg: 40, cooldown: 100, lastShot: 0 } },
        bullets: [], enemies: [], gems: [], particles: [], damageTexts: [], keys: {}, spawnTimer: 0, score: 0, xp: 0, maxXp: 20, level: 1, isRunning: true, frameCount: 0
    };
    setUiState({ score: 0, hp: 100, level: 1, xpRatio: 0 });
    setIsGameOver(false);
    setGameStarted(true);
    setShowLevelUp(false);
  };

  // 🔹 스타일 정의
  const btnStyle = { padding: '8px 15px', background: '#1e293b', border: '1px solid #475569', color: 'white', borderRadius: '6px', marginRight: '10px', cursor: 'pointer' };
  const cardStyle = { width: '180px', height: '240px', background: '#1e293b', border: '2px solid #6366f1', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '15px', textAlign: 'center', transition: 'transform 0.2s', boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' };

  return (
    <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'Pretendard', sans-serif" }}>
      {/* 상단바 */}
      <div style={{ width: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
            <button onClick={()=>navigate(-1)} style={btnStyle}>⬅ 뒤로</button>
            <button onClick={()=>navigate('/')} style={btnStyle}>🏠 홈</button>
        </div>
        <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24'}}>
            Lv.{uiState.level} <span style={{fontSize:'1rem', color:'white'}}>Score: {uiState.score}</span>
        </div>
      </div>
      {/* 상태바 */}
      <div style={{width: '800px', height: '8px', background: '#334155', borderRadius: '4px', marginBottom: '4px'}}>
        <div style={{width: `${uiState.xpRatio*100}%`, height: '100%', background: '#a855f7', transition: 'width 0.2s'}}></div>
      </div>
      <div style={{width: '800px', height: '8px', background: '#334155', borderRadius: '4px', marginBottom: '15px'}}>
        <div style={{width: `${uiState.hp}%`, height: '100%', background: uiState.hp>30?'#22c55e':'#ef4444', transition: 'width 0.2s'}}></div>
      </div>
      {/* 캔버스 */}
      <div style={{ position: 'relative' }}>
        <canvas ref={canvasRef} width={800} height={600} style={{ background: '#0f172a', borderRadius: '12px', border: '2px solid #6366f1', boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }} />
        
        {/* 오버레이 */}
        {(!gameStarted || isGameOver) && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, backdropFilter: 'blur(5px)' }}>
                <h1 style={{fontSize: '4rem', color: isGameOver?'#ef4444':'#fbbf24', textShadow: '0 0 20px orange', marginBottom:'20px'}}>
                    {isGameOver ? 'GAME OVER' : 'GALAXY SURVIVOR'}
                </h1>
                {isGameOver && <p style={{fontSize: '1.5rem'}}>최종 점수: {uiState.score}</p>}
                <button onClick={startGame} style={{ padding: '15px 40px', fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #f59e0b, #ea580c)', border: 'none', color: 'white', borderRadius: '50px', cursor: 'pointer', marginTop: '20px' }}>{isGameOver?'다시 도전':'출격 개시'}</button>
            </div>
        )}
        {/* 레벨업 팝업 */}
        {showLevelUp && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.85)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                <h2 style={{fontSize: '2.5rem', color: '#fcd34d', marginBottom: '30px'}}>⚡ LEVEL UP! ⚡</h2>
                <div style={{display: 'flex', gap: '20px'}}>
                    {levelUpOptions.map((opt, i) => (
                        <div key={i} onClick={() => selectUpgrade(opt)} style={cardStyle}>
                            <div style={{fontSize: '3rem'}}>{opt.icon}</div>
                            <h3 style={{color: '#38bdf8'}}>{opt.title}</h3>
                            <p style={{color: '#94a3b8', fontSize: '0.9rem'}}>{opt.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
      <p style={{marginTop: '20px', color: '#64748b'}}>🕹️ WASD 이동 | 🔫 자동 공격 | 💎 보석 획득</p>
    </div>
  );
};

export default GamePage;