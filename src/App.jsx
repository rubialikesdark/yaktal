import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════ Fonts ══════════ */
const fl=document.createElement("link");
fl.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;500;700&display=swap";
fl.rel="stylesheet";document.head.appendChild(fl);

/* ══════════ CSS ══════════ */
const css=document.createElement("style");
css.textContent=`
:root{
  --bg:#0D0A07;--bg2:#1A1410;--bgc:#13100B;--bgch:#1E1913;
  --gold:#D4A54A;--goldd:#A8873A;--red:#A83A25;
  --tx:#EDE6DA;--tx2:#B5A790;--txd:#8A7C66;
  --divine:#F5EDD8;--blue:#5A7D9E;--purple:#6E4D80;
  --brd:rgba(212,165,74,0.18);
  --fd:'Cormorant Garamond','Noto Serif KR',serif;
  --fb:'Noto Sans KR',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--tx);font-family:var(--fb);overflow:hidden;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--goldd);border-radius:2px;}
.inner-scroll{scrollbar-width:thin;scrollbar-color:var(--goldd) transparent;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ember{0%{opacity:0;transform:translateY(0) scale(.5)}15%{opacity:.8}85%{opacity:.3}100%{opacity:0;transform:translateY(-100vh) scale(1)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(212,165,74,.08)}50%{box-shadow:0 0 45px rgba(212,165,74,.25)}}
@keyframes slam{0%{opacity:0;transform:scale(1.8);filter:blur(12px)}70%{opacity:1;transform:scale(0.97);filter:blur(0)}100%{opacity:1;transform:scale(1);filter:blur(0)}}
@keyframes slamFlash{0%{opacity:0}30%{opacity:.3}100%{opacity:0}}
@keyframes lineExpand{0%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:1}}
.card-flip{perspective:800px;}
.card-flip-inner{position:relative;width:100%;height:100%;transition:transform 0.6s cubic-bezier(0.16,1,0.3,1);transform-style:preserve-3d;}
.card-flip-inner.flipped{transform:rotateY(180deg);}
.card-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;}
.card-front{transform:rotateY(0deg);}
.card-back{transform:rotateY(180deg);}
@media(max-width:768px){
  .sec-nav{display:none!important;}
  .bgm-player span.bgm-label{display:none!important;}
}
`;
document.head.appendChild(css);

/* ══════════ DATA ══════════ */
const FACTIONS=[
  {name:"타야르",color:"var(--gold)",bg:"rgba(212,165,74,0.06)",kw:["용의 영역","절대왕권"],desc:"용의 후예가 통치하는 이교도의 땅. 화산의 열기와 황금의 광채가 뒤섞인 왕국. 대왕의 말은 곧 법이며, 용의 피가 모든 것을 결정한다."},
  {name:"브리온",color:"var(--blue)",bg:"rgba(90,125,158,0.06)",kw:["카메르교","이종배척"],desc:"달의 여신을 숭배하는 인간 왕국. 스스로를 문명의 중심이라 자부하며, 타야르를 야만족으로 멸시한다. 그 이면에는 폭정과 위선이 도사리고 있다."},
  {name:"쉬프터",color:"var(--purple)",bg:"rgba(110,77,128,0.06)",kw:["변신","외모 흡수","타야르 몰살"],desc:"눈으로 생각을 읽고, 심장을 찔러 외모와 영혼을 흡수하는 존재. 타야르를 몰살시키고 자신들의 왕국을 세우려 한다."},
];
const LOCATIONS=[
  {name:"왕궁",desc:"대리석과 황금으로 이루어진 왕의 거처",icon:"🏛"},
  {name:"왕의 노천탕",desc:"흑룡·백룡 조각상의 냉온수 욕탕. 총애하는 여인에게만 허락",icon:"♨"},
  {name:"탄생의 동굴",desc:"번영기의 잉태 성역. 역대 왕의 탄생지",icon:"🕳"},
  {name:"메잘륵",desc:"용족이 신성시하는 조상의 성역",icon:"⛩"},
  {name:"불의 계곡",desc:"용암과 새장형 감옥의 처형장",icon:"🌋"},
  {name:"푸카의 숲",desc:"장난스러운 정령의 보금자리",icon:"🌲"},
  {name:"해츨링 요새",desc:"휴화산 동굴의 새끼 용 보호구역",icon:"🥚"},
  {name:"카슈닥 설산",desc:"용족에게 치명적인 만년설",icon:"🏔"},
];
const MAIN_CHARS=[
  {name:"하칸",title:"타야르 대왕",img:"/images/chars/hakan.webp",modalImg:"/images/chars/modal/hakan.webp",appear:["흑요석 눈","장대한 체격","구릿빛","용 비늘 갑주"],personality:"냉철, 적에게 잔혹, 플레이어 한정 다정·소유욕, 책임감",speech:"명령조, 무뚝뚝, 플레이어 한정 애틋·열정, 직설",intro:"드래곤의 땅을 다스리는 젊은 대왕. 냉혹한 정복자의 얼굴 아래, 한 번도 꺼내본 적 없는 감정이 잠들어 있다.",detail:"형 라이칸이 대신 사망한 것에 대한 죄책감을 안고 있다. 형수 가레트와의 혼인을 거부하며 후계 압박을 받고 있다. 10년 전 용 형태의 자신을 치유해 준 소녀의 기억을 간직하고 있다.",color:"#D4A54A"},
  {name:"길라이",title:"귀족 · 학자",img:"/images/chars/gilai.webp",modalImg:"/images/chars/modal/gilai.webp",appear:["흑단 머리","호리호리","비단 가운"],personality:"계산적, 냉소, 지적",speech:"비아냥, 논리적",intro:"비단 가운 아래 날카로운 계산을 숨긴 학자. 냉소 뒤에 감춘 것이 경멸인지 다른 무언가인지는 가까이 가봐야 안다.",detail:"가레트의 동생. 흑주술 부작용으로 심장병을 앓고 있으며, 플레이어만이 그를 치유할 수 있다.",color:"#8FA07A"},
  {name:"안드레아",title:"브리온 성황",img:"/images/chars/andrea.webp",modalImg:"/images/chars/modal/andrea.webp",appear:["금발","푸른 눈","백색 제복"],personality:"신비, 희생, 통찰",speech:"우아한 말투",intro:"달의 여신을 대리하는 브리온의 성황. 우아한 미소 너머로, 무언가를 찾아 타야르까지 온 사람.",detail:"카메르교의 수장으로서 치유와 정화의 신성력을 지닌다. 타야르까지 찾아온 진짜 이유는 아직 밝혀지지 않았다.",color:"#5A7D9E"},
  {name:"가레트",title:"선왕비",img:"/images/chars/garet.webp",modalImg:"/images/chars/modal/garet.webp",appear:["눈부신 미모"],personality:"권력욕, 질투, 교활, 잔혹",speech:"비아냥, 명령조",intro:"왕궁에서 가장 아름답고 가장 위험한 여자. 왕비의 자리를 되찾기 위해서라면 무엇이든 한다.",detail:"하칸의 형수. 재혼 왕비를 노리며 플레이어를 제거하려 한다. 시녀 티티를 매수하여 공작을 꾸미기도 한다.",color:"#A83A25"},
  {name:"마리사",title:"드래곤슬레이어 수장",img:"/images/chars/marisa.webp",modalImg:"/images/chars/modal/marisa.webp",appear:["하얀 갑주","검은 화살"],personality:"잔혹, 교활, 집착",speech:"현혹하는 말투",intro:"낯익은 얼굴로 나타난 드래곤슬레이어의 수장. 그녀가 들고 온 검은 화살은 용족의 비늘을 관통하는 유일한 무기다.",detail:"환술과 흑주술을 다루며, 리에르바와 동일한 얼굴을 하고 있다. 그녀의 진짜 정체와 목적은 이야기 속에서 밝혀진다.",color:"#6E4D80"},
];
const SUB_CHARS=[
  {name:"투란",title:"군단장",img:"/images/chars/turan.webp",modalImg:"/images/chars/modal/turan.webp",appear:["흉포 외모"],personality:"충성, 다혈질",speech:"군대식, 농담 투덜",intro:"하칸의 가장 오래된 칼. 험상궂은 얼굴로 투덜대면서도 누구보다 먼저 전장에 선다.",detail:"하칸의 최측근 군단장.",color:"#D4A54A"},
  {name:"티티",title:"전속 시녀",img:"/images/chars/titi.webp",modalImg:"/images/chars/modal/titi.webp",appear:["곱슬머리","색실"],personality:"충직, 현실적",speech:"경어",intro:"타야르 왕궁에서의 첫 안내자. 낯선 땅의 규칙을 가장 현실적으로 알려주는 시녀.",detail:"원래 가레트 소속이었으나 플레이어의 시녀로 배정.",color:"#D4A54A"},
  {name:"푸카",title:"숲 정령",img:"/images/chars/puka.webp",modalImg:"/images/chars/modal/puka.webp",appear:["통통한 꼬마","박새 변신"],personality:"장난, 통찰",speech:"반말",intro:"브리온과 타야르 사이 숲에 사는 정령. 땅콩을 바치면 도와주고, 아니면 폭풍이 온다.",detail:"날씨를 조작할 수 있는 숲의 정령.",color:"#6DA06D"},
  {name:"아다르",title:"대왕비",img:"/images/chars/adar.webp",modalImg:"/images/chars/modal/adar.webp",appear:["쇠약한 모습","초점 없는 눈"],personality:"정신불안, 후회",speech:"유아퇴행 ↔ 회복 시 호통",intro:"왕궁 깊숙이 잊힌 대왕비. 흐려진 눈 속에 아직 꺼지지 않은 후회가 남아 있다.",detail:"하칸의 모이자 대왕비. 라이칸을 편애하고 하칸에게 무관심했던 것을 후회.",color:"#B5A790"},
];
const CHAPTERS=[
  {n:1,title:"조우",mood:"이국적 긴장감 · 압도적 존재",teaser:"타야르에 발을 내딛는 순간, 모든 것이 바뀐다",branch:false},
  {n:2,title:"오해",mood:"신뢰 붕괴 · 진실을 향한 고통",teaser:"무너진 믿음 속에서 진짜 적을 찾아야 한다",branch:false},
  {n:3,title:"진실",mood:"비밀 폭로 · 재건",teaser:"감춰진 진실이 드러날 때, 선택의 순간이 온다",branch:true},
  {n:4,title:"돌파",mood:"결전 · 새로운 시작",teaser:"마지막 전쟁. 그리고 그 너머의 이야기",branch:false},
  {n:5,title:"그 후",mood:"일상 · 자유",teaser:"폭풍이 지나간 자리에서 이야기는 계속된다",branch:false},
];
const OPENING_LINES=[
  "하늘을 뒤덮은 비룡들이 뿜어내는 붉은 화염 속에서",
  "병사들의 비명이 빗발쳤다.",
  "","칠흑 같은 날개를 펄럭이며",
  "대지를 집어삼킬 듯 포효하던 검은 용이,",
  "한 사내의 형상으로 뒤바뀌었다.",
  "","\"감히 타야르의 메잘륵을 욕보인 자들.\"",
  "\"남김없이 죽여라.\"",
];
// Story text for hero (same content, displayed statically)
const STORY_LINES=OPENING_LINES.filter(l=>l!=="");

/* ══════════ TITLE SVG ══════════ */
function TitleVisual(){
  return(
    <svg viewBox="0 0 600 100" style={{width:"min(540px,80vw)",height:"auto"}}>
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A54A"/><stop offset="50%" stopColor="#F0DCA0"/><stop offset="100%" stopColor="#A8873A"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>
      <text x="300" y="75" textAnchor="middle" fontFamily="'Noto Serif KR',serif" fontSize="86" fontWeight="900" fill="url(#tg)" filter="url(#glow)" letterSpacing="14">약탈신부</text>
    </svg>
  );
}

/* ══════════ OPENING (click to skip cinematic) ══════════ */
function Opening({onCinematicEnd}){
  const [phase,setPhase]=useState(0);
  const [titleShow,setTitleShow]=useState(false);
  const [btnShow,setBtnShow]=useState(false);
  const [curLine,setCurLine]=useState(-1);
  const [lineVis,setLineVis]=useState(false);
  const [fadeOut,setFadeOut]=useState(false);
  const audioRef=useRef(null);
  const cinematicRef=useRef(null); // to cancel cinematic
  const skipRef=useRef(false);

  useEffect(()=>{
    setTimeout(()=>setTitleShow(true),500);
    setTimeout(()=>{setBtnShow(true);setPhase(1)},1800);
  },[]);

  const finishCinematic=useCallback(()=>{
    if(skipRef.current)return;
    skipRef.current=true;
    setFadeOut(true);
    setTimeout(()=>onCinematicEnd(audioRef.current),800);
  },[onCinematicEnd]);

  const handleEnter=()=>{
    if(phase!==1)return;
    setPhase(2);
    if(audioRef.current){audioRef.current.volume=0.35;audioRef.current.play().catch(()=>{});}
    setTimeout(()=>runCinematic(),800);
  };

  const handleSkip=()=>{
    if(phase===2&&!skipRef.current) finishCinematic();
  };

  const runCinematic=()=>{
    let idx=0;
    const next=()=>{
      if(skipRef.current)return;
      if(idx>=OPENING_LINES.length){setTimeout(()=>finishCinematic(),400);return;}
      setCurLine(idx);
      if(OPENING_LINES[idx]===""){idx++;setTimeout(next,500);return;}
      setLineVis(true);
      cinematicRef.current=setTimeout(()=>{
        setLineVis(false);
        cinematicRef.current=setTimeout(()=>{idx++;next()},700);
      },2400);
    };
    next();
  };

  const isQ=(l)=>l?.startsWith('"');

  return(
    <div onClick={handleSkip} style={{position:"fixed",inset:0,zIndex:1000,background:"var(--bg)",overflow:"hidden",opacity:fadeOut?0:1,transition:"opacity 0.8s ease",cursor:phase===2?"pointer":"default"}}>
      <audio ref={audioRef} loop src="bgm.mp3"/>
      {phase>=2&&(
        <video autoPlay muted playsInline onEnded={e=>{e.target.style.opacity="0"}}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.35,filter:"blur(2px)",zIndex:0,transition:"opacity 2s ease"}}>
          <source src="dragon-flight.webm" type="video/webm"/>
        </video>
      )}
      {[...Array(12)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:`${1+Math.random()*3}px`,height:`${1+Math.random()*3}px`,borderRadius:"50%",background:i%3===0?"var(--gold)":"#8B2D1A",left:`${Math.random()*100}%`,bottom:"-5%",animation:`ember ${4+Math.random()*7}s linear infinite`,animationDelay:`${Math.random()*8}s`,opacity:0,zIndex:1}}/>
      ))}
      {/* Title + Enter */}
      <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:phase<2?1:0,transition:"opacity 0.8s ease",pointerEvents:phase>=2?"none":"auto"}}>
        <div style={{opacity:titleShow?1:0,transition:"opacity 1.2s ease"}}><TitleVisual/></div>
        {phase<=1&&(
          <button onClick={e=>{e.stopPropagation();handleEnter()}} style={{marginTop:"clamp(32px,6vw,52px)",padding:"clamp(12px,2vw,15px) clamp(36px,8vw,60px)",background:"transparent",border:"1px solid var(--gold)",color:"var(--gold)",fontFamily:"var(--fd)",fontSize:"clamp(14px,2vw,16px)",fontWeight:600,letterSpacing:"clamp(3px,1vw,6px)",cursor:"pointer",opacity:btnShow?1:0,transform:btnShow?"translateY(0)":"translateY(10px)",transition:"all 0.8s ease",animation:btnShow?"glowPulse 3s ease-in-out infinite":"none"}}
          onMouseEnter={e=>{e.target.style.background="rgba(212,165,74,0.1)"}}
          onMouseLeave={e=>{e.target.style.background="transparent"}}
          >이야기 속으로</button>
        )}
      </div>
      {/* Cinematic text */}
      {phase>=2&&!fadeOut&&(
        <div style={{position:"absolute",inset:0,zIndex:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 clamp(20px,5vw,40px)",background:"rgba(13,10,7,0.65)"}}>
          <p style={{
            fontFamily:"var(--fd)",
            fontSize:isQ(OPENING_LINES[curLine])?"clamp(18px,3vw,28px)":"clamp(14px,2.2vw,20px)",
            color:isQ(OPENING_LINES[curLine])?"var(--red)":"var(--tx2)",
            textShadow:isQ(OPENING_LINES[curLine])?"0 0 30px rgba(168,58,37,0.6), 0 0 60px rgba(168,58,37,0.3)":"none",
            fontStyle:isQ(OPENING_LINES[curLine])?"normal":"italic",
            fontWeight:isQ(OPENING_LINES[curLine])?700:400,
            textAlign:"center",lineHeight:1.8,
            opacity:lineVis?1:0,transform:lineVis?"translateY(0)":"translateY(10px)",
            transition:"opacity 0.9s ease, transform 0.9s ease",
          }}>{curLine>=0?OPENING_LINES[curLine]:""}</p>
          <p style={{position:"absolute",bottom:"clamp(20px,4vw,40px)",fontSize:"clamp(10px,1.5vw,12px)",color:"var(--txd)",letterSpacing:"2px"}}>클릭하여 건너뛰기</p>
        </div>
      )}
    </div>
  );
}

/* ══════════ BGM ══════════ */
function BGMPlayer({audioEl}){
  const [p,setP]=useState(true);
  const [v,setV]=useState(0.35);
  useEffect(()=>{if(!audioEl)return;audioEl.volume=v;if(p)audioEl.play().catch(()=>{});else audioEl.pause()},[p,v,audioEl]);
  if(!audioEl)return null;
  return(
    <div className="bgm-player" style={{position:"fixed",bottom:"clamp(12px,2vw,20px)",right:"clamp(12px,2vw,20px)",zIndex:900,display:"flex",alignItems:"center",gap:"8px",padding:"8px clamp(10px,1.5vw,14px)",background:"rgba(13,10,7,0.88)",backdropFilter:"blur(12px)",border:"1px solid var(--brd)"}}>
      <button onClick={()=>setP(!p)} style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:"14px",padding:"2px"}}>{p?"⏸":"▶"}</button>
      <input type="range" min="0" max="1" step="0.05" value={v} onChange={e=>setV(+e.target.value)} style={{width:"52px",accentColor:"var(--gold)",cursor:"pointer",opacity:0.7}}/>
      <span className="bgm-label" style={{fontSize:"10px",color:"var(--txd)",letterSpacing:"1px"}}>BGM</span>
    </div>
  );
}

/* ══════════ NAV ══════════ */
const SEC_LABELS=["인트로","등장인물","세계관","스토리","시스템","입장"];
function SectionNav({current,total,onGo}){
  return(
    <div className="sec-nav" style={{position:"fixed",right:"20px",top:"50%",transform:"translateY(-50%)",zIndex:800,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"14px"}}>
      {Array.from({length:total}).map((_,i)=>(
        <button key={i} onClick={()=>onGo(i)} style={{display:"flex",alignItems:"center",gap:"8px",background:"none",border:"none",cursor:"pointer",padding:0}}>
          <span style={{fontSize:"11px",letterSpacing:"1px",color:current===i?"var(--gold)":"transparent",fontFamily:"var(--fb)",transition:"color 0.3s",whiteSpace:"nowrap"}}>{SEC_LABELS[i]}</span>
          <div style={{width:current===i?"20px":"6px",height:"6px",background:current===i?"var(--gold)":"var(--goldd)",opacity:current===i?1:0.35,transition:"all 0.4s ease"}}/>
        </button>
      ))}
    </div>
  );
}

/* ══════════ STITLE ══════════ */
function STitle({sub,main}){
  return(
    <div style={{textAlign:"center",marginBottom:"clamp(24px,4vw,40px)"}}>
      <div style={{fontFamily:"var(--fd)",fontSize:"clamp(11px,1.5vw,13px)",letterSpacing:"6px",color:"var(--gold)",marginBottom:"12px",fontWeight:600}}>{sub}</div>
      <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(24px,5vw,44px)",fontWeight:700,lineHeight:1.3}}>{main}</h2>
      <div style={{width:"36px",height:"1px",margin:"18px auto 0",background:"linear-gradient(90deg,transparent,var(--gold),transparent)"}}/>
    </div>
  );
}

/* ══════════ SEC 1 — HERO (with story text) ══════════ */
function HeroSection(){
  const [slam,setSlam]=useState(false);
  const [after,setAfter]=useState(false);
  useEffect(()=>{setTimeout(()=>setSlam(true),100);setTimeout(()=>setAfter(true),700)},[]);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      <video autoPlay muted playsInline style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.15,filter:"blur(3px)",zIndex:0}}>
        <source src="dragon-breath.webm" type="video/webm"/>
      </video>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% 45%,rgba(212,165,74,0.04) 0%,transparent 70%)",zIndex:1}}/>
      {slam&&<div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(212,165,74,0.3),transparent 70%)",animation:"slamFlash 0.8s ease-out forwards",pointerEvents:"none",zIndex:5}}/>}

      {/* Scrollable content */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",alignItems:"center",position:"relative",zIndex:2}} className="inner-scroll">
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(80px,15vh,140px) clamp(16px,4vw,28px) 0",textAlign:"center",flexShrink:0}}>
          <div style={{width:"1px",height:"44px",background:"linear-gradient(180deg,transparent,var(--goldd))",marginBottom:"28px",opacity:after?1:0,transition:"opacity 0.8s ease"}}/>
          <div style={{animation:slam?"slam 0.6s cubic-bezier(0.16,1,0.3,1) forwards":"none",opacity:slam?undefined:0}}>
            <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(40px,10vw,90px)",fontWeight:900,letterSpacing:"clamp(4px,1vw,8px)",textShadow:after?"0 0 80px rgba(212,165,74,0.25), 0 2px 30px rgba(0,0,0,0.5)":"none",transition:"text-shadow 0.5s ease"}}>약탈신부</h1>
          </div>
          <div style={{width:"clamp(60px,20vw,120px)",height:"1px",margin:"16px auto 0",background:"linear-gradient(90deg,transparent,var(--gold),transparent)",animation:after?"lineExpand 0.8s ease forwards":"none",opacity:after?undefined:0,transformOrigin:"center"}}/>
        </div>

        {/* Story text */}
        <div style={{maxWidth:"600px",width:"100%",padding:"clamp(32px,5vh,48px) clamp(20px,5vw,40px) clamp(60px,10vw,100px)",opacity:after?1:0,transition:"opacity 1.2s ease 0.5s"}}>
          {STORY_LINES.map((line,i)=>{
            const isQ=line.startsWith('"');
            return(
              <p key={i} style={{
                fontFamily:"var(--fd)",
                fontSize:isQ?"clamp(15px,2vw,18px)":"clamp(13px,1.8vw,16px)",
                color:isQ?"var(--red)":"var(--tx2)",
                textShadow:isQ?"0 0 20px rgba(168,58,37,0.3)":"none",
                fontStyle:isQ?"normal":"italic",fontWeight:isQ?600:400,
                textAlign:"center",lineHeight:2.2,
                marginBottom:i<STORY_LINES.length-1?"4px":"0",
              }}>{line}</p>
            );
          })}
        </div>
      </div>

      <div style={{position:"absolute",bottom:"clamp(16px,3vw,28px)",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",animation:"float 3s ease-in-out infinite",opacity:after?1:0,transition:"opacity 0.8s ease 0.5s",zIndex:2}}>
        <span style={{fontSize:"clamp(9px,1.2vw,11px)",letterSpacing:"3px",color:"var(--txd)"}}>SCROLL</span>
        <div style={{width:"1px",height:"20px",background:"linear-gradient(180deg,var(--goldd),transparent)"}}/>
      </div>
    </div>
  );
}

/* ══════════ SEC — WORLD (세력 + 장소 합침) ══════════ */
function WorldSection(){
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px) 0",flexShrink:0}}><STitle sub="WORLD" main="세계관"/></div>
      <div style={{flex:1,overflowY:"auto",padding:"0 clamp(12px,3vw,16px) 44px",maxWidth:"960px",margin:"0 auto",width:"100%"}} className="inner-scroll">
        {/* Factions */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:"clamp(12px,2vw,16px)",marginBottom:"clamp(32px,5vw,48px)"}}>
          {FACTIONS.map((f,i)=>(
            <div key={i} style={{background:f.bg,border:`1px solid ${f.color}22`,padding:"clamp(16px,3vw,28px) clamp(14px,2.5vw,24px)",transition:"border-color 0.3s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=f.color+"55"}
            onMouseLeave={e=>e.currentTarget.style.borderColor=f.color+"22"}>
              <h3 style={{fontFamily:"var(--fd)",fontSize:"clamp(18px,3vw,22px)",fontWeight:700,color:f.color,marginBottom:"10px",letterSpacing:"2px"}}>{f.name}</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"12px"}}>
                {f.kw.map((k,j)=>(<span key={j} style={{padding:"2px 8px",border:`1px solid ${f.color}44`,fontSize:"clamp(10px,1.3vw,11px)",color:f.color,letterSpacing:"1px"}}>{k}</span>))}
              </div>
              <p style={{fontSize:"clamp(12px,1.4vw,13px)",lineHeight:1.8,fontWeight:300}}>{f.desc}</p>
            </div>
          ))}
        </div>
        {/* Locations */}
        <div style={{fontFamily:"var(--fd)",fontSize:"clamp(10px,1.3vw,12px)",letterSpacing:"4px",color:"var(--goldd)",textAlign:"center",marginBottom:"16px",fontWeight:600}}>LOCATIONS</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(200px,100%),1fr))",gap:"12px"}}>
          {LOCATIONS.map((l,i)=>(
            <div key={i} style={{background:"var(--bgc)",border:"1px solid var(--brd)",transition:"border-color 0.3s",overflow:"hidden"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--goldd)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(212,165,74,0.18)"}>
              <div style={{width:"100%",aspectRatio:"16/9",background:`linear-gradient(135deg,var(--bg2),${i%2===0?"rgba(212,165,74,0.05)":"rgba(139,45,26,0.05)"})`,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid var(--brd)"}}>
                <span style={{fontSize:"clamp(22px,4vw,28px)",opacity:0.4}}>{l.icon}</span>
              </div>
              <div style={{padding:"clamp(10px,2vw,14px) clamp(12px,2vw,16px)"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:"clamp(14px,2vw,16px)",fontWeight:700,marginBottom:"4px"}}>{l.name}</div>
                <p style={{fontSize:"clamp(11px,1.4vw,13px)",color:"var(--tx2)",lineHeight:1.6,fontWeight:300}}>{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ CHAR MODAL ══════════ */
function CharModal({char,onClose}){
  if(!char)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease",padding:"clamp(12px,3vw,20px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:"480px",maxHeight:"85vh",overflowY:"auto",background:"var(--bg2)",border:`1px solid ${char.color}33`,padding:"clamp(24px,4vw,36px) clamp(20px,3vw,32px)",position:"relative",animation:"fadeUp 0.4s ease"}} className="inner-scroll">
        <button onClick={onClose} style={{position:"absolute",top:"12px",right:"12px",background:"none",border:"none",color:"var(--tx2)",fontSize:"20px",cursor:"pointer",zIndex:10}}>✕</button>
        <div style={{width:"100%",aspectRatio:"1/1",maxHeight:"min(300px,50vw)",overflow:"hidden",border:"1px solid var(--brd)",marginBottom:"24px"}}>
          {char.modalImg?<img src={char.modalImg} alt={char.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
          char.img?<img src={char.img} alt={char.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:
          <div style={{width:"100%",height:"100%",background:`linear-gradient(170deg,${char.color}15,var(--bgc))`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"var(--fd)",fontSize:"42px",fontWeight:900,color:`${char.color}20`}}>{char.name[0]}</span>
          </div>}
        </div>
        <h3 style={{fontFamily:"var(--fd)",fontSize:"clamp(22px,4vw,26px)",fontWeight:700,marginBottom:"4px"}}>{char.name}</h3>
        <div style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",letterSpacing:"1px",marginBottom:"18px"}}>{char.title}</div>
        {char.appear&&<div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"16px"}}>{char.appear.map((a,i)=>(<span key={i} style={{padding:"3px 10px",background:"var(--bg)",fontSize:"clamp(10px,1.3vw,12px)",color:"var(--tx2)"}}>{a}</span>))}</div>}
        {char.personality&&<div style={{marginBottom:"10px"}}><span style={{fontSize:"12px",color:char.color,letterSpacing:"2px",fontWeight:600}}>성격</span><p style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",lineHeight:1.7,fontWeight:300,marginTop:"3px"}}>{char.personality}</p></div>}
        {char.speech&&<div style={{marginBottom:"14px"}}><span style={{fontSize:"12px",color:char.color,letterSpacing:"2px",fontWeight:600}}>말투</span><p style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",lineHeight:1.7,fontWeight:300,marginTop:"3px"}}>{char.speech}</p></div>}
        <div style={{padding:"14px",borderLeft:`2px solid ${char.color}33`,background:`${char.color}06`,marginBottom:"14px"}}>
          <p style={{fontSize:"clamp(13px,1.6vw,15px)",lineHeight:1.8,fontWeight:300,fontStyle:"italic"}}>{char.intro}</p>
        </div>
        {char.detail&&<p style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",lineHeight:1.8,fontWeight:300}}>{char.detail}</p>}
      </div>
    </div>
  );
}

/* ══════════ SEC — CHARACTERS (PC: hover flip, Mobile: tap flip, click: modal) ══════════ */
function CharacterSection({onOpenModal}){
  const [hvMain,setHvMain]=useState(-1);
  const [hvSub,setHvSub]=useState(-1);
  const [tapMain,setTapMain]=useState(-1);
  const [tapSub,setTapSub]=useState(-1);
  const isTouchRef=useRef(false);

  useEffect(()=>{
    const onTouch=()=>{isTouchRef.current=true};
    window.addEventListener("touchstart",onTouch,{once:true});
    return()=>window.removeEventListener("touchstart",onTouch);
  },[]);

  const handleMainClick=(i,c)=>{
    if(isTouchRef.current){
      if(tapMain===i){onOpenModal(c);setTapMain(-1);}
      else setTapMain(i);
    } else {
      onOpenModal(c);
    }
  };

  const handleSubClick=(i,c)=>{
    if(isTouchRef.current){
      if(tapSub===i){onOpenModal(c);setTapSub(-1);}
      else setTapSub(i);
    } else {
      onOpenModal(c);
    }
  };

  const isMainFlipped=(i)=>hvMain===i||tapMain===i;
  const isSubFlipped=(i)=>hvSub===i||tapSub===i;

  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px) 0",flexShrink:0}}>
        <STitle sub="CHARACTERS" main="등장인물"/>
        <p style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",textAlign:"center",marginTop:"-20px",marginBottom:"12px",fontWeight:300}}>카드를 터치하여 인물을 확인하세요</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 clamp(12px,3vw,16px) 40px",display:"flex",flexDirection:"column",alignItems:"center"}} className="inner-scroll">
        {/* Main */}
        <div style={{display:"flex",justifyContent:"center",gap:"clamp(8px,1.5vw,16px)",flexWrap:"wrap",maxWidth:"900px",marginBottom:"clamp(24px,4vw,32px)",paddingTop:"16px"}}>
          {MAIN_CHARS.map((c,i)=>(
            <div key={i}
              onClick={()=>handleMainClick(i,c)}
              onMouseEnter={()=>{if(!isTouchRef.current)setHvMain(i)}}
              onMouseLeave={()=>{if(!isTouchRef.current)setHvMain(-1)}}
              className="card-flip"
              style={{width:"clamp(100px,17vw,155px)",height:"clamp(150px,25.5vw,232px)",cursor:"pointer",transition:"transform 0.3s",transform:isMainFlipped(i)?"translateY(-8px)":"translateY(0)"}}>
              <div className={`card-flip-inner${isMainFlipped(i)?" flipped":""}`}>
                <div className="card-face card-front" style={{width:"100%",height:"100%",overflow:"hidden",border:"1px solid rgba(212,165,74,0.2)",boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
                  <img src="/images/tarot-back.webp" alt="tarot" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
                <div className="card-face card-back" style={{width:"100%",height:"100%",overflow:"hidden",border:`1px solid ${c.color}55`,boxShadow:`0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${c.color}15`}}>
                  <img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Sub */}
        <div style={{fontFamily:"var(--fd)",fontSize:"clamp(10px,1.3vw,12px)",letterSpacing:"4px",color:"var(--txd)",textAlign:"center",marginBottom:"16px",fontWeight:600}}>SUB CHARACTERS</div>
        <div style={{display:"flex",justifyContent:"center",gap:"clamp(6px,1.5vw,12px)",flexWrap:"wrap",maxWidth:"900px"}}>
          {SUB_CHARS.map((c,i)=>(
            <div key={i}
              onClick={()=>handleSubClick(i,c)}
              onMouseEnter={()=>{if(!isTouchRef.current)setHvSub(i)}}
              onMouseLeave={()=>{if(!isTouchRef.current)setHvSub(-1)}}
              className="card-flip"
              style={{width:"clamp(100px,17vw,155px)",height:"clamp(150px,25.5vw,232px)",cursor:"pointer",transition:"transform 0.3s",transform:isSubFlipped(i)?"translateY(-6px)":"translateY(0)"}}>
              <div className={`card-flip-inner${isSubFlipped(i)?" flipped":""}`}>
                <div className="card-face card-front" style={{width:"100%",height:"100%",overflow:"hidden",border:"1px solid var(--brd)"}}>
                  <img src="/images/tarot-back.webp" alt="tarot" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
                <div className="card-face card-back" style={{width:"100%",height:"100%",overflow:"hidden",border:"1px solid var(--brd)"}}>
                  <img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ SEC 5 — ROADMAP ══════════ */
function RoadmapSection(){
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px) 0",flexShrink:0}}><STitle sub="STORY" main="스토리 로드맵"/></div>
      <div style={{flex:1,overflowY:"auto",padding:"0 clamp(12px,3vw,16px) 44px",maxWidth:"620px",margin:"0 auto",width:"100%"}} className="inner-scroll">
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:"16px",top:0,bottom:0,width:"1px",background:"linear-gradient(180deg,var(--goldd),var(--brd),transparent)"}}/>
          {CHAPTERS.map((ch,i)=>(
            <div key={i} style={{display:"flex",gap:"clamp(16px,3vw,24px)",marginBottom:i<CHAPTERS.length-1?"clamp(24px,4vw,36px)":0,position:"relative"}}>
              <div style={{width:"32px",height:"32px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:2}}>
                <div style={{width:ch.branch?"12px":"8px",height:ch.branch?"12px":"8px",background:ch.branch?"var(--gold)":"var(--bgc)",border:`2px solid ${ch.branch?"var(--gold)":"var(--goldd)"}`,transform:"rotate(45deg)",boxShadow:ch.branch?"0 0 18px rgba(212,165,74,0.4)":"none"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
                  <span style={{fontFamily:"var(--fd)",fontSize:"clamp(10px,1.3vw,12px)",letterSpacing:"3px",color:"var(--goldd)",fontWeight:600}}>CH{ch.n}</span>
                  <span style={{fontFamily:"var(--fd)",fontSize:"clamp(16px,2.5vw,20px)",fontWeight:700}}>{ch.title}</span>
                </div>
                <div style={{fontSize:"clamp(10px,1.3vw,12px)",color:"var(--txd)",letterSpacing:"1px",marginBottom:"5px"}}>{ch.mood}</div>
                <p style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",lineHeight:1.7,fontWeight:300,fontStyle:"italic"}}>{ch.teaser}</p>
                {ch.branch&&<div style={{marginTop:"10px",padding:"clamp(8px,1.5vw,10px) clamp(10px,2vw,14px)",background:"rgba(212,165,74,0.06)",borderLeft:"2px solid var(--gold)",fontSize:"clamp(11px,1.4vw,13px)",color:"var(--gold)",fontWeight:400}}>이 챕터에서 특정 인물을 향한 선택이 이후 이야기를 결정합니다</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ SEC 6 — SYSTEM ══════════ */
function SystemSection(){
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px)"}}>
      <div style={{maxWidth:"680px",width:"100%"}}>
        <STitle sub="SYSTEM" main="시스템 가이드"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:"14px",marginBottom:"clamp(28px,5vw,44px)"}}>
          {[{l:"스토리 모드",d:"CH1~CH5 순차 진행. 챕터별 이벤트와 루트 분기를 따라간다.",ic:"📖"},{l:"자유 모드",d:"챕터 제약 없음. 프롤로그 이후 자유롭게 진행한다.",ic:"🌊"}].map((m,i)=>(
            <div key={i} style={{padding:"clamp(18px,3vw,24px)",background:"var(--bgc)",border:"1px solid var(--brd)"}}>
              <div style={{fontSize:"24px",marginBottom:"10px"}}>{m.ic}</div>
              <h3 style={{fontFamily:"var(--fd)",fontSize:"clamp(16px,2vw,19px)",fontWeight:700,marginBottom:"8px"}}>{m.l}</h3>
              <p style={{fontSize:"clamp(12px,1.5vw,14px)",color:"var(--tx2)",lineHeight:1.8,fontWeight:300}}>{m.d}</p>
            </div>
          ))}
        </div>
        <div style={{fontFamily:"var(--fd)",fontSize:"clamp(10px,1.3vw,12px)",letterSpacing:"4px",color:"var(--goldd)",textAlign:"center",marginBottom:"16px",fontWeight:600}}>COMMANDS</div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {[{c:"!요약",d:"지금까지의 이야기를 키워드 형식으로 정리하여 출력"},{c:"!챕터",d:"현재 챕터 진행도와 다음 챕터 조건을 점검 (스토리 모드 전용)"},{c:"!디버그",d:"이미지 출력 오류를 점검하고 수정·재출력"}].map((x,i)=>(
            <div key={i} style={{display:"flex",gap:"clamp(8px,2vw,14px)",alignItems:"baseline",padding:"12px clamp(12px,2vw,16px)",background:"var(--bgc)",border:"1px solid var(--brd)",flexWrap:"wrap"}}>
              <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(12px,1.5vw,14px)",color:"var(--gold)",fontWeight:600,background:"rgba(212,165,74,0.08)",padding:"3px 8px",flexShrink:0}}>{x.c}</code>
              <span style={{fontSize:"clamp(11px,1.4vw,13px)",color:"var(--tx2)",fontWeight:300,lineHeight:1.6}}>{x.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ SEC 7 — CTA ══════════ */
function CTASection(){
  const [hv,setHv]=useState(false);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",padding:"0 clamp(12px,3vw,16px)"}}>
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(450px,90vw)",height:"250px",background:"radial-gradient(ellipse at center bottom,rgba(212,165,74,0.05) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center"}}>
        <div style={{width:"1px",height:"40px",background:"linear-gradient(180deg,transparent,var(--goldd))",margin:"0 auto 28px"}}/>
        <div style={{fontFamily:"var(--fd)",fontSize:"clamp(22px,4vw,38px)",fontWeight:700,marginBottom:"clamp(28px,5vw,44px)"}}>이야기를 시작하세요</div>
        <button onMouseEnter={()=>setHv(true)} onMouseLeave={()=>setHv(false)} onClick={()=>alert("URL 추후 삽입")} style={{
          padding:"clamp(14px,2vw,18px) clamp(40px,8vw,64px)",
          background:hv?"rgba(212,165,74,0.1)":"transparent",
          border:"1px solid var(--gold)",color:"var(--gold)",
          fontFamily:"var(--fd)",fontSize:"clamp(15px,2vw,18px)",fontWeight:600,letterSpacing:"clamp(2px,0.5vw,4px)",
          cursor:"pointer",transition:"all 0.4s",boxShadow:hv?"0 0 40px rgba(212,165,74,0.12)":"none",
        }}>이야기에 입장하기</button>
        <p style={{fontSize:"clamp(9px,1.2vw,11px)",color:"var(--txd)",marginTop:"20px",letterSpacing:"1px"}}>URL 추후 연결 예정</p>
      </div>
      <div style={{position:"absolute",bottom:"20px",width:"100%",textAlign:"center",fontSize:"clamp(9px,1.2vw,11px)",color:"var(--txd)",letterSpacing:"1px"}}>원작 · 강희자매 《약탈 신부》</div>
    </div>
  );
}

/* ══════════ APP ══════════ */
const SECS=[HeroSection,CharacterSection,WorldSection,RoadmapSection,SystemSection,CTASection];
const SC=SECS.length;

export default function App(){
  const [showOp,setShowOp]=useState(true);
  const [entered,setEntered]=useState(false);
  const [audioEl,setAudioEl]=useState(null);
  const [cur,setCur]=useState(0);
  const [modal,setModal]=useState(null);
  const tr=useRef(false);

  const done=(a)=>{setAudioEl(a);setShowOp(false);setEntered(true)};
  const goTo=useCallback((i)=>{if(i<0||i>=SC||tr.current)return;tr.current=true;setCur(i);setTimeout(()=>{tr.current=false},850)},[]);

  useEffect(()=>{
    if(!entered)return;
    const onW=(e)=>{
      if(modal)return;
      const s=e.target.closest('.inner-scroll');
      if(s){const{scrollTop:t,scrollHeight:h,clientHeight:c}=s;if(e.deltaY>0&&t+c<h-2)return;if(e.deltaY<0&&t>2)return;}
      e.preventDefault();if(e.deltaY>0)goTo(cur+1);else if(e.deltaY<0)goTo(cur-1);
    };
    let ty=0;
    const tS=(e)=>{ty=e.touches[0].clientY};
    const tE=(e)=>{if(modal)return;const d=ty-e.changedTouches[0].clientY;if(Math.abs(d)>60){d>0?goTo(cur+1):goTo(cur-1)}};
    const kD=(e)=>{if(modal)return;if(e.key==="ArrowDown"||e.key===" "){e.preventDefault();goTo(cur+1)}if(e.key==="ArrowUp"){e.preventDefault();goTo(cur-1)}};
    window.addEventListener("wheel",onW,{passive:false});
    window.addEventListener("touchstart",tS,{passive:true});
    window.addEventListener("touchend",tE,{passive:true});
    window.addEventListener("keydown",kD);
    return()=>{window.removeEventListener("wheel",onW);window.removeEventListener("touchstart",tS);window.removeEventListener("touchend",tE);window.removeEventListener("keydown",kD)};
  },[entered,cur,goTo,modal]);

  return(
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:"var(--bg)",position:"relative"}}>
      {showOp&&<Opening onCinematicEnd={done}/>}
      {entered&&(
        <>
          <BGMPlayer audioEl={audioEl}/>
          <SectionNav current={cur} total={SC} onGo={goTo}/>
          <div style={{transform:`translateY(-${cur*100}vh)`,transition:"transform 0.8s cubic-bezier(0.65,0,0.35,1)",height:`${SC*100}vh`}}>
            {SECS.map((S,i)=>(
              <div key={i} style={{height:"100vh",width:"100vw"}}>
                {i===1?<S onOpenModal={setModal}/>:<S/>}
              </div>
            ))}
          </div>
          <CharModal char={modal} onClose={()=>setModal(null)}/>
        </>
      )}
    </div>
  );
}
