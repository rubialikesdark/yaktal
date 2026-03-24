import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════ Fonts ══════════ */
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;500;700&display=swap";
fl.rel = "stylesheet";
document.head.appendChild(fl);

/* ══════════ CSS ══════════ */
const css = document.createElement("style");
css.textContent = `
:root{
  --bg:#0D0A07;--bg2:#1A1410;--bgc:#13100B;--bgch:#1E1913;
  --gold:#D4A54A;--goldd:#A8873A;--red:#8B2D1A;
  --tx:#EDE6DA;--tx2:#B5A790;--txd:#8A7C66;
  --divine:#F5EDD8;--blue:#5A7D9E;--purple:#6E4D80;
  --brd:rgba(212,165,74,0.18);
  --fd:'Cormorant Garamond','Noto Serif KR',serif;
  --fb:'Noto Sans KR',sans-serif;
}
*{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--bg);color:var(--tx);font-family:var(--fb);overflow:hidden;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--goldd);border-radius:2px;}
.inner-scroll{scrollbar-width:thin;scrollbar-color:var(--goldd) transparent;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ember{0%{opacity:0;transform:translateY(0) scale(.5)}15%{opacity:.8}85%{opacity:.3}100%{opacity:0;transform:translateY(-100vh) scale(1)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(196,149,58,.08)}50%{box-shadow:0 0 45px rgba(196,149,58,.25)}}
@keyframes slam{0%{opacity:0;transform:scale(1.8);filter:blur(12px)}70%{opacity:1;transform:scale(0.97);filter:blur(0)}100%{opacity:1;transform:scale(1);filter:blur(0)}}
@keyframes slamFlash{0%{opacity:0}30%{opacity:.25}100%{opacity:0}}
@keyframes shockwave{0%{width:0;height:0;opacity:.5;border-width:2px}100%{width:800px;height:800px;opacity:0;border-width:1px}}
@keyframes lineExpand{0%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:1}}
`;
document.head.appendChild(css);

/* ══════════ DATA ══════════ */
const FACTIONS=[
  {name:"타야르 왕국",color:"var(--gold)",bg:"rgba(196,149,58,0.06)",kw:["용족","대왕 절대왕권","형사취수제","화산·온천","대리석·황금"],desc:"용의 후예가 통치하는 이교도의 땅. 화산의 열기와 황금의 광채가 뒤섞인 왕국. 대왕의 말은 곧 법이며, 용의 피가 모든 것을 결정한다."},
  {name:"브리온 왕국",color:"var(--blue)",bg:"rgba(74,107,138,0.06)",kw:["카메르교","달의 여신 셀리니","성검","치유·정화","우월주의"],desc:"달의 여신을 숭배하는 인간 왕국. 스스로를 문명의 중심이라 자부하며, 타야르를 야만족으로 멸시한다. 그 이면에는 폭정과 위선이 도사리고 있다."},
  {name:"쉬프터",color:"var(--purple)",bg:"rgba(90,58,106,0.06)",kw:["변신","사고 판독","외모 흡수","타야르 몰살"],desc:"눈으로 생각을 읽고, 심장을 찔러 외모와 영혼을 흡수하는 존재. 타야르를 몰살시키고 자신들의 왕국을 세우려 한다."},
];
const LOCATIONS=[
  {name:"왕궁",desc:"대리석과 황금으로 이루어진 왕의 거처",icon:"🏛"},
  {name:"왕의 노천탕",desc:"하칸 전용. 총애하는 여인에게만 허락되는 욕탕",icon:"♨"},
  {name:"탄생의 동굴",desc:"번영기의 잉태 성역. 역대 왕의 탄생지",icon:"🕳"},
  {name:"메잘륵",desc:"용족이 신성시하는 조상의 성역",icon:"⛩"},
  {name:"불의 계곡",desc:"용암과 새장형 감옥의 처형장",icon:"🌋"},
  {name:"푸카의 숲",desc:"땅콩을 바쳐야 통과할 수 있는 정령의 숲",icon:"🌲"},
  {name:"해츨링 요새",desc:"휴화산 동굴의 새끼 용 보호구역",icon:"🥚"},
  {name:"카슈닥 설산",desc:"신성력 무효화. 용족에게 치명적인 만년설",icon:"🏔"},
];
const MAIN_CHARS=[
  {name:"하칸",title:"타야르 대왕",route:true,appear:["흑요석 눈","장대한 체격","구릿빛","용 비늘 갑주"],personality:"냉철, 적에게 잔혹, 플레이어 한정 다정·소유욕, 책임감",speech:"명령조, 무뚝뚝, 플레이어 한정 애틋·열정, 직설",intro:"드래곤의 땅을 다스리는 젊은 대왕. 냉혹한 정복자의 얼굴 아래, 한 번도 꺼내본 적 없는 감정이 잠들어 있다.",detail:"형 라이칸이 대신 사망한 것에 대한 죄책감을 안고 있다. 형수 가레트와의 혼인을 거부하며 후계 압박을 받고 있다. 10년 전 용 형태의 자신을 치유해 준 소녀의 기억을 간직하고 있다.",color:"#D4A54A"},
  {name:"길라이",title:"귀족 · 학자",route:true,appear:["흑단 머리","호리호리","비단 가운"],personality:"계산적, 냉소, 지적",speech:"비아냥, 논리적",intro:"비단 가운 아래 날카로운 계산을 숨긴 학자. 냉소 뒤에 감춘 것이 경멸인지 다른 무언가인지는 가까이 가봐야 안다.",detail:"가레트의 동생. 흑주술 부작용으로 심장병을 앓고 있으며, 플레이어만이 그를 치유할 수 있다.",color:"#8FA07A"},
  {name:"안드레아",title:"브리온 성황",route:true,appear:["금발","푸른 눈","백색 제복"],personality:"신비, 희생, 통찰",speech:"우아한 말투",intro:"달의 여신을 대리하는 브리온의 성황. 우아한 미소 너머로, 무언가를 찾아 타야르까지 온 사람.",detail:"카메르교의 수장으로서 치유와 정화의 신성력을 지닌다. 타야르까지 찾아온 진짜 이유는 아직 밝혀지지 않았다.",color:"#5A7D9E"},
  {name:"가레트",title:"선왕비",route:false,appear:["눈부신 미모"],personality:"권력욕, 질투, 교활, 잔혹",speech:"비아냥, 명령조",intro:"왕궁에서 가장 아름답고 가장 위험한 여자. 왕비의 자리를 되찾기 위해서라면 무엇이든 한다.",detail:"하칸의 형수. 재혼 왕비를 노리며 플레이어를 제거하려 한다. 시녀 티티를 매수하여 공작을 꾸미기도 한다.",color:"#A83A25"},
  {name:"마리사",title:"드래곤슬레이어 수장",route:false,appear:["하얀 갑주","검은 화살"],personality:"잔혹, 교활, 집착",speech:"현혹하는 말투",intro:"낯익은 얼굴로 나타난 드래곤슬레이어의 수장. 그녀가 들고 온 검은 화살은 용족의 비늘을 관통하는 유일한 무기다.",detail:"환술과 흑주술을 다루며, 리에르바와 동일한 얼굴을 하고 있다. 그녀의 진짜 정체와 목적은 이야기 속에서 밝혀진다.",color:"#6E4D80"},
];
const SUB_CHARS=[
  {name:"투란",title:"군단장",appear:["흉포 외모"],personality:"충성, 다혈질",speech:"군대식, 농담 투덜",intro:"하칸의 가장 오래된 칼. 험상궂은 얼굴로 투덜대면서도 누구보다 먼저 전장에 선다.",detail:"하칸의 최측근 군단장. 거친 외모와 다혈질적 성격이지만, 하칸에 대한 충성심은 누구에게도 뒤지지 않는다.",color:"#D4A54A"},
  {name:"티티",title:"전속 시녀",appear:["곱슬머리","색실"],personality:"충직, 현실적",speech:"경어",intro:"타야르 왕궁에서의 첫 안내자. 낯선 땅의 규칙을 가장 현실적으로 알려주는 시녀.",detail:"원래 가레트 소속이었으나 플레이어의 시녀로 배정되었다. 타야르 왕궁의 정보를 알려주는 안내자 역할.",color:"#D4A54A"},
  {name:"푸카",title:"숲 정령",appear:["통통한 꼬마","박새 변신"],personality:"장난, 통찰",speech:"반말",intro:"브리온과 타야르 사이 숲에 사는 정령. 땅콩을 바치면 도와주고, 아니면 폭풍이 온다.",detail:"날씨를 조작할 수 있는 숲의 정령. 통통한 꼬마와 박새 변신을 오가며, 땅콩을 대가로 도움을 준다.",color:"#6DA06D"},
  {name:"아다르",title:"대왕비",appear:["쇠약한 모습","초점 없는 눈"],personality:"정신불안, 후회",speech:"유아퇴행 ↔ 회복 시 호통",intro:"왕궁 깊숙이 잊힌 대왕비. 흐려진 눈 속에 아직 꺼지지 않은 후회가 남아 있다.",detail:"하칸의 모이자 대왕비. 라이칸을 편애하고 하칸에게 무관심했던 것을 후회하고 있다.",color:"#B5A790"},
];
const CHAPTERS=[
  {n:1,title:"조우",mood:"이국적 긴장감 · 압도적 존재",teaser:"타야르에 발을 내딛는 순간, 모든 것이 바뀐다",branch:false},
  {n:2,title:"오해",mood:"신뢰 붕괴 · 진실을 향한 고통",teaser:"무너진 믿음 속에서 진짜 적을 찾아야 한다",branch:false},
  {n:3,title:"진실과 화해",mood:"비밀 폭로 · 재건",teaser:"감춰진 진실이 드러날 때, 선택의 순간이 온다",branch:true},
  {n:4,title:"정면 돌파",mood:"결전 · 새로운 시작",teaser:"마지막 전쟁. 그리고 그 너머의 이야기",branch:false},
  {n:5,title:"그 후",mood:"일상 · 자유",teaser:"폭풍이 지나간 자리에서 이야기는 계속된다",branch:false},
];
const OPENING_LINES=[
  "하늘을 뒤덮은 비룡들이 뿜어내는 붉은 화염 속에서",
  "병사들의 비명이 빗발쳤다.",
  "",
  "칠흑 같은 비늘을 펄럭이며",
  "대지를 집어삼킬 듯 포효하던 검은 용이,",
  "한 사내의 형상으로 뒤바뀌었다.",
  "",
  "\"감히 타야르의 메잘륵을 욕보인 자들.\"",
  "\"남김없이 죽여라.\"",
];

/* ══════════ PLACEHOLDER TITLE SVG ══════════ */
function TitleVisual(){
  return(
    <svg viewBox="0 0 600 140" style={{width:"min(520px,78vw)",height:"auto"}}>
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A54A"/>
          <stop offset="50%" stopColor="#E8D5A8"/>
          <stop offset="100%" stopColor="#A8873A"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>
      <text x="300" y="85" textAnchor="middle" fontFamily="'Noto Serif KR',serif" fontSize="86" fontWeight="900" fill="url(#tg)" filter="url(#glow)" letterSpacing="14">약탈신부</text>
      <text x="300" y="128" textAnchor="middle" fontFamily="'Noto Serif KR',serif" fontSize="16" fill="#B5A790" letterSpacing="6">약탈당한 신부로 살아남기</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   OPENING — Title + Enter → BGM + Cinematic → Main
   ══════════════════════════════════════════════════════ */
function Opening({onCinematicEnd}){
  const [phase,setPhase]=useState(0); // 0=loading,1=ready,2=cinematic
  const [titleShow,setTitleShow]=useState(false);
  const [btnShow,setBtnShow]=useState(false);
  const [curLine,setCurLine]=useState(-1);
  const [lineVis,setLineVis]=useState(false);
  const [cinematicDone,setCinematicDone]=useState(false);
  const [fadeOut,setFadeOut]=useState(false);
  const audioRef=useRef(null);

  useEffect(()=>{
    setTimeout(()=>setTitleShow(true),500);
    setTimeout(()=>{setBtnShow(true);setPhase(1)},1800);
  },[]);

  const handleEnter=()=>{
    if(phase!==1)return;
    setPhase(2);
    if(audioRef.current){audioRef.current.volume=0.35;audioRef.current.play().catch(()=>{});}
    setTimeout(()=>runCinematic(),800);
  };

  const runCinematic=()=>{
    let idx=0;
    const next=()=>{
      if(idx>=OPENING_LINES.length){
        setTimeout(()=>{setCinematicDone(true);setTimeout(()=>{setFadeOut(true);setTimeout(()=>onCinematicEnd(audioRef.current),800)},400)},400);
        return;
      }
      setCurLine(idx);
      if(OPENING_LINES[idx]===""){idx++;setTimeout(next,500);return;}
      setLineVis(true);
      setTimeout(()=>{setLineVis(false);setTimeout(()=>{idx++;next()},700)},2400);
    };
    next();
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:1000,background:"var(--bg)",overflow:"hidden",opacity:fadeOut?0:1,transition:"opacity 0.8s ease"}}>
      <audio ref={audioRef} loop src="bgm.mp3"/>

      {/* Embers */}
      {[...Array(16)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:`${1+Math.random()*3}px`,height:`${1+Math.random()*3}px`,borderRadius:"50%",background:i%3===0?"#D4A54A":"#8B2D1A",left:`${Math.random()*100}%`,bottom:"-5%",animation:`ember ${4+Math.random()*7}s linear infinite`,animationDelay:`${Math.random()*8}s`,opacity:0}}/>
      ))}

      {/* Title + Enter (phase 0-1) */}
      <div style={{
        position:"absolute",inset:0,zIndex:10,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        opacity:phase<2?1:0,
        transition:"opacity 0.8s ease",
        pointerEvents:phase>=2?"none":"auto",
      }}>
        <div style={{
          opacity:titleShow?1:0,
          transition:"opacity 1.2s ease",
        }}>
          {/* Replace TitleVisual with <img src="typo.png" style={{maxWidth:"520px",width:"78vw"}} /> */}
          <TitleVisual/>
        </div>
        {phase<=1&&(
          <button onClick={handleEnter} style={{
            marginTop:"52px",padding:"15px 60px",background:"transparent",
            border:"1px solid #D4A54A",color:"#D4A54A",
            fontFamily:"var(--fd)",fontSize:"16px",fontWeight:600,letterSpacing:"6px",
            cursor:"pointer",
            opacity:btnShow?1:0,transform:btnShow?"translateY(0)":"translateY(10px)",
            transition:"all 0.8s ease",
            animation:btnShow?"glowPulse 3s ease-in-out infinite":"none",
          }}
          onMouseEnter={e=>{e.target.style.background="rgba(196,149,58,0.1)"}}
          onMouseLeave={e=>{e.target.style.background="transparent"}}
          >입장</button>
        )}
      </div>

      {/* Cinematic text (phase 2) */}
      {phase>=2&&!cinematicDone&&(
        <div style={{position:"absolute",inset:0,zIndex:20,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 40px"}}>
          <p style={{
            fontFamily:"var(--fd)",
            fontSize:OPENING_LINES[curLine]?.startsWith('"')?"clamp(20px,3.2vw,28px)":"clamp(16px,2.5vw,20px)",
            color:OPENING_LINES[curLine]?.startsWith('"')?"#D4A54A":"var(--tx2)",
            fontStyle:OPENING_LINES[curLine]?.startsWith('"')?"normal":"italic",
            fontWeight:OPENING_LINES[curLine]?.startsWith('"')?600:400,
            textAlign:"center",lineHeight:1.8,
            opacity:lineVis?1:0,transform:lineVis?"translateY(0)":"translateY(10px)",
            transition:"opacity 0.9s ease, transform 0.9s ease",
          }}>
            {curLine>=0?OPENING_LINES[curLine]:""}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══════════ BGM PLAYER ══════════ */
function BGMPlayer({audioEl}){
  const [playing,setPlaying]=useState(true);
  const [vol,setVol]=useState(0.35);
  useEffect(()=>{if(!audioEl)return;audioEl.volume=vol;if(playing)audioEl.play().catch(()=>{});else audioEl.pause()},[playing,vol,audioEl]);
  if(!audioEl)return null;
  return(
    <div style={{position:"fixed",bottom:"20px",right:"20px",zIndex:900,display:"flex",alignItems:"center",gap:"8px",padding:"8px 14px",background:"rgba(13,10,7,0.88)",backdropFilter:"blur(12px)",border:"1px solid var(--brd)"}}>
      <button onClick={()=>setPlaying(!playing)} style={{background:"none",border:"none",color:"#D4A54A",cursor:"pointer",fontSize:"15px",padding:"2px"}}>{playing?"⏸":"▶"}</button>
      <input type="range" min="0" max="1" step="0.05" value={vol} onChange={e=>setVol(+e.target.value)} style={{width:"52px",accentColor:"#D4A54A",cursor:"pointer",opacity:0.7}}/>
      <span style={{fontSize:"10px",color:"var(--txd)",letterSpacing:"1px"}}>BGM</span>
    </div>
  );
}

/* ══════════ SECTION NAV ══════════ */
const SEC_LABELS=["인트로","세계관","등장인물","스토리","시스템","입장"];
function SectionNav({current,total,onGo}){
  return(
    <div style={{position:"fixed",right:"20px",top:"50%",transform:"translateY(-50%)",zIndex:800,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"16px"}}>
      {Array.from({length:total}).map((_,i)=>(
        <button key={i} onClick={()=>onGo(i)} style={{display:"flex",alignItems:"center",gap:"8px",background:"none",border:"none",cursor:"pointer",padding:0}}>
          <span style={{fontSize:"11px",letterSpacing:"1px",color:current===i?"#D4A54A":"transparent",fontFamily:"var(--fb)",transition:"color 0.3s",whiteSpace:"nowrap"}}>{SEC_LABELS[i]}</span>
          <div style={{width:current===i?"20px":"6px",height:"6px",background:current===i?"#D4A54A":"#A8873A",opacity:current===i?1:0.35,transition:"all 0.4s ease"}}/>
        </button>
      ))}
    </div>
  );
}

/* ══════════ SECTION TITLE ══════════ */
function STitle({sub,main}){
  return(
    <div style={{textAlign:"center",marginBottom:"40px"}}>
      <div style={{fontFamily:"var(--fd)",fontSize:"13px",letterSpacing:"6px",color:"#D4A54A",marginBottom:"12px",fontWeight:600}}>{sub}</div>
      <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(28px,5vw,44px)",fontWeight:700,lineHeight:1.3}}>{main}</h2>
      <div style={{width:"36px",height:"1px",margin:"18px auto 0",background:"linear-gradient(90deg,transparent,#D4A54A,transparent)"}}/>
    </div>
  );
}

/* ══════════ SEC 1 — HERO (slam title) ══════════ */
function HeroSection(){
  const [slam,setSlam]=useState(false);
  const [afterSlam,setAfterSlam]=useState(false);
  useEffect(()=>{
    // Tight timing — slam fires immediately on section mount
    const t1=setTimeout(()=>setSlam(true),100);
    const t2=setTimeout(()=>setAfterSlam(true),700);
    return()=>{clearTimeout(t1);clearTimeout(t2)};
  },[]);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% 45%,rgba(196,149,58,0.04) 0%,transparent 70%)"}}/>
      {/* GIF/Image BG placeholder */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:0.03,pointerEvents:"none"}}>
        <span style={{fontFamily:"var(--fd)",fontSize:"clamp(120px,25vw,280px)",fontWeight:900,color:"#D4A54A",userSelect:"none"}}>龍</span>
      </div>
      {[...Array(5)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:`${1.5+Math.random()*2}px`,height:`${1.5+Math.random()*2}px`,borderRadius:"50%",background:i%2===0?"#D4A54A":"#8B2D1A",opacity:0.1+Math.random()*0.12,left:`${20+Math.random()*60}%`,top:`${25+Math.random()*50}%`,animation:`float ${3+Math.random()*3}s ease-in-out infinite`,animationDelay:`${Math.random()*2}s`,filter:"blur(1px)"}}/>
      ))}

      {/* Screen flash on slam */}
      {slam&&(
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(196,149,58,0.3),transparent 70%)",animation:"slamFlash 0.8s ease-out forwards",pointerEvents:"none",zIndex:5}}/>
      )}

      {/* Shockwave ring */}
      {slam&&(
        <div style={{position:"absolute",top:"44%",left:"50%",transform:"translate(-50%,-50%)",width:0,height:0,borderRadius:"50%",border:"2px solid rgba(196,149,58,0.3)",animation:"shockwave 1s ease-out forwards",pointerEvents:"none",zIndex:4}}/>
      )}

      <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 28px"}}>
        {/* Decorative line */}
        <div style={{width:"1px",height:"44px",background:"linear-gradient(180deg,transparent,#A8873A)",margin:"0 auto 28px",opacity:afterSlam?1:0,transition:"opacity 0.8s ease"}}/>

        {/* SLAM TITLE */}
        <div style={{
          animation:slam?"slam 0.6s cubic-bezier(0.16,1,0.3,1) forwards":"none",
          opacity:slam?undefined:0,
        }}>
          {/* Replace with <img src="typo.png" style={{maxWidth:"520px",width:"78vw"}} /> */}
          <h1 style={{
            fontFamily:"var(--fd)",fontSize:"clamp(48px,11vw,90px)",fontWeight:900,letterSpacing:"8px",
            textShadow:afterSlam?"0 0 80px rgba(196,149,58,0.25), 0 2px 30px rgba(0,0,0,0.5)":"none",
            transition:"text-shadow 0.5s ease",
          }}>약탈신부</h1>
        </div>

        {/* Horizontal gold line that expands from center after slam */}
        <div style={{
          width:"120px",height:"1px",margin:"16px auto",
          background:"linear-gradient(90deg,transparent,#D4A54A,transparent)",
          animation:afterSlam?"lineExpand 0.8s ease forwards":"none",
          opacity:afterSlam?undefined:0,
          transformOrigin:"center",
        }}/>

        <p style={{
          fontFamily:"var(--fd)",fontSize:"clamp(14px,2vw,17px)",color:"var(--tx2)",letterSpacing:"4px",marginBottom:"40px",
          opacity:afterSlam?1:0,transform:afterSlam?"translateY(0)":"translateY(8px)",
          transition:"all 0.7s ease 0.1s",
        }}>약탈당한 신부로 살아남기</p>

        <div style={{
          maxWidth:"480px",margin:"0 auto",padding:"24px",borderLeft:"1px solid #A8873A",borderRight:"1px solid #A8873A",position:"relative",
          opacity:afterSlam?1:0,transform:afterSlam?"translateY(0)":"translateY(10px)",
          transition:"all 0.8s ease 0.2s",
        }}>
          {[0,1,2,3].map(ci=>(<div key={ci} style={{position:"absolute",width:"14px",height:"1px",background:"#A8873A",[ci<2?"top":"bottom"]:0,[ci%2===0?"left":"right"]:0}}/>))}
          <p style={{fontFamily:"var(--fd)",fontSize:"clamp(16px,2.2vw,20px)",fontStyle:"italic",color:"var(--divine)",lineHeight:1.9}}>프롤로그 대사 별도 삽입 예정</p>
        </div>
      </div>
      <div style={{position:"absolute",bottom:"28px",left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",animation:"float 3s ease-in-out infinite",opacity:afterSlam?1:0,transition:"opacity 0.8s ease 0.5s"}}>
        <span style={{fontSize:"11px",letterSpacing:"3px",color:"var(--txd)"}}>SCROLL</span>
        <div style={{width:"1px",height:"20px",background:"linear-gradient(180deg,#A8873A,transparent)"}}/>
      </div>
    </div>
  );
}

/* ══════════ SEC 2 — WORLD ══════════ */
function WorldSection(){
  const [af,setAf]=useState(0);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"44px 24px 0",flexShrink:0}}><STitle sub="WORLD" main="세계관"/></div>
      <div style={{flex:1,overflowY:"auto",padding:"0 24px 44px",maxWidth:"960px",margin:"0 auto",width:"100%"}} className="inner-scroll">
        <div style={{display:"flex",justifyContent:"center",gap:"8px",marginBottom:"24px",flexWrap:"wrap"}}>
          {FACTIONS.map((f,i)=>(<button key={i} onClick={()=>setAf(i)} style={{background:af===i?f.bg:"transparent",border:`1px solid ${af===i?f.color:"var(--brd)"}`,color:af===i?f.color:"var(--tx2)",padding:"9px 22px",fontFamily:"var(--fd)",fontSize:"14px",fontWeight:600,letterSpacing:"2px",cursor:"pointer",transition:"all 0.3s"}}>{f.name}</button>))}
        </div>
        <div style={{background:FACTIONS[af].bg,border:`1px solid ${FACTIONS[af].color}22`,padding:"32px",marginBottom:"44px",transition:"all 0.4s"}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"14px"}}>
            {FACTIONS[af].kw.map((k,i)=>(<span key={i} style={{padding:"3px 10px",border:`1px solid ${FACTIONS[af].color}44`,fontSize:"12px",color:FACTIONS[af].color,letterSpacing:"1px"}}>{k}</span>))}
          </div>
          <p style={{fontSize:"15px",lineHeight:1.9,fontWeight:300}}>{FACTIONS[af].desc}</p>
        </div>
        <div style={{fontFamily:"var(--fd)",fontSize:"12px",letterSpacing:"4px",color:"#A8873A",textAlign:"center",marginBottom:"20px",fontWeight:600}}>TAYAR LOCATIONS</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"12px"}}>
          {LOCATIONS.map((l,i)=>(
            <div key={i} style={{background:"var(--bgc)",border:"1px solid var(--brd)",transition:"border-color 0.3s",overflow:"hidden"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#A8873A"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(212,165,74,0.18)"}>
              <div style={{width:"100%",aspectRatio:"16/9",background:`linear-gradient(135deg,var(--bg2),${i%2===0?"rgba(196,149,58,0.05)":"rgba(139,45,26,0.05)"})`,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid var(--brd)"}}>
                <span style={{fontSize:"28px",opacity:0.4}}>{l.icon}</span>
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:"16px",fontWeight:700,marginBottom:"4px"}}>{l.name}</div>
                <p style={{fontSize:"13px",color:"var(--tx2)",lineHeight:1.6,fontWeight:300}}>{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ CHARACTER MODAL (at app root) ══════════ */
function CharModal({char,onClose}){
  if(!char)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.82)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:"480px",maxHeight:"85vh",overflowY:"auto",background:"var(--bg2)",border:`1px solid ${char.color}33`,padding:"36px 32px",position:"relative",animation:"fadeUp 0.4s ease"}} className="inner-scroll">
        <button onClick={onClose} style={{position:"absolute",top:"12px",right:"12px",background:"none",border:"none",color:"var(--tx2)",fontSize:"20px",cursor:"pointer",zIndex:10}}>✕</button>
        <div style={{width:"100%",aspectRatio:"3/4",maxHeight:"250px",background:`linear-gradient(170deg,${char.color}15,var(--bgc))`,border:"1px solid var(--brd)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"24px",position:"relative"}}>
          <span style={{fontFamily:"var(--fd)",fontSize:"42px",fontWeight:900,color:`${char.color}20`}}>{char.name[0]}</span>
          <span style={{position:"absolute",bottom:"8px",fontSize:"10px",color:"var(--txd)",letterSpacing:"1px"}}>IMAGE</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px",flexWrap:"wrap"}}>
          <h3 style={{fontFamily:"var(--fd)",fontSize:"26px",fontWeight:700}}>{char.name}</h3>
          {char.route&&<span style={{padding:"2px 10px",fontSize:"11px",fontWeight:600,border:`1px solid ${char.color}55`,color:char.color,letterSpacing:"1.5px"}}>공략 가능</span>}
        </div>
        <div style={{fontSize:"14px",color:"var(--tx2)",letterSpacing:"1px",marginBottom:"18px"}}>{char.title}</div>
        {char.appear&&<div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"16px"}}>{char.appear.map((a,i)=>(<span key={i} style={{padding:"3px 10px",background:"var(--bg)",fontSize:"12px",color:"var(--tx2)"}}>{a}</span>))}</div>}
        {char.personality&&<div style={{marginBottom:"10px"}}><span style={{fontSize:"12px",color:char.color,letterSpacing:"2px",fontWeight:600}}>성격</span><p style={{fontSize:"14px",color:"var(--tx2)",lineHeight:1.7,fontWeight:300,marginTop:"3px"}}>{char.personality}</p></div>}
        {char.speech&&<div style={{marginBottom:"14px"}}><span style={{fontSize:"12px",color:char.color,letterSpacing:"2px",fontWeight:600}}>말투</span><p style={{fontSize:"14px",color:"var(--tx2)",lineHeight:1.7,fontWeight:300,marginTop:"3px"}}>{char.speech}</p></div>}
        <div style={{padding:"14px",borderLeft:`2px solid ${char.color}33`,background:`${char.color}06`,marginBottom:"14px"}}>
          <p style={{fontSize:"15px",lineHeight:1.8,fontWeight:300,fontStyle:"italic"}}>{char.intro}</p>
        </div>
        {char.detail&&<p style={{fontSize:"14px",color:"var(--tx2)",lineHeight:1.8,fontWeight:300}}>{char.detail}</p>}
      </div>
    </div>
  );
}

/* ══════════ SEC 3 — CHARACTERS (horizontal row) ══════════ */
function CharacterSection({onOpenModal}){
  const [hv,setHv]=useState(-1);

  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"44px 24px 0",flexShrink:0}}>
        <STitle sub="CHARACTERS" main="등장인물"/>
        <p style={{fontSize:"14px",color:"var(--tx2)",textAlign:"center",marginTop:"-24px",marginBottom:"12px",fontWeight:300}}>카드를 선택하여 인물을 확인하세요</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"0 24px 40px",display:"flex",flexDirection:"column",alignItems:"center"}} className="inner-scroll">
        {/* Main characters — equal spaced row */}
        <div style={{display:"flex",justifyContent:"center",gap:"16px",flexWrap:"wrap",maxWidth:"900px",marginBottom:"32px",paddingTop:"20px"}}>
          {MAIN_CHARS.map((c,i)=>{
            const isH=hv===i;
            return(
              <div key={i}
                onClick={()=>onOpenModal(c)}
                onMouseEnter={()=>setHv(i)}
                onMouseLeave={()=>setHv(-1)}
                style={{
                  width:"155px",height:"232px",
                  cursor:"pointer",
                  transform:isH?"translateY(-10px)":"translateY(0)",
                  transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <div style={{
                  width:"100%",height:"100%",
                  background:`linear-gradient(165deg,${c.color}18 0%,var(--bgc) 35%,${c.color}0A 100%)`,
                  border:`1px solid ${isH?c.color+"99":c.color+"33"}`,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  padding:"14px",position:"relative",overflow:"hidden",
                  boxShadow:isH?`0 14px 44px rgba(0,0,0,0.7), 0 0 25px ${c.color}18`:`0 4px 16px rgba(0,0,0,0.3)`,
                  transition:"all 0.35s ease",
                }}>
                  {/* Corner marks */}
                  {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],ci)=>(
                    <div key={ci} style={{position:"absolute",[v]:"6px",[h]:"6px",width:"10px",height:"10px",
                      borderTop:v==="top"?`1px solid ${c.color}33`:"none",borderBottom:v==="bottom"?`1px solid ${c.color}33`:"none",
                      borderLeft:h==="left"?`1px solid ${c.color}33`:"none",borderRight:h==="right"?`1px solid ${c.color}33`:"none",
                    }}/>
                  ))}
                  {/* Diamond */}
                  <div style={{width:"30px",height:"30px",border:`1px solid ${c.color}55`,transform:"rotate(45deg)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"14px"}}>
                    <div style={{width:"12px",height:"12px",background:`${c.color}22`,border:`1px solid ${c.color}33`}}/>
                  </div>
                  <div style={{fontFamily:"var(--fd)",fontSize:"19px",fontWeight:700,letterSpacing:"2px"}}>{c.name}</div>
                  <div style={{fontSize:"12px",color:c.color,marginTop:"5px",letterSpacing:"1.5px",fontWeight:500,textAlign:"center"}}>{c.title}</div>
                  {c.route&&<div style={{marginTop:"10px",padding:"2px 8px",border:`1px solid ${c.color}33`,fontSize:"10px",color:c.color,letterSpacing:"1.5px"}}>공략 가능</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub chars */}
        <div style={{fontFamily:"var(--fd)",fontSize:"12px",letterSpacing:"4px",color:"var(--txd)",textAlign:"center",marginBottom:"16px",fontWeight:600}}>SUB CHARACTERS</div>
        <div style={{display:"flex",justifyContent:"center",gap:"12px",flexWrap:"wrap",maxWidth:"700px"}}>
          {SUB_CHARS.map((c,i)=>(
            <div key={i} onClick={()=>onOpenModal(c)} style={{width:"145px",background:"var(--bgc)",border:"1px solid var(--brd)",cursor:"pointer",transition:"all 0.3s",padding:"16px 14px",textAlign:"center"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#A8873A";e.currentTarget.style.background="var(--bgch)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(212,165,74,0.18)";e.currentTarget.style.background="var(--bgc)"}}
            >
              <div style={{width:"56px",height:"56px",margin:"0 auto 10px",background:"var(--bg)",border:"1px solid var(--brd)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:"var(--fd)",fontSize:"22px",fontWeight:700,color:"var(--txd)"}}>{c.name[0]}</span>
              </div>
              <div style={{fontFamily:"var(--fd)",fontSize:"15px",fontWeight:700,marginBottom:"2px"}}>{c.name}</div>
              <div style={{fontSize:"11px",color:"var(--tx2)",letterSpacing:"1px"}}>{c.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ SEC 4 — ROADMAP ══════════ */
function RoadmapSection(){
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"44px 24px 0",flexShrink:0}}><STitle sub="STORY" main="스토리 로드맵"/></div>
      <div style={{flex:1,overflowY:"auto",padding:"0 24px 44px",maxWidth:"620px",margin:"0 auto",width:"100%"}} className="inner-scroll">
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:"16px",top:0,bottom:0,width:"1px",background:"linear-gradient(180deg,#A8873A,var(--brd),transparent)"}}/>
          {CHAPTERS.map((ch,i)=>(
            <div key={i} style={{display:"flex",gap:"24px",marginBottom:i<CHAPTERS.length-1?"36px":0,position:"relative"}}>
              <div style={{width:"32px",height:"32px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:2}}>
                <div style={{width:ch.branch?"12px":"8px",height:ch.branch?"12px":"8px",background:ch.branch?"#D4A54A":"var(--bgc)",border:`2px solid ${ch.branch?"#D4A54A":"#A8873A"}`,transform:"rotate(45deg)",boxShadow:ch.branch?"0 0 18px rgba(212,165,74,0.4)":"none"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"8px",marginBottom:"4px",flexWrap:"wrap"}}>
                  <span style={{fontFamily:"var(--fd)",fontSize:"12px",letterSpacing:"3px",color:"#A8873A",fontWeight:600}}>CH{ch.n}</span>
                  <span style={{fontFamily:"var(--fd)",fontSize:"18px",fontWeight:700}}>{ch.title}</span>
                </div>
                <div style={{fontSize:"12px",color:"var(--txd)",letterSpacing:"1px",marginBottom:"5px"}}>{ch.mood}</div>
                <p style={{fontSize:"14px",color:"var(--tx2)",lineHeight:1.7,fontWeight:300,fontStyle:"italic"}}>{ch.teaser}</p>
                {ch.branch&&<div style={{marginTop:"10px",padding:"9px 14px",background:"rgba(212,165,74,0.06)",borderLeft:"2px solid #D4A54A",fontSize:"13px",color:"#D4A54A",fontWeight:400}}>이 챕터에서 특정 인물을 향한 선택이 이후 이야기를 결정합니다</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ SEC 5 — SYSTEM ══════════ */
function SystemSection(){
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"44px 24px"}}>
      <div style={{maxWidth:"680px",width:"100%"}}>
        <STitle sub="SYSTEM" main="시스템 가이드"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"14px",marginBottom:"44px"}}>
          {[{label:"스토리 모드",desc:"CH1~CH5 순차 진행. 챕터별 이벤트와 루트 분기를 따라간다.",icon:"📖"},{label:"자유 모드",desc:"챕터 제약 없음. 프롤로그 이후 자유롭게 진행한다.",icon:"🌊"}].map((m,i)=>(
            <div key={i} style={{padding:"24px",background:"var(--bgc)",border:"1px solid var(--brd)"}}>
              <div style={{fontSize:"24px",marginBottom:"10px"}}>{m.icon}</div>
              <h3 style={{fontFamily:"var(--fd)",fontSize:"19px",fontWeight:700,marginBottom:"8px"}}>{m.label}</h3>
              <p style={{fontSize:"14px",color:"var(--tx2)",lineHeight:1.8,fontWeight:300}}>{m.desc}</p>
            </div>
          ))}
        </div>
        <div style={{fontFamily:"var(--fd)",fontSize:"12px",letterSpacing:"4px",color:"#A8873A",textAlign:"center",marginBottom:"16px",fontWeight:600}}>COMMANDS</div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {[{cmd:"!요약",desc:"지금까지의 이야기를 키워드 형식으로 정리하여 출력"},{cmd:"!챕터",desc:"현재 챕터 진행도와 다음 챕터 조건을 점검 (스토리 모드 전용)"},{cmd:"!디버그",desc:"이미지 출력 오류를 점검하고 수정·재출력"}].map((c,i)=>(
            <div key={i} style={{display:"flex",gap:"14px",alignItems:"baseline",padding:"12px 16px",background:"var(--bgc)",border:"1px solid var(--brd)"}}>
              <code style={{fontFamily:"'JetBrains Mono',monospace",fontSize:"14px",color:"#D4A54A",fontWeight:600,background:"rgba(212,165,74,0.08)",padding:"3px 8px",flexShrink:0}}>{c.cmd}</code>
              <span style={{fontSize:"13px",color:"var(--tx2)",fontWeight:300,lineHeight:1.6}}>{c.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════ SEC 6 — CTA ══════════ */
function CTASection(){
  const [hv,setHv]=useState(false);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"450px",height:"250px",background:"radial-gradient(ellipse at center bottom,rgba(196,149,58,0.05) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 24px"}}>
        <div style={{width:"1px",height:"40px",background:"linear-gradient(180deg,transparent,#A8873A)",margin:"0 auto 28px"}}/>
        <div style={{fontFamily:"var(--fd)",fontSize:"clamp(26px,4vw,38px)",fontWeight:700,marginBottom:"10px"}}>이야기를 시작하세요</div>
        <p style={{fontSize:"14px",color:"var(--tx2)",fontWeight:300,fontStyle:"italic",maxWidth:"400px",margin:"0 auto 44px",lineHeight:1.8}}>프롤로그 대사 별도 삽입 예정</p>
        <button onMouseEnter={()=>setHv(true)} onMouseLeave={()=>setHv(false)} onClick={()=>alert("URL 추후 삽입")} style={{
          padding:"18px 64px",background:hv?"rgba(196,149,58,0.1)":"transparent",
          border:"1px solid #D4A54A",color:"#D4A54A",
          fontFamily:"var(--fd)",fontSize:"19px",fontWeight:600,letterSpacing:"4px",
          cursor:"pointer",transition:"all 0.4s",boxShadow:hv?"0 0 40px rgba(196,149,58,0.12)":"none",
        }}>이야기에 입장하기</button>
        <p style={{fontSize:"11px",color:"var(--txd)",marginTop:"20px",letterSpacing:"1px"}}>URL 추후 연결 예정</p>
      </div>
      <div style={{position:"absolute",bottom:"20px",width:"100%",textAlign:"center",fontSize:"11px",color:"var(--txd)",letterSpacing:"1px"}}>원작 · 강희자매 《약탈 신부》</div>
    </div>
  );
}

/* ══════════ APP ══════════ */
export default function App(){
  const [showOpening,setShowOpening]=useState(true);
  const [entered,setEntered]=useState(false);
  const [audioEl,setAudioEl]=useState(null);
  const [cur,setCur]=useState(0);
  const [modalChar,setModalChar]=useState(null);
  const trans=useRef(false);
  const SC=6;

  const done=(audio)=>{setAudioEl(audio);setShowOpening(false);setEntered(true)};
  const goTo=useCallback((idx)=>{
    if(idx<0||idx>=SC||trans.current)return;
    trans.current=true;setCur(idx);setTimeout(()=>{trans.current=false},850);
  },[]);

  useEffect(()=>{
    if(!entered)return;
    const onW=(e)=>{
      if(modalChar)return;
      const s=e.target.closest('.inner-scroll');
      if(s){const{scrollTop:t,scrollHeight:h,clientHeight:c}=s;if(e.deltaY>0&&t+c<h-2)return;if(e.deltaY<0&&t>2)return;}
      e.preventDefault();if(e.deltaY>0)goTo(cur+1);else if(e.deltaY<0)goTo(cur-1);
    };
    let ty=0;
    const tS=(e)=>{ty=e.touches[0].clientY};
    const tE=(e)=>{if(modalChar)return;const d=ty-e.changedTouches[0].clientY;if(Math.abs(d)>50){d>0?goTo(cur+1):goTo(cur-1)}};
    const kD=(e)=>{if(modalChar)return;if(e.key==="ArrowDown"||e.key===" "){e.preventDefault();goTo(cur+1)}if(e.key==="ArrowUp"){e.preventDefault();goTo(cur-1)}};
    window.addEventListener("wheel",onW,{passive:false});
    window.addEventListener("touchstart",tS,{passive:true});
    window.addEventListener("touchend",tE,{passive:true});
    window.addEventListener("keydown",kD);
    return()=>{window.removeEventListener("wheel",onW);window.removeEventListener("touchstart",tS);window.removeEventListener("touchend",tE);window.removeEventListener("keydown",kD)};
  },[entered,cur,goTo,modalChar]);

  return(
    <div style={{width:"100vw",height:"100vh",overflow:"hidden",background:"var(--bg)",position:"relative"}}>
      {showOpening&&<Opening onCinematicEnd={done}/>}
      {entered&&(
        <>
          <BGMPlayer audioEl={audioEl}/>
          <SectionNav current={cur} total={SC} onGo={goTo}/>
          <div style={{transform:`translateY(-${cur*100}vh)`,transition:"transform 0.8s cubic-bezier(0.65,0,0.35,1)",height:`${SC*100}vh`}}>
            <div style={{height:"100vh",width:"100vw"}}><HeroSection/></div>
            <div style={{height:"100vh",width:"100vw"}}><WorldSection/></div>
            <div style={{height:"100vh",width:"100vw"}}><CharacterSection onOpenModal={setModalChar}/></div>
            <div style={{height:"100vh",width:"100vw"}}><RoadmapSection/></div>
            <div style={{height:"100vh",width:"100vw"}}><SystemSection/></div>
            <div style={{height:"100vh",width:"100vw"}}><CTASection/></div>
          </div>
          <CharModal char={modalChar} onClose={()=>setModalChar(null)}/>
        </>
      )}
    </div>
  );
}
