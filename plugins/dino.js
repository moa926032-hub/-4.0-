// DEVONIC BOT extracted source
// ==========================================
// 🦖 NIXEL DINO GAME
// الأمر: .dino
// ==========================================

let handler = async (m, { conn }) => {

const lt = String.fromCharCode(60);
const html = `
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Arial'}
body{background:#f7f7f7;color:#535353}
.game{width:100%;max-width:600px;margin:auto;border:2px solid #535353;border-radius:10px;overflow:hidden;background:#fff}

/* شاشة البداية */
.start{padding:30px;text-align:center}
.start h1{font-size:28px;margin-bottom:10px;color:#535353}
.start p{color:#888;margin-bottom:20px}
.start button{padding:12px 35px;background:#535353;color:#fff;border:0;border-radius:8px;font-size:16px;font-weight:bold}

/* اللعبة */
.game-area{display:none;position:relative;height:200px;background:#fff;border-bottom:2px solid #535353}
.ground{position:absolute;bottom:0;width:100%;height:2px;background:#535353}
.dino{position:absolute;left:50px;bottom:20px;width:44px;height:47px;background:#535353;border-radius:4px}
.obstacle{position:absolute;bottom:20px;width:25px;height:30px;background:#2e7d32}
.bat{position:absolute;width:46px;height:40px;background:#000;border-radius:50%}

/* HUD */
.hud{position:absolute;top:10px;right:15px;font-size:20px;font-weight:bold}

/* شاشة الخسارة */
.overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(247,247,247,.95);display:none;text-align:center;padding-top:70px}
.overlay h2{font-size:24px;margin-bottom:10px}
.overlay p{margin-bottom:15px}
.overlay button{padding:10px 25px;background:#535353;color:#fff;border:0;border-radius:8px;font-size:15px;font-weight:bold}

/* تعليمات */
.info{text-align:center;padding:10px;background:#eee;font-size:13px}
</style>

<div class="game">
  <div class="start" id="start">
    <h1>🦖 NIXEL DINO</h1>
    <p>اضغط للقفز وتفادى الصبار والخفافيش</p>
    <button onclick="startGame()">START</button>
  </div>

  <div class="game-area" id="game">
    <div class="hud">SCORE: <span id="score">00000</span></div>
    <div class="dino" id="dino"></div>
    <div class="ground"></div>
    
    <div class="overlay" id="over">
      <h2>GAME OVER</h2>
      <p>النتيجة: <span id="final">0</span></p>
      <button onclick="location.reload()">إعادة اللعب</button>
    </div>
  </div>
  
  <div class="info" id="info" style="display:none">
    اضغط على الشاشة أو SPACE للقفز<br>
    <b>من 3000 نقطة كيبانو الخفافيش!</b>
  </div>
</div>

${lt}script>
let dinoY=20,dy=0,jumping=false,run=false;
let obstacles=[],bats=[],score=0,speed=6,frame=0;
let dinoEl=document.getElementById('dino');

function startGame(){
  document.getElementById('start').style.display='none';
  document.getElementById('game').style.display='block';
  document.getElementById('info').style.display='block';
  run=true; loop();
}

// القفز
function jump(){
  if(!jumping && run){
    dy=-15;jumping=true;
  }
}

document.addEventListener('keydown',e=>{if(e.code==='Space')jump()});
document.getElementById('game').onclick=jump;

function addObstacle(){
  let o=document.createElement('div');o.className='obstacle';
  o.style.right='-30px';
  document.getElementById('game').appendChild(o);
  obstacles.push({el:o,x:630});
}

function addBat(){
  let b=document.createElement('div');b.className='bat';
  b.style.right='-50px';b.style.bottom=(80+Math.random()*40)+'px';
  document.getElementById('game').appendChild(b);
  bats.push({el:b,x:650});
}

function loop(){
  if(!run)return;
  frame++; score+=0.1; speed=6+score/500;
  
  // حركة الديناصور
  dy+=0.8;dinoY+=dy;
  if(dinoY>=20){dinoY=20;jumping=false;dy=0}
  dinoEl.style.bottom=dinoY+'px';
  
  // توليد الصبار
  if(frame%Math.floor(90-speed*5)===0) addObstacle();
  
  // توليد الخفافيش من 3000
  if(score>=3000 && frame%120===0) addBat();
  
  // تحريك الصبار
  obstacles.forEach((o,i)=>{
    o.x-=speed;o.el.style.right=(600-o.x)+'px';
    if(o.x<-30){o.el.remove();obstacles.splice(i,1)}
    // تصادم
    if(o.x<90 && o.x>20 && dinoY<50){gameOver()}
  });
  
  // تحريك الخفافيش
  bats.forEach((b,i)=>{
    b.x-=speed;b.el.style.right=(600-b.x)+'px';
    if(b.x<-50){b.el.remove();bats.splice(i,1)}
    // تصادم - خاصك تدوز من التحت
    if(b.x<90 && b.x>20 && dinoY>40){gameOver()}
  });
  
  // HUD
  document.getElementById('score').textContent=Math.floor(score).toString().padStart(5,'0');
  
  requestAnimationFrame(loop);
}

function gameOver(){
  run=false;
  document.getElementById('final').textContent=Math.floor(score);
  document.getElementById('over').style.display='block';
}
${lt}/script>
`

    const data = Buffer.from(JSON.stringify({
        "response_id": "nixel-dino-game",
        "sections": [{
            "view_model": {
                "primitive": {
                    "__typename": "GenAIaeacdsnwHtmlPrimitive",
                    "payload": html,
                    "trusted_sources": ["nixel.dev"]
                },
                "__typename": "GenAISingleLayoutViewModel"
            }
        }]
    })).toString('base64')

    await conn.relayMessage(m.chat, {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        botForwardedMessage: {
            message: {
                richResponseMessage: {
                    messageType: 1,
                    submessages: [{ messageType: 2, messageText: "🦖 NIXEL DINO" }],
                    unifiedResponse: { data },
                    contextInfo: { forwardingScore: 999, isForwarded: true, forwardOrigin: 4 }
                }
            }
        }
    }, {})

}

handler.help = ['dino']
handler.tags = ['games']
handler.command = /^(dino)$/i

export default handler