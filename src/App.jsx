import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ══════════ Fonts ══════════ */
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Gowun+Batang:wght@400;700&family=Shippori+Mincho:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap";
fl.rel = "stylesheet";
document.head.appendChild(fl);

/* ══════════ CSS ══════════ */
const css = document.createElement("style");
css.textContent = `
:root {
  --bg:#0D0A07; --bg2:#1A1410; --bgc:#13100B;
  --gold:#D4A54A; --goldd:#A8873A; --red:#A83A25;
  --tx:#EDE6DA; --tx2:#B5A790; --txd:#8A7C66;
  --blue:#5A7D9E; --purple:#6E4D80;
  --brd:rgba(212,165,74,0.18);
  --fd:'Cinzel','Gowun Batang','Shippori Mincho',serif;
  --fb:'Noto Sans KR','Noto Sans JP',sans-serif;
}
* { margin:0; padding:0; box-sizing:border-box; }
html { --vh:100vh; --vh:100dvh; }
body { background:var(--bg); color:var(--tx); font-family:var(--fb); overflow:hidden; -webkit-font-smoothing:antialiased; height:var(--vh); }
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--goldd); border-radius:2px; }
.iscroll { scrollbar-width:thin; scrollbar-color:var(--goldd) transparent; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes ember { 0%{opacity:0;transform:translateY(0) scale(.5)} 15%{opacity:.8} 85%{opacity:.3} 100%{opacity:0;transform:translateY(-100vh) scale(1)} }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(212,165,74,.08)} 50%{box-shadow:0 0 45px rgba(212,165,74,.25)} }
@keyframes slam { 0%{opacity:0;transform:scale(1.8);filter:blur(12px)} 70%{opacity:1;transform:scale(.97);filter:blur(0)} 100%{opacity:1;transform:scale(1);filter:blur(0)} }
@keyframes slamFlash { 0%{opacity:0} 30%{opacity:.3} 100%{opacity:0} }
@keyframes lineExpand { 0%{transform:scaleX(0);opacity:0} 100%{transform:scaleX(1);opacity:1} }
@keyframes langFade { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
@media(max-width:768px) { .sec-nav{display:none!important;} .bgm-player span.bgm-label{display:none!important;} }
`;
document.head.appendChild(css);

/* ═══════════════════════════════════════════
   i18n — UI 텍스트
   ═══════════════════════════════════════════ */
const T = {
  ko: {
    enter:"이야기 속으로", skip:"클릭하여 건너뛰기", scroll:"아래로 스크롤",
    nav:["인트로","등장인물","세계관","스토리","시스템","입장"],
    charT:"등장인물", charS:"CHARACTERS", charTap:"카드를 뒤집어 인물을 확인하세요",
    worldT:"세계관", worldS:"WORLD", locL:"LOCATIONS",
    storyT:"스토리 로드맵", storyS:"STORY", branch:"이 챕터에서 특정 인물을 향한 선택이 이후 이야기를 결정합니다",
    sysT:"시스템 가이드", sysS:"SYSTEM", cmdL:"COMMANDS",
    sm:"스토리 모드", smd:"CH1~CH5 순차 진행. 챕터별 이벤트와 루트 분기를 따라간다.",
    fm:"자유 모드", fmd:"챕터 제약 없음. 프롤로그 이후 자유롭게 진행한다.",
    c1:"!요약", c1d:"지금까지의 이야기를 키워드 형식으로 정리하여 출력",
    c2:"!챕터", c2d:"현재 챕터 진행도와 다음 챕터 조건을 점검",
    c3:"!디버그", c3d:"이미지 출력 오류를 점검하고 수정·재출력",
    ctaT:"이야기를 시작하세요", ctaB:"이야기에 입장하기", ctaN:"URL 추후 연결 예정",
    credit:"원작 · 강희자매 《약탈 신부》",
    per:"성격", tone:"말투",
  },
  en: {
    enter:"Enter the Story", skip:"Click to skip", scroll:"Scroll Down",
    nav:["Intro","Characters","World","Story","System","Enter"],
    charT:"Characters", charS:"CHARACTERS", charTap:"Flip a card to reveal the character",
    worldT:"World", worldS:"WORLD", locL:"LOCATIONS",
    storyT:"Story Roadmap", storyS:"STORY", branch:"Your choices in this chapter will shape the rest of the story",
    sysT:"System Guide", sysS:"SYSTEM", cmdL:"COMMANDS",
    sm:"Story Mode", smd:"Progress through CH1–CH5 sequentially with branching events.",
    fm:"Free Mode", fmd:"No chapter restrictions. Explore freely after the prologue.",
    c1:"!summary", c1d:"Summarize the story so far in keyword format",
    c2:"!chapter", c2d:"Check current chapter progress and next chapter conditions",
    c3:"!debug", c3d:"Fix image output errors",
    ctaT:"Begin Your Story", ctaB:"Enter the Story", ctaN:"URL coming soon",
    credit:"Original work by 강희자매 «Abducted Bride»",
    per:"Personality", tone:"Tone",
  },
  ja: {
    enter:"物語の中へ", skip:"クリックでスキップ", scroll:"下にスクロール",
    nav:["イントロ","登場人物","世界観","ストーリー","システム","開始"],
    charT:"登場人物", charS:"CHARACTERS", charTap:"カードをめくって人物を確認してください",
    worldT:"世界観", worldS:"WORLD", locL:"LOCATIONS",
    storyT:"ストーリーロードマップ", storyS:"STORY", branch:"この章での選択がその後の物語を決定します",
    sysT:"システムガイド", sysS:"SYSTEM", cmdL:"COMMANDS",
    sm:"ストーリーモード", smd:"CH1〜CH5を順番に進行。チャプターごとにイベントとルート分岐。",
    fm:"フリーモード", fmd:"チャプター制限なし。プロローグ後、自由に進行。",
    c1:"!あらすじ", c1d:"これまでの物語をキーワード形式で整理して出力",
    c2:"!チャプター", c2d:"現在のチャプター進行度と次の条件を確認",
    c3:"!デバッグ", c3d:"画像表示エラーの修正",
    ctaT:"物語を始めましょう", ctaB:"物語に入場する", ctaN:"URLは後日追加予定です",
    credit:"原作 · 강희자매《略奪花嫁》",
    per:"性格", tone:"口調",
  },
};

/* ═══════════════════════════════════════════
   i18n — 시네마틱 오프닝
   ═══════════════════════════════════════════ */
const OP = {
  ko:[
    "하늘을 뒤덮은 비룡들이 뿜어내는 붉은 화염 속에서",
    "병사들의 비명이 빗발쳤다.",
    "",
    "칠흑 같은 날개를 펄럭이며",
    "대지를 집어삼킬 듯 포효하던 검은 용이,",
    "한 사내의 형상으로 뒤바뀌었다.",
    "",
    "\"감히 타야르의 메잘륵을 욕보인 자들.\"",
    "\"남김없이 죽여라.\"",
  ],
  en:[
    "Amid the crimson flames unleashed by the wyverns that blackened the sky,",
    "the soldiers' screams rang out endlessly.",
    "",
    "With wings dark as midnight,",
    "the black dragon roared as if to swallow the earth,",
    "then shifted into the shape of a man.",
    "",
    "\"Those who dared defile Tayar's Mejalluk.\"",
    "\"Kill them all.\"",
  ],
  ja:[
    "空を覆い尽くす飛竜が放つ紅蓮の炎の中で、",
    "兵士たちの悲鳴が響き渡った。",
    "",
    "漆黒の翼をはためかせ、",
    "大地を飲み込まんと咆哮していた黒竜が、",
    "一人の男の姿へと変わった。",
    "",
    "「タヤールのメジャルクを汚した者ども。」",
    "「一人残らず殺せ。」",
  ],
};

/* ═══════════════════════════════════════════
   i18n — 세력
   ═══════════════════════════════════════════ */
const FACTION_STYLES = [
  { color:"var(--gold)", bg:"rgba(212,165,74,0.06)" },
  { color:"var(--blue)", bg:"rgba(90,125,158,0.06)" },
  { color:"var(--purple)", bg:"rgba(110,77,128,0.06)" },
];
const FA = {
  ko:[
    { n:"타야르", kw:["용의 영역","절대왕권"], d:"용의 후예가 통치하는 이교도의 땅. 화산의 열기와 황금의 광채가 뒤섞인 왕국." },
    { n:"브리온", kw:["카메르교","이종배척"], d:"달의 여신을 숭배하는 인간 왕국. 타야르를 야만족으로 멸시한다." },
    { n:"쉬프터", kw:["변신","외모 흡수"], d:"심장을 찔러 외모와 영혼을 흡수하는 존재. 타야르를 몰살시키려 한다." },
  ],
  en:[
    { n:"Tayar", kw:["Dragon's Domain","Absolute Monarchy"], d:"A land of heretics ruled by the heirs of dragons. A kingdom where volcanic heat and golden brilliance intertwine." },
    { n:"Brion", kw:["Kamer Faith","Xenophobia"], d:"A human kingdom devoted to the Moon Goddess. They despise Tayar as savages." },
    { n:"Shifter", kw:["Shapeshifting","Appearance & Soul Absorption"], d:"Beings that pierce the heart to absorb appearance and soul. They seek to annihilate Tayar." },
  ],
  ja:[
    { n:"タヤール", kw:["竜の領域","絶対王権"], d:"竜の末裔が統治する異教の地。火山の熱気と黄金の輝きが入り混じる王国。" },
    { n:"ブリオン", kw:["カメル教","異種排斥"], d:"月の女神を崇拝する人間の王国。タヤールを野蛮族と蔑視する。" },
    { n:"シフター", kw:["変身","外見吸収"], d:"心臓を貫いて外見と魂を吸収する存在。タヤールを皆殺しにしようとしている。" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 장소
   ═══════════════════════════════════════════ */
const LO = {
  ko:[
    { n:"타야르 왕궁", d:"대리석과 황금으로 이루어진 왕의 거처", ic:"🏛", img:"/images/locations/palace.webp" },
    { n:"왕의 노천탕", d:"왕에게 선택받은 이들을 위한 장소", ic:"♨", img:"/images/locations/bath.webp" },
    { n:"탄생의 동굴", d:"번영기의 성역", ic:"🕳", img:"/images/locations/cave.webp" },
    { n:"메잘륵", d:"용족이 신성시하는 조상의 무덤", ic:"⛩", img:"/images/locations/mejalluk.webp" },
    { n:"불의 계곡", d:"죄인을 가두는 감옥", ic:"🌋", img:"/images/locations/fire-valley.webp" },
    { n:"푸카의 숲", d:"장난스러운 정령의 보금자리", ic:"🌲", img:"/images/locations/puka-forest.webp" },
  ],
  en:[
    { n:"Tayar Palace", d:"The king's residence of marble and gold", ic:"🏛", img:"/images/locations/palace.webp" },
    { n:"The King's Open-Air Bath", d:"A place reserved for those chosen by the king", ic:"♨", img:"/images/locations/bath.webp" },
    { n:"Cave of Birth", d:"A sanctuary of the age of prosperity", ic:"🕳", img:"/images/locations/cave.webp" },
    { n:"Mejalluk", d:"An ancestral tomb sacred to dragonkin", ic:"⛩", img:"/images/locations/mejalluk.webp" },
    { n:"Valley of Fire", d:"A prison for the condemned", ic:"🌋", img:"/images/locations/fire-valley.webp" },
    { n:"Puka's Forest", d:"A forest inhabited by mischievous spirits", ic:"🌲", img:"/images/locations/puka-forest.webp" },
  ],
  ja:[
    { n:"タヤール王宮", d:"大理石と黄金で造られた王の居所", ic:"🏛", img:"/images/locations/palace.webp" },
    { n:"王の露天風呂", d:"王に選ばれた者だけに許された場所", ic:"♨", img:"/images/locations/bath.webp" },
    { n:"誕生の洞窟", d:"繁栄期の聖域", ic:"🕳", img:"/images/locations/cave.webp" },
    { n:"メジャルク", d:"竜族が神聖視する祖先の墓", ic:"⛩", img:"/images/locations/mejalluk.webp" },
    { n:"火の谷", d:"罪人を閉じ込める牢獄", ic:"🌋", img:"/images/locations/fire-valley.webp" },
    { n:"プカの森", d:"いたずら好きな精霊のすみか", ic:"🌲", img:"/images/locations/puka-forest.webp" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 메인 캐릭터
   ═══════════════════════════════════════════ */
const MC = {
  ko:[
    { name:"하칸", title:"타야르 대왕", per:"냉철함, 잔혹함, 무뚝뚝함", tone:"명령조, 무뚝뚝", intro:"드래곤의 땅을 다스리는 젊은 대왕. 냉혹한 정복자의 얼굴 아래, 한 번도 꺼내본 적 없는 감정이 잠들어 있다.", color:"#D4A54A", img:"/images/chars/hakan.webp", modalImg:"/images/chars/modal/hakan.webp", tarot:"/images/tarot-back.webp" },
    { name:"길라이", title:"귀족", per:"계산적, 냉소, 지적", tone:"비아냥, 논리적", intro:"아름다운 얼굴 아래 날카로운 계산을 숨긴 귀족. 냉소 뒤에 감춘 것이 경멸인지 다른 무언가인지는 가까이 가봐야 안다.", color:"#8FA07A", img:"/images/chars/gilai.webp", modalImg:"/images/chars/modal/gilai.webp", tarot:"/images/tarot-back.webp" },
    { name:"안드레아", title:"브리온 성황", per:"온화, 통찰, 도덕적", tone:"우아한 말투", intro:"달의 여신을 대리하는 브리온의 성황. 우아한 미소 너머로, 무언가를 찾아 타야르까지 온 사람.", color:"#5A7D9E", img:"/images/chars/andrea.webp", modalImg:"/images/chars/modal/andrea.webp", tarot:"/images/tarot-back.webp" },
    { name:"가레트", title:"선왕비", per:"권력욕, 질투, 교활, 잔혹", tone:"비아냥, 명령조", intro:"왕궁에서 가장 아름답고 가장 위험한 여자. 왕비의 자리를 되찾기 위해서라면 무엇이든 한다.", color:"#A83A25", img:"/images/chars/garet.webp", modalImg:"/images/chars/modal/garet.webp", tarot:"/images/tarot-back.webp" },
    { name:"마리사", title:"쉬프터의 수장", per:"잔혹, 교활, 집착", tone:"현혹하는 말투", intro:"낯익은 얼굴로 나타난 쉬프터의 수장. 그녀가 들고 온 검은 화살은 용족의 비늘을 관통하는 유일한 무기다.", color:"#6E4D80", img:"/images/chars/marisa.webp", modalImg:"/images/chars/modal/marisa.webp", tarot:"/images/tarot-back.webp" },
  ],
  en:[
    { name:"Hakan", title:"Great King of Tayar", per:"Cold, cruel, blunt", tone:"Commanding, blunt", intro:"The young king who rules the land of dragons. Beneath the mask of a ruthless conqueror, an emotion he has never once drawn out lies dormant.", color:"#D4A54A", img:"/images/chars/hakan.webp", modalImg:"/images/chars/modal/hakan.webp", tarot:"/images/tarot-back.webp" },
    { name:"Gilai", title:"Noble", per:"Calculating, cynical, intellectual", tone:"Sardonic, analytical", intro:"A noble hiding sharp calculations beneath a beautiful face. Whether what lies behind his cynicism is contempt or something else — you'll only know by getting close.", color:"#8FA07A", img:"/images/chars/gilai.webp", modalImg:"/images/chars/modal/gilai.webp", tarot:"/images/tarot-back.webp" },
    { name:"Andrea", title:"Holy Emperor of Brion", per:"Gentle, insightful, righteous", tone:"Elegant, refined", intro:"The Holy Emperor who speaks for the Moon Goddess. Beyond his graceful smile, a man who came all the way to Tayar searching for something.", color:"#5A7D9E", img:"/images/chars/andrea.webp", modalImg:"/images/chars/modal/andrea.webp", tarot:"/images/tarot-back.webp" },
    { name:"Garet", title:"Former Queen", per:"Power-hungry, jealous, cunning, cruel", tone:"Sardonic, commanding", intro:"The most beautiful and most dangerous woman in the palace. She will do anything to reclaim the queen's throne.", color:"#A83A25", img:"/images/chars/garet.webp", modalImg:"/images/chars/modal/garet.webp", tarot:"/images/tarot-back.webp" },
    { name:"Marisa", title:"Leader of the Shifters", per:"Cruel, cunning, obsessive", tone:"Beguiling", intro:"The leader of the Shifters, appearing with a hauntingly familiar face. The black arrows she carries are the only weapon that can pierce dragonkin scales.", color:"#6E4D80", img:"/images/chars/marisa.webp", modalImg:"/images/chars/modal/marisa.webp", tarot:"/images/tarot-back.webp" },
  ],
  ja:[
    { name:"ハカン", title:"タヤール大王", per:"冷徹、残酷、無骨", tone:"命令口調、無骨", intro:"竜の地を治める若き大王。冷酷な征服者の顔の下に、一度も引き出したことのない感情が眠っている。", color:"#D4A54A", img:"/images/chars/hakan.webp", modalImg:"/images/chars/modal/hakan.webp", tarot:"/images/tarot-back.webp" },
    { name:"ギライ", title:"貴族", per:"計算的、冷笑的、知的", tone:"嫌味、論理的", intro:"美しい顔の下に鋭い計算を隠した貴族。冷笑の裏に隠しているのが軽蔑か、それとも別の何かか——近づいてみなければわからない。", color:"#8FA07A", img:"/images/chars/gilai.webp", modalImg:"/images/chars/modal/gilai.webp", tarot:"/images/tarot-back.webp" },
    { name:"アンドレア", title:"ブリオン聖皇", per:"温和、洞察力、道徳的", tone:"優雅で気品のある話し方", intro:"月の女神を代理するブリオンの聖皇。優雅な微笑みの向こうに、何かを探してタヤールまで訪れた人物。", color:"#5A7D9E", img:"/images/chars/andrea.webp", modalImg:"/images/chars/modal/andrea.webp", tarot:"/images/tarot-back.webp" },
    { name:"ガレット", title:"先王妃", per:"権力欲、嫉妬、狡猾、残酷", tone:"皮肉、命令口調", intro:"王宮で最も美しく、最も危険な女。王妃の座を取り戻すためなら何でもする。", color:"#A83A25", img:"/images/chars/garet.webp", modalImg:"/images/chars/modal/garet.webp", tarot:"/images/tarot-back.webp" },
    { name:"マリサ", title:"シフターの首長", per:"残酷、狡猾、執着", tone:"惑わす話し方", intro:"見覚えのある顔で現れたシフターの首長。彼女が携える黒い矢は、竜族の鱗を貫く唯一の武器だ。", color:"#6E4D80", img:"/images/chars/marisa.webp", modalImg:"/images/chars/modal/marisa.webp", tarot:"/images/tarot-back.webp" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 서브 캐릭터
   ═══════════════════════════════════════════ */
const SC_DATA = {
  ko:[
    { name:"투란", title:"군단장", per:"충성, 다혈질", intro:"하칸의 가장 믿음직한 칼. 험상궂은 얼굴로 투덜대면서도 누구보다 먼저 전장에 선다.", color:"#D4A54A", img:"/images/chars/turan.webp", modalImg:"/images/chars/modal/turan.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"티티", title:"전속 시녀", per:"충직, 현실적", intro:"타야르 왕궁에서의 첫 안내자. 낯선 땅의 규칙을 가장 현실적으로 알려주는 시녀.", color:"#D4A54A", img:"/images/chars/titi.webp", modalImg:"/images/chars/modal/titi.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"푸카", title:"숲 정령", per:"장난, 통찰", intro:"브리온과 타야르 사이 숲에 사는 정령. 땅콩을 바치면 도와주고, 아니면 폭풍이 온다.", color:"#6DA06D", img:"/images/chars/puka.webp", modalImg:"/images/chars/modal/puka.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"아다르", title:"대왕비", per:"정신불안, 후회", intro:"왕궁 깊숙이 잊힌 대왕비. 흐려진 눈 속에 아직 꺼지지 않은 후회가 남아 있다.", color:"#B5A790", img:"/images/chars/adar.webp", modalImg:"/images/chars/modal/adar.webp", tarot:"/images/tarot-back-sub.webp" },
  ],
  en:[
    { name:"Turan", title:"Commander", per:"Loyal, hot-blooded", intro:"Hakan's most trusted blade. He grumbles with a fierce face but is always the first to charge into battle.", color:"#D4A54A", img:"/images/chars/turan.webp", modalImg:"/images/chars/modal/turan.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"Titi", title:"Personal Maid", per:"Faithful, pragmatic", intro:"Your first guide in Tayar's palace. A maid who teaches you the rules of this foreign land with pragmatic honesty.", color:"#D4A54A", img:"/images/chars/titi.webp", modalImg:"/images/chars/modal/titi.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"Puka", title:"Forest Spirit", per:"Playful, insightful", intro:"A spirit dwelling in the forest between Brion and Tayar. Offer peanuts and it helps — refuse, and a storm follows.", color:"#6DA06D", img:"/images/chars/puka.webp", modalImg:"/images/chars/modal/puka.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"Adar", title:"Queen Mother", per:"Unstable, regretful", intro:"The forgotten queen deep within the palace. Behind her clouded eyes, a regret that has never faded still lingers.", color:"#B5A790", img:"/images/chars/adar.webp", modalImg:"/images/chars/modal/adar.webp", tarot:"/images/tarot-back-sub.webp" },
  ],
  ja:[
    { name:"トゥラン", title:"軍団長", per:"忠誠、多血質", intro:"ハカンの最も信頼する刃。険しい顔で文句を言いながらも、誰よりも先に戦場に立つ。", color:"#D4A54A", img:"/images/chars/turan.webp", modalImg:"/images/chars/modal/turan.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"ティティ", title:"専属侍女", per:"忠実、現実的", intro:"タヤール王宮での最初の案内人。異国の掟を最も現実的に教えてくれる侍女。", color:"#D4A54A", img:"/images/chars/titi.webp", modalImg:"/images/chars/modal/titi.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"プカ", title:"森の精霊", per:"悪戯、洞察", intro:"ブリオンとタヤールの間の森に住む精霊。ピーナッツを捧げれば助けてくれるが、さもなくば嵐が来る。", color:"#6DA06D", img:"/images/chars/puka.webp", modalImg:"/images/chars/modal/puka.webp", tarot:"/images/tarot-back-sub.webp" },
    { name:"アダル", title:"大王妃", per:"精神不安、後悔", intro:"王宮の奥深くに忘れ去られた大王妃。霞んだ瞳の中に、まだ消えない後悔が残っている。", color:"#B5A790", img:"/images/chars/adar.webp", modalImg:"/images/chars/modal/adar.webp", tarot:"/images/tarot-back-sub.webp" },
  ],
};

/* ═══════════════════════════════════════════
   i18n — 챕터
   ═══════════════════════════════════════════ */
const CH = {
  ko:[
    { n:1, t:"조우", m:"이국적 긴장감", z:"타야르에 발을 내딛는 순간, 모든 것이 바뀐다" },
    { n:2, t:"오해", m:"신뢰 붕괴", z:"무너진 믿음 속에서 진짜 적을 찾아야 한다" },
    { n:3, t:"진실", m:"비밀 폭로 · 재건", z:"감춰진 진실이 드러날 때, 선택의 순간이 온다", branch:true },
    { n:4, t:"돌파", m:"결전", z:"마지막 전쟁. 그리고 그 너머의 이야기" },
    { n:5, t:"엔딩", m:"대단원", z:"모든 폭풍이 지나간 자리, 이야기의 끝과 시작" },
  ],
  en:[
    { n:1, t:"Encounter", m:"Exotic tension", z:"The moment you set foot in Tayar, everything changes" },
    { n:2, t:"Misunderstanding", m:"Broken trust", z:"In the ruins of faith, you must find the real enemy" },
    { n:3, t:"Truth", m:"Secrets revealed", z:"When the hidden truth emerges, the moment of choice arrives", branch:true },
    { n:4, t:"Breakthrough", m:"Final battle", z:"The last war — and the story beyond it" },
    { n:5, t:"Ending", m:"The Grand Finale", z:"Where every storm has passed — an ending, and a beginning" },
  ],
  ja:[
    { n:1, t:"邂逅", m:"異国の緊張感", z:"タヤールに足を踏み入れた瞬間、すべてが変わる" },
    { n:2, t:"誤解", m:"信頼崩壊", z:"崩れた信頼の中で、本当の敵を見つけなければならない" },
    { n:3, t:"真実", m:"秘密暴露・再建", z:"隠された真実が明かされる時、選択の瞬間が訪れる", branch:true },
    { n:4, t:"突破", m:"決戦", z:"最後の戦争。そしてその先の物語" },
    { n:5, t:"エンディング", m:"大団円", z:"すべての嵐が過ぎ去った場所で——終わり、そして始まり" },
  ],
};

/* ═══════════════════════════════════════════
   Context & Hooks
   ═══════════════════════════════════════════ */
const LangCtx = createContext("ko");
const useLang = () => useContext(LangCtx);
const useT = () => { const l = useLang(); return T[l]; };

/* ═══════════════════════════════════════════
   공통 컴포넌트
   ═══════════════════════════════════════════ */

/* 타이틀 SVG */
function TitleSVG() {
  const l = useLang();
  const titles = { ko:"약탈신부", en:"Abducted Bride", ja:"略奪花嫁" };
  const sizes = { ko:72, en:48, ja:64 };
  const spacing = { ko:10, en:6, ja:8 };
  const fonts = { ko:"'Gowun Batang',serif", en:"'Cinzel',serif", ja:"'Shippori Mincho',serif" };
  return (
    <svg viewBox="0 0 600 100" style={{ width:"min(540px,80vw)", height:"auto" }}>
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A54A"/>
          <stop offset="50%" stopColor="#F0DCA0"/>
          <stop offset="100%" stopColor="#A8873A"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
      </defs>
      <text x="300" y="75" textAnchor="middle" fontFamily={fonts[l]} fontSize={sizes[l]} fontWeight="900" fill="url(#tg)" filter="url(#glow)" letterSpacing={spacing[l]}>
        {titles[l]}
      </text>
    </svg>
  );
}

/* 불씨 파티클 */
function Embers({ count = 10 }) {
  return <>{[...Array(count)].map((_, i) => (
    <div key={i} style={{
      position:"absolute",
      width:`${1 + Math.random() * 3}px`,
      height:`${1 + Math.random() * 3}px`,
      borderRadius:"50%",
      background: i % 3 === 0 ? "var(--gold)" : "#8B2D1A",
      left:`${Math.random() * 100}%`,
      bottom:"-5%",
      animation:`ember ${4 + Math.random() * 7}s linear infinite`,
      animationDelay:`${Math.random() * 8}s`,
      opacity:0,
      zIndex:1,
    }}/>
  ))}</>;
}

/* 섹션 타이틀 */
function STitle({ sub, main }) {
  return (
    <div style={{ textAlign:"center", marginBottom:"clamp(24px,4vw,40px)" }}>
      <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(11px,1.5vw,13px)", letterSpacing:"6px", color:"var(--gold)", marginBottom:"12px", fontWeight:600 }}>{sub}</div>
      <h2 style={{ fontFamily:"var(--fd)", fontSize:"clamp(24px,5vw,44px)", fontWeight:700, lineHeight:1.3 }}>{main}</h2>
      <div style={{ width:"36px", height:"1px", margin:"18px auto 0", background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════
   언어 선택 화면
   ═══════════════════════════════════════════ */
function LangSelect({ onPick }) {
  const [show, setShow] = useState(false);
  const [hv, setHv] = useState(-1);
  useEffect(() => { setTimeout(() => setShow(true), 300); }, []);
  const items = [
    { c:"ko", label:"한국어" },
    { c:"en", label:"ENGLISH" },
    { c:"ja", label:"日本語" },
  ];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, background:"var(--bg)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", opacity:show?1:0, transition:"opacity 0.8s ease" }}>
      <Embers count={8}/>
      <div style={{ width:"1px", height:"50px", background:"linear-gradient(180deg,transparent,var(--goldd))", marginBottom:"28px" }}/>
      <TitleSVG/>
      <div style={{ width:"clamp(40px,12vw,80px)", height:"1px", margin:"20px auto 28px", background:"linear-gradient(90deg,transparent,var(--gold),transparent)" }}/>
      <p style={{ fontFamily:"var(--fd)", fontSize:"clamp(10px,1.3vw,12px)", color:"var(--goldd)", marginBottom:"clamp(20px,4vw,32px)", fontWeight:600, letterSpacing:"5px" }}>SELECT LANGUAGE</p>
      <div style={{ display:"flex", gap:"clamp(8px,2vw,16px)", animation:show ? "langFade 0.6s ease 0.4s both" : "none" }}>
        {items.map((x, i) => (
          <button key={x.c} onClick={() => onPick(x.c)}
            onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(-1)}
            style={{
              padding:"clamp(10px,1.8vw,14px) clamp(18px,3vw,28px)",
              background: hv === i ? "rgba(212,165,74,0.06)" : "transparent",
              border: hv === i ? "1px solid var(--gold)" : "1px solid var(--brd)",
              cursor:"pointer", transition:"all 0.4s",
              color: hv === i ? "var(--gold)" : "var(--tx2)",
            }}>
            <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(14px,2vw,18px)", fontWeight:600, letterSpacing:"2px", textTransform:"uppercase" }}>{x.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   오프닝 시네마틱
   ═══════════════════════════════════════════ */
function Opening({ onEnd }) {
  const t = useT(), l = useLang(), lines = OP[l];
  const [phase, setPhase] = useState(0);
  const [titleShow, setTitleShow] = useState(false);
  const [btnShow, setBtnShow] = useState(false);
  const [curLine, setCurLine] = useState(-1);
  const [lineVis, setLineVis] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = useRef(null);
  const skipRef = useRef(false);

  useEffect(() => {
    setTimeout(() => setTitleShow(true), 500);
    setTimeout(() => { setBtnShow(true); setPhase(1); }, 1800);
  }, []);

  const finish = useCallback(() => {
    if (skipRef.current) return;
    skipRef.current = true;
    setFadeOut(true);
    setTimeout(() => onEnd(audioRef.current), 800);
  }, [onEnd]);

  const enter = () => {
    if (phase !== 1) return;
    setPhase(2);
    if (audioRef.current) { audioRef.current.volume = 0.35; audioRef.current.play().catch(() => {}); }
    setTimeout(() => run(), 800);
  };
  const skip = () => { if (phase === 2 && !skipRef.current) finish(); };
  const isQ = s => s && (s[0] === '"' || s[0] === '\u201C' || s[0] === '「');

  const run = () => {
    let i = 0;
    const go = () => {
      if (skipRef.current) return;
      if (i >= lines.length) { setTimeout(finish, 400); return; }
      setCurLine(i);
      if (lines[i] === "") { i++; setTimeout(go, 500); return; }
      setLineVis(true);
      setTimeout(() => { setLineVis(false); setTimeout(() => { i++; go(); }, 700); }, 2400);
    };
    go();
  };

  return (
    <div onClick={skip} style={{ position:"fixed", inset:0, zIndex:1000, background:"var(--bg)", overflow:"hidden", opacity:fadeOut?0:1, transition:"opacity 0.8s ease", cursor:phase===2?"pointer":"default" }}>
      <audio ref={audioRef} loop src="bgm.mp3"/>
      {phase >= 2 && (
        <video autoPlay muted playsInline onEnded={e => { e.target.style.opacity = "0"; }}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.35, filter:"blur(2px)", zIndex:0, transition:"opacity 2s ease" }}>
          <source src="dragon-flight.webm" type="video/webm"/>
        </video>
      )}
      <Embers count={12}/>
      <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", opacity:phase<2?1:0, transition:"opacity 0.8s ease", pointerEvents:phase>=2?"none":"auto" }}>
        <div style={{ opacity:titleShow?1:0, transition:"opacity 1.2s ease" }}><TitleSVG/></div>
        {phase <= 1 && (
          <button onClick={e => { e.stopPropagation(); enter(); }} style={{
            marginTop:"clamp(32px,6vw,52px)", padding:"clamp(12px,2vw,15px) clamp(36px,8vw,60px)",
            background:"transparent", border:"1px solid var(--gold)", color:"var(--gold)",
            fontFamily:"var(--fd)", fontSize:"clamp(14px,2vw,16px)", fontWeight:600, letterSpacing:"clamp(3px,1vw,6px)",
            cursor:"pointer", opacity:btnShow?1:0, transform:btnShow?"translateY(0)":"translateY(10px)",
            transition:"all 0.8s ease", animation:btnShow?"glowPulse 3s ease-in-out infinite":"none",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(212,165,74,0.1)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}>
            {t.enter}
          </button>
        )}
      </div>
      {phase >= 2 && !fadeOut && (
        <div style={{ position:"absolute", inset:0, zIndex:20, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 clamp(20px,5vw,40px)", background:"rgba(13,10,7,0.65)" }}>
          <p style={{
            fontFamily:"var(--fd)",
            fontSize: isQ(lines[curLine]) ? "clamp(18px,3vw,28px)" : "clamp(14px,2.2vw,20px)",
            color: isQ(lines[curLine]) ? "var(--red)" : "var(--tx2)",
            textShadow: isQ(lines[curLine]) ? "0 0 30px rgba(168,58,37,0.6)" : "none",
            fontStyle: isQ(lines[curLine]) ? "normal" : "italic",
            fontWeight: isQ(lines[curLine]) ? 700 : 400,
            textAlign:"center", lineHeight:1.8,
            opacity:lineVis?1:0, transform:lineVis?"translateY(0)":"translateY(10px)",
            transition:"opacity 0.9s ease, transform 0.9s ease",
          }}>{curLine >= 0 ? lines[curLine] : ""}</p>
          <p style={{ position:"absolute", bottom:"clamp(20px,4vw,40px)", fontSize:"clamp(10px,1.5vw,12px)", color:"var(--txd)", letterSpacing:"2px" }}>{t.skip}</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BGM 플레이어
   ═══════════════════════════════════════════ */
function BGMPlayer({ audioEl }) {
  const [p, setP] = useState(true);
  const [v, setV] = useState(0.35);
  useEffect(() => {
    if (!audioEl) return;
    audioEl.volume = v;
    if (p) audioEl.play().catch(() => {}); else audioEl.pause();
  }, [p, v, audioEl]);
  if (!audioEl) return null;
  return (
    <div className="bgm-player" style={{ position:"fixed", bottom:"clamp(12px,2vw,20px)", right:"clamp(12px,2vw,20px)", zIndex:900, display:"flex", alignItems:"center", gap:"8px", padding:"8px clamp(10px,1.5vw,14px)", background:"rgba(13,10,7,0.88)", backdropFilter:"blur(12px)", border:"1px solid var(--brd)" }}>
      <button onClick={() => setP(!p)} style={{ background:"none", border:"none", color:"var(--gold)", cursor:"pointer", fontSize:"14px", padding:"2px" }}>{p ? "⏸" : "▶"}</button>
      <input type="range" min="0" max="1" step="0.05" value={v} onChange={e => setV(+e.target.value)} style={{ width:"52px", accentColor:"var(--gold)", cursor:"pointer", opacity:0.7 }}/>
      <span className="bgm-label" style={{ fontSize:"10px", color:"var(--txd)", letterSpacing:"1px" }}>BGM</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   섹션 네비게이션
   ═══════════════════════════════════════════ */
function Nav({ cur, total, onGo }) {
  const t = useT();
  return (
    <div className="sec-nav" style={{ position:"fixed", right:"20px", top:"50%", transform:"translateY(-50%)", zIndex:800, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"14px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onGo(i)} style={{ display:"flex", alignItems:"center", gap:"8px", background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <span style={{ fontSize:"11px", letterSpacing:"1px", color:cur===i?"var(--gold)":"transparent", fontFamily:"var(--fb)", transition:"color 0.3s", whiteSpace:"nowrap" }}>{t.nav[i]}</span>
          <div style={{ width:cur===i?"20px":"6px", height:"6px", background:cur===i?"var(--gold)":"var(--goldd)", opacity:cur===i?1:0.35, transition:"all 0.4s ease" }}/>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 1 — 히어로 (인트로)
   ═══════════════════════════════════════════ */
function Hero() {
  const t = useT(), l = useLang();
  const lines = (OP[l] || OP.ko).filter(x => x !== "");
  const [slam, setSlam] = useState(false);
  const [after, setAfter] = useState(false);
  useEffect(() => { setTimeout(() => setSlam(true), 100); setTimeout(() => setAfter(true), 700); }, []);
  const isQ = s => s && (s[0] === '"' || s[0] === '\u201C' || s[0] === '「');
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      <video autoPlay muted playsInline style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.15, filter:"blur(3px)", zIndex:0 }}>
        <source src="dragon-breath.webm" type="video/webm"/>
      </video>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 50% at 50% 45%,rgba(212,165,74,0.04) 0%,transparent 70%)", zIndex:1 }}/>
      {slam && <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,rgba(212,165,74,0.3),transparent 70%)", animation:"slamFlash 0.8s ease-out forwards", pointerEvents:"none", zIndex:5 }}/>}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", flexShrink:0 }}>
          <div style={{ width:"1px", height:"44px", background:"linear-gradient(180deg,transparent,var(--goldd))", marginBottom:"28px", opacity:after?1:0, transition:"opacity 0.8s ease" }}/>
          <div style={{ animation:slam ? "slam 0.6s cubic-bezier(0.16,1,0.3,1) forwards" : "none", opacity:slam?undefined:0 }}><TitleSVG/></div>
          <div style={{ width:"clamp(60px,20vw,120px)", height:"1px", margin:"16px auto 0", background:"linear-gradient(90deg,transparent,var(--gold),transparent)", animation:after?"lineExpand 0.8s ease forwards":"none", opacity:after?undefined:0, transformOrigin:"center" }}/>
        </div>
        <div style={{ maxWidth:"600px", width:"100%", padding:"clamp(24px,4vh,36px) clamp(20px,5vw,40px) 0", opacity:after?1:0, transition:"opacity 1.2s ease 0.5s" }}>
          {lines.map((line, i) => {
            const q = isQ(line);
            return (
              <p key={i} style={{
                fontFamily:"var(--fd)",
                fontSize: q ? "clamp(15px,2vw,18px)" : "clamp(13px,1.8vw,16px)",
                color: q ? "var(--red)" : "var(--tx2)",
                textShadow: q ? "0 0 20px rgba(168,58,37,0.3)" : "none",
                fontStyle: q ? "normal" : "italic",
                fontWeight: q ? 600 : 400,
                textAlign:"center", lineHeight:2.2,
                marginBottom: i < lines.length - 1 ? "4px" : "0",
              }}>{line}</p>
            );
          })}
        </div>
      </div>
      <div style={{ position:"absolute", bottom:"clamp(20px,4vw,36px)", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", animation:"float 3s ease-in-out infinite", opacity:after?1:0, transition:"opacity 0.8s ease 0.5s", zIndex:2 }}>
        <span style={{ fontSize:"clamp(12px,1.8vw,15px)", letterSpacing:"4px", color:"var(--tx2)", fontFamily:"var(--fb)", fontWeight:400 }}>{t.scroll}</span>
        <div style={{ width:"1px", height:"24px", background:"linear-gradient(180deg,var(--goldd),transparent)" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 2 — 캐릭터
   ═══════════════════════════════════════════ */

/* 캐릭터 모달 */
function CharModal({ c, onClose }) {
  const t = useT();
  if (!c) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn 0.3s ease", padding:"clamp(12px,3vw,20px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxWidth:"480px", maxHeight:"85vh", overflowY:"auto", background:"var(--bg2)", border:`1px solid ${c.color}33`, padding:"clamp(24px,4vw,36px) clamp(20px,3vw,32px)", position:"relative", animation:"fadeUp 0.4s ease" }} className="iscroll">
        <button onClick={onClose} style={{ position:"absolute", top:"12px", right:"12px", background:"none", border:"none", color:"var(--tx2)", fontSize:"20px", cursor:"pointer", zIndex:10 }}>✕</button>
        <div style={{ width:"100%", aspectRatio:"1/1", maxHeight:"min(300px,50vw)", overflow:"hidden", border:"1px solid var(--brd)", marginBottom:"24px" }}>
          {c.modalImg
            ? <img src={c.modalImg} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            : <div style={{ width:"100%", height:"100%", background:`linear-gradient(170deg,${c.color}15,var(--bgc))`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"var(--fd)", fontSize:"42px", fontWeight:900, color:`${c.color}40` }}>{c.name[0]}</span>
              </div>
          }
        </div>
        <h3 style={{ fontFamily:"var(--fd)", fontSize:"clamp(22px,4vw,26px)", fontWeight:700, marginBottom:"4px" }}>{c.name}</h3>
        <div style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", letterSpacing:"1px", marginBottom:"18px" }}>{c.title}</div>
        {c.per && <div style={{ marginBottom:"10px" }}>
          <span style={{ fontSize:"12px", color:c.color, letterSpacing:"2px", fontWeight:600 }}>{t.per}</span>
          <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", lineHeight:1.7, fontWeight:300, marginTop:"3px" }}>{c.per}</p>
        </div>}
        {c.tone && <div style={{ marginBottom:"14px" }}>
          <span style={{ fontSize:"12px", color:c.color, letterSpacing:"2px", fontWeight:600 }}>{t.tone}</span>
          <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", lineHeight:1.7, fontWeight:300, marginTop:"3px" }}>{c.tone}</p>
        </div>}
        <div style={{ padding:"14px", borderLeft:`2px solid ${c.color}33`, background:`${c.color}06` }}>
          <p style={{ fontSize:"clamp(13px,1.6vw,15px)", lineHeight:1.8, fontWeight:300, fontStyle:"italic" }}>{c.intro}</p>
        </div>
      </div>
    </div>
  );
}

/* 캐릭터 섹션 */
function Chars({ onOpen }) {
  const t = useT(), l = useLang();
  const main = MC[l], sub = SC_DATA[l];
  const [flipped, setFlipped] = useState(new Set());
  const [hv, setHv] = useState(-1);

  const flip = (idx) => { setFlipped(prev => { const s = new Set(prev); s.add(idx); return s; }); };

  const card = (c, idx, w) => {
    const isFlipped = flipped.has(idx);
    return (
      <div key={idx}
        onClick={() => { if (!isFlipped) flip(idx); else onOpen(c); }}
        onMouseEnter={() => { if (!isFlipped) flip(idx); setHv(idx); }}
        onMouseLeave={() => setHv(-1)}
        style={{ width:w, cursor:"pointer", transition:"transform 0.3s", transform:hv===idx?"translateY(-8px)":"translateY(0)" }}>
        <div style={{ width:"100%", aspectRatio:"2/3", position:"relative", perspective:"800px" }}>
          <div style={{ width:"100%", height:"100%", transition:"transform 0.6s cubic-bezier(0.16,1,0.3,1)", transformStyle:"preserve-3d", transform:isFlipped?"rotateY(180deg)":"rotateY(0deg)" }}>
            {/* 카드 앞면 (타로 뒷면 이미지) */}
            <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", overflow:"hidden", border:"1px solid rgba(212,165,74,0.2)", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
              {c.tarot
                ? <img src={c.tarot} alt="tarot" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <div style={{ width:"100%", height:"100%", background:"linear-gradient(170deg,var(--bgc),rgba(212,165,74,0.03))", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(20px,4vw,32px)", fontWeight:900, color:"var(--goldd)", opacity:0.25 }}>?</span>
                  </div>
              }
            </div>
            {/* 카드 뒷면 (캐릭터 이미지) */}
            <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", transform:"rotateY(180deg)", overflow:"hidden", border:`1px solid ${hv===idx ? c.color+"88" : "var(--brd)"}`, transition:"border-color 0.3s", boxShadow:hv===idx ? `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${c.color}15` : "0 4px 16px rgba(0,0,0,0.3)" }}>
              {c.img
                ? <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <div style={{ width:"100%", height:"100%", background:`linear-gradient(170deg,${c.color}20,var(--bgc))`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(24px,5vw,36px)", fontWeight:900, color:`${c.color}50` }}>{c.name[0]}</span>
                  </div>
              }
            </div>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:"8px", opacity:isFlipped?1:0.4, transition:"opacity 0.4s" }}>
          <div style={{ fontFamily:"var(--fd)", fontSize:w.includes("90")?"clamp(12px,1.6vw,15px)":"clamp(11px,1.4vw,13px)", fontWeight:700, color:isFlipped?(hv===idx?c.color:"var(--tx)"):"var(--txd)" }}>{isFlipped ? c.name : "???"}</div>
          <div style={{ fontSize:w.includes("90")?"clamp(9px,1.1vw,11px)":"clamp(8px,1vw,10px)", color:"var(--tx2)" }}>{isFlipped ? c.title : ""}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"clamp(24px,4vw,44px) clamp(12px,3vw,16px) 0", flexShrink:0 }}>
        <STitle sub={t.charS} main={t.charT}/>
        <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", textAlign:"center", marginTop:"-20px", marginBottom:"clamp(8px,1.5vw,16px)", fontWeight:300 }}>{t.charTap}</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", alignItems:"center", padding:"clamp(8px,2vw,16px) clamp(12px,3vw,16px) 40px" }} className="iscroll">
        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(6px,1.2vw,12px)", flexWrap:"wrap", maxWidth:"1060px", marginBottom:"clamp(16px,3vw,24px)" }}>
          {main.map((c, i) => card(c, i, "clamp(90px,22vw,150px)"))}
        </div>
        <div style={{ width:"36px", height:"1px", background:"linear-gradient(90deg,transparent,var(--goldd),transparent)", marginBottom:"clamp(16px,3vw,24px)" }}/>
        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(6px,1.2vw,12px)", flexWrap:"wrap", maxWidth:"1060px" }}>
          {sub.map((c, i) => card(c, i + main.length, "clamp(80px,18vw,120px)"))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 3 — 세계관
   ═══════════════════════════════════════════ */
function World() {
  const t = useT(), l = useLang();
  const factions = FA[l], locations = LO[l];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px) 0", flexShrink:0 }}><STitle sub={t.worldS} main={t.worldT}/></div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 clamp(12px,3vw,16px) 44px", maxWidth:"960px", margin:"0 auto", width:"100%" }} className="iscroll">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))", gap:"clamp(8px,1.5vw,16px)", marginBottom:"clamp(24px,4vw,36px)" }}>
          {factions.map((f, i) => {
            const s = FACTION_STYLES[i];
            return (
              <div key={i} style={{ background:s.bg, border:`1px solid ${s.color}22`, padding:"clamp(12px,2vw,24px) clamp(10px,2vw,20px)", transition:"border-color 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = s.color + "55"}
                onMouseLeave={e => e.currentTarget.style.borderColor = s.color + "22"}>
                <h3 style={{ fontFamily:"var(--fd)", fontSize:"clamp(16px,2.5vw,22px)", fontWeight:700, color:s.color, marginBottom:"8px", letterSpacing:"2px" }}>{f.n}</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"10px" }}>
                  {f.kw.map((k, j) => <span key={j} style={{ padding:"2px 7px", border:`1px solid ${s.color}44`, fontSize:"clamp(9px,1.2vw,11px)", color:s.color, letterSpacing:"1px" }}>{k}</span>)}
                </div>
                <p style={{ fontSize:"clamp(11px,1.3vw,13px)", lineHeight:1.7, fontWeight:300 }}>{f.d}</p>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(10px,1.3vw,12px)", letterSpacing:"4px", color:"var(--goldd)", textAlign:"center", marginBottom:"16px", fontWeight:600 }}>{t.locL}</div>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"clamp(8px,1.5vw,12px)" }}>
          {locations.map((loc, i) => (
            <div key={i} style={{ flex:"0 0 clamp(140px, 28%, 200px)", background:"var(--bgc)", border:"1px solid var(--brd)", transition:"border-color 0.3s", overflow:"hidden" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--goldd)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,165,74,0.18)"}>
              <div style={{ width:"100%", aspectRatio:"16/10", overflow:"hidden", borderBottom:"1px solid var(--brd)", position:"relative" }}>
                {loc.img
                  ? <img src={loc.img} alt={loc.n} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,var(--bg2),${i%2===0?"rgba(212,165,74,0.05)":"rgba(139,45,26,0.05)"})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:"clamp(18px,3vw,28px)", opacity:0.4 }}>{loc.ic}</span>
                    </div>
                }
              </div>
              <div style={{ padding:"clamp(8px,1.5vw,14px) clamp(8px,1.5vw,16px)" }}>
                <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(13px,1.8vw,16px)", fontWeight:700, marginBottom:"2px" }}>{loc.n}</div>
                <p style={{ fontSize:"clamp(10px,1.2vw,13px)", color:"var(--tx2)", lineHeight:1.5, fontWeight:300 }}>{loc.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 4 — 스토리 로드맵
   ═══════════════════════════════════════════ */
function Roadmap() {
  const t = useT(), l = useLang(), chs = CH[l];
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px) 0", flexShrink:0 }}><STitle sub={t.storyS} main={t.storyT}/></div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 clamp(12px,3vw,16px) 44px", maxWidth:"620px", margin:"0 auto", width:"100%" }} className="iscroll">
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:"16px", top:0, bottom:0, width:"1px", background:"linear-gradient(180deg,var(--goldd),var(--brd),transparent)" }}/>
          {chs.map((ch, i) => (
            <div key={i} style={{ display:"flex", gap:"clamp(16px,3vw,24px)", marginBottom:i < chs.length-1 ? "clamp(24px,4vw,36px)" : 0, position:"relative" }}>
              <div style={{ width:"32px", height:"32px", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:2 }}>
                <div style={{ width:ch.branch?"12px":"8px", height:ch.branch?"12px":"8px", background:ch.branch?"var(--gold)":"var(--bgc)", border:`2px solid ${ch.branch?"var(--gold)":"var(--goldd)"}`, transform:"rotate(45deg)", boxShadow:ch.branch?"0 0 18px rgba(212,165,74,0.4)":"none" }}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:"8px", marginBottom:"4px", flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(10px,1.3vw,12px)", letterSpacing:"3px", color:"var(--goldd)", fontWeight:600 }}>CH{ch.n}</span>
                  <span style={{ fontFamily:"var(--fd)", fontSize:"clamp(16px,2.5vw,20px)", fontWeight:700 }}>{ch.t}</span>
                </div>
                <div style={{ fontSize:"clamp(10px,1.3vw,12px)", color:"var(--txd)", letterSpacing:"1px", marginBottom:"5px" }}>{ch.m}</div>
                <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", lineHeight:1.7, fontWeight:300, fontStyle:"italic" }}>{ch.z}</p>
                {ch.branch && <div style={{ marginTop:"10px", padding:"clamp(8px,1.5vw,10px) clamp(10px,2vw,14px)", background:"rgba(212,165,74,0.06)", borderLeft:"2px solid var(--gold)", fontSize:"clamp(11px,1.4vw,13px)", color:"var(--gold)", fontWeight:400 }}>{t.branch}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 5 — 시스템 가이드
   ═══════════════════════════════════════════ */
function System() {
  const t = useT();
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"clamp(32px,5vw,44px) clamp(12px,3vw,16px)" }}>
      <div style={{ maxWidth:"680px", width:"100%" }}>
        <STitle sub={t.sysS} main={t.sysT}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))", gap:"14px", marginBottom:"clamp(28px,5vw,44px)" }}>
          {[{ l:t.sm, d:t.smd, ic:"📖" }, { l:t.fm, d:t.fmd, ic:"🌊" }].map((m, i) => (
            <div key={i} style={{ padding:"clamp(18px,3vw,24px)", background:"var(--bgc)", border:"1px solid var(--brd)" }}>
              <div style={{ fontSize:"24px", marginBottom:"10px" }}>{m.ic}</div>
              <h3 style={{ fontFamily:"var(--fd)", fontSize:"clamp(16px,2vw,19px)", fontWeight:700, marginBottom:"8px" }}>{m.l}</h3>
              <p style={{ fontSize:"clamp(12px,1.5vw,14px)", color:"var(--tx2)", lineHeight:1.8, fontWeight:300 }}>{m.d}</p>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(10px,1.3vw,12px)", letterSpacing:"4px", color:"var(--goldd)", textAlign:"center", marginBottom:"16px", fontWeight:600 }}>{t.cmdL}</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {[{ c:t.c1, d:t.c1d }, { c:t.c2, d:t.c2d }, { c:t.c3, d:t.c3d }].map((x, i) => (
            <div key={i} style={{ display:"flex", gap:"clamp(8px,2vw,14px)", alignItems:"baseline", padding:"12px clamp(12px,2vw,16px)", background:"var(--bgc)", border:"1px solid var(--brd)", flexWrap:"wrap" }}>
              <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"clamp(12px,1.5vw,14px)", color:"var(--gold)", fontWeight:600, background:"rgba(212,165,74,0.08)", padding:"3px 8px", flexShrink:0 }}>{x.c}</code>
              <span style={{ fontSize:"clamp(11px,1.4vw,13px)", color:"var(--tx2)", fontWeight:300, lineHeight:1.6 }}>{x.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEC 6 — CTA (입장)
   ═══════════════════════════════════════════ */
function CTA() {
  const t = useT();
  const [hv, setHv] = useState(false);
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", padding:"0 clamp(12px,3vw,16px)" }}>
      <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"min(450px,90vw)", height:"250px", background:"radial-gradient(ellipse at center bottom,rgba(212,165,74,0.05) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:2, textAlign:"center" }}>
        <div style={{ width:"1px", height:"40px", background:"linear-gradient(180deg,transparent,var(--goldd))", margin:"0 auto 28px" }}/>
        <div style={{ fontFamily:"var(--fd)", fontSize:"clamp(22px,4vw,38px)", fontWeight:700, marginBottom:"clamp(28px,5vw,44px)" }}>{t.ctaT}</div>
        <button
          onMouseEnter={() => setHv(true)} onMouseLeave={() => setHv(false)}
          onClick={() => alert("URL 추후 삽입")}
          style={{
            padding:"clamp(14px,2vw,18px) clamp(40px,8vw,64px)",
            background: hv ? "rgba(212,165,74,0.1)" : "transparent",
            border:"1px solid var(--gold)", color:"var(--gold)",
            fontFamily:"var(--fd)", fontSize:"clamp(15px,2vw,18px)", fontWeight:600, letterSpacing:"clamp(2px,0.5vw,4px)",
            cursor:"pointer", transition:"all 0.4s",
            boxShadow: hv ? "0 0 40px rgba(212,165,74,0.12)" : "none",
          }}>{t.ctaB}</button>
        <p style={{ fontSize:"clamp(9px,1.2vw,11px)", color:"var(--txd)", marginTop:"20px", letterSpacing:"1px" }}>{t.ctaN}</p>
      </div>
      <div style={{ position:"absolute", bottom:"20px", width:"100%", textAlign:"center", fontSize:"clamp(9px,1.2vw,11px)", color:"var(--txd)", letterSpacing:"1px" }}>{t.credit}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */
const SECS = [Hero, Chars, World, Roadmap, System, CTA];
const TOTAL = SECS.length;

export default function App() {
  const [lang, setLang] = useState(null);
  const [showOp, setShowOp] = useState(true);
  const [entered, setEntered] = useState(false);
  const [audioEl, setAudioEl] = useState(null);
  const [cur, setCur] = useState(0);
  const [modal, setModal] = useState(null);
  const tr = useRef(false);

  const done = (a) => { setAudioEl(a); setShowOp(false); setEntered(true); };
  const goTo = useCallback(i => {
    if (i < 0 || i >= TOTAL || tr.current) return;
    tr.current = true;
    setCur(i);
    setTimeout(() => { tr.current = false; }, 850);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const onW = e => {
      if (modal) return;
      const s = e.target.closest('.iscroll');
      if (s) {
        const { scrollTop: t, scrollHeight: h, clientHeight: c } = s;
        if (e.deltaY > 0 && t + c < h - 4) return;
        if (e.deltaY < 0 && t > 4) return;
      }
      e.preventDefault();
      if (e.deltaY > 0) goTo(cur + 1);
      else if (e.deltaY < 0) goTo(cur - 1);
    };

    let ty = 0, tEl = null, scrolled = false, startST = 0;
    const tS = e => {
      ty = e.touches[0].clientY;
      tEl = e.target.closest ? e.target.closest('.iscroll') : null;
      scrolled = false;
      startST = tEl ? tEl.scrollTop : 0;
    };
    const tM = () => { if (tEl && tEl.scrollTop !== startST) scrolled = true; };
    const tE = e => {
      if (modal) return;
      const d = ty - e.changedTouches[0].clientY;
      if (Math.abs(d) < 100) return;
      if (tEl) {
        const { scrollTop: t, scrollHeight: h, clientHeight: c } = tEl;
        if (d > 0 && t + c < h - 8) return;
        if (d < 0 && t > 8) return;
        if (scrolled) return;
      }
      if (d > 0) goTo(cur + 1); else goTo(cur - 1);
    };
    const kD = e => {
      if (modal) return;
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); goTo(cur + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); goTo(cur - 1); }
    };

    window.addEventListener("wheel", onW, { passive: false });
    window.addEventListener("touchstart", tS, { passive: true });
    window.addEventListener("touchmove", tM, { passive: true });
    window.addEventListener("touchend", tE, { passive: true });
    window.addEventListener("keydown", kD);
    return () => {
      window.removeEventListener("wheel", onW);
      window.removeEventListener("touchstart", tS);
      window.removeEventListener("touchmove", tM);
      window.removeEventListener("touchend", tE);
      window.removeEventListener("keydown", kD);
    };
  }, [entered, cur, goTo, modal]);

  if (!lang) return <LangSelect onPick={setLang}/>;

  return (
    <LangCtx.Provider value={lang}>
      <div style={{ width:"100vw", height:"var(--vh)", overflow:"hidden", background:"var(--bg)", position:"relative" }}>
        {showOp && <Opening onEnd={done}/>}
        {entered && <>
          <BGMPlayer audioEl={audioEl}/>
          <Nav cur={cur} total={TOTAL} onGo={goTo}/>
          <div style={{ transform:`translateY(calc(-${cur} * var(--vh)))`, transition:"transform 0.8s cubic-bezier(0.65,0,0.35,1)", height:`calc(${TOTAL} * var(--vh))` }}>
            {SECS.map((S, i) => (
              <div key={i} style={{ height:"var(--vh)", width:"100vw" }}>
                {i === 1 ? <S onOpen={setModal}/> : <S/>}
              </div>
            ))}
          </div>
          <CharModal c={modal} onClose={() => setModal(null)}/>
        </>}
      </div>
    </LangCtx.Provider>
  );
}
