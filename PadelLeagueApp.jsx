"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays, Users, Trophy, ShieldCheck, BarChart3, Bell, Share2,
  LogIn, LogOut, Plus, Search, MapPin, Clock3, CreditCard, Settings,
  UserPlus, Sparkles, CheckCircle2, XCircle, Menu, X, Crown, Zap
} from "lucide-react";

const BRAND = "K-PADEL ARENA";
const VENUES = [
  { id: "yongsan", name: "Yongsan Mmove", courts: 4, price: 30000 },
  { id: "gimpo", name: "Gimpo Padel Society", courts: 3, price: 28000 },
  { id: "dongtan", name: "Dongtan Garros Padel", courts: 5, price: 25000 },
];
const LEVELS = ["1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0+"];
const TABS = [
  ["booking", "코트 예약", CalendarDays],
  ["match", "게임 매칭", Users],
  ["tournament", "대회", Trophy],
  ["ranking", "랭킹", Crown],
  ["club", "클럽", Users],
  ["notifications", "알림", Bell],
  ["admin", "관리자", ShieldCheck],
];

const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
const isoToday = () => new Date().toISOString().slice(0, 10);
const money = (n) => `${Number(n || 0).toLocaleString("ko-KR")}원`;

async function kvGet(key) {
  const r = await fetch(`/api/kv?key=${encodeURIComponent(key)}`, { cache: "no-store" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("storage read failed");
  return (await r.json()).value;
}
async function kvSet(key, value) {
  const r = await fetch("/api/kv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
  if (!r.ok) throw new Error("storage write failed");
}

function defaultData() {
  return {
    members: [
      { id: "m_demo", name: "K-Padel Member", phone: "", email: "", level: "3.0", role: "admin", wins: 8, losses: 3, points: 1280, clubId: "club_spc" },
      { id: "m_demo2", name: "김민수", phone: "", email: "", level: "3.0", role: "user", wins: 5, losses: 4, points: 1120, clubId: "club_spc" },
      { id: "m_demo3", name: "이서연", phone: "", email: "", level: "2.5", role: "user", wins: 7, losses: 2, points: 1190, clubId: "club_spc" },
      { id: "m_demo4", name: "박준호", phone: "", email: "", level: "3.5", role: "user", wins: 4, losses: 5, points: 1080, clubId: "club_garros" },
    ],
    bookings: [],
    matches: [],
    tournaments: [],
    clubs: [
      { id: "club_spc", name: "Seoul Private Padel Club", city: "Seoul", memberIds: ["m_demo", "m_demo2", "m_demo3"] },
      { id: "club_garros", name: "Dongtan Garros Padel", city: "Hwaseong", memberIds: ["m_demo4"] },
    ],
    notifications: [],
    payments: [],
  };
}

function Card({ children, className = "" }) { return <div className={`card ${className}`}>{children}</div>; }
function Button({ children, onClick, secondary = false, danger = false, disabled = false, small = false }) {
  return <button disabled={disabled} onClick={onClick} className={`btn ${secondary ? "secondary" : ""} ${danger ? "danger" : ""} ${small ? "small" : ""}`}>{children}</button>;
}
function Field({ label, ...props }) { return <label className="field"><span>{label}</span><input {...props} /></label>; }

function AuthModal({ onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", level: "3.0" });
  const submit = (e) => { e.preventDefault(); mode === "login" ? onLogin(form) : onSignup(form); };
  return <div className="overlay"><div className="modal">
    <button className="close" onClick={onClose}><X size={20}/></button>
    <div className="brandMark">K</div><h2>{mode === "login" ? "로그인" : "회원가입"}</h2>
    <p className="muted">K-PADEL ARENA의 예약·매칭·대회 서비스를 이용하세요.</p>
    <form onSubmit={submit}>
      {mode === "signup" && <Field label="이름" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />}
      <Field label="이메일" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com" required />
      {mode === "signup" && <><Field label="휴대폰" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="010-0000-0000" /><label className="field"><span>빠델 레벨</span><select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>{LEVELS.map(x=><option key={x}>{x}</option>)}</select></label></>}
      <Button>{mode === "login" ? "이메일로 로그인" : "회원가입"}</Button>
    </form>
    <div className="divider">또는</div>
    <Button secondary onClick={()=>window.location.href="/api/auth/kakao"}><span className="kakaoDot">K</span> 카카오로 로그인</Button>
    <button className="textBtn" onClick={()=>setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "처음이신가요? 회원가입" : "이미 회원이신가요? 로그인"}</button>
  </div></div>;
}

function BookingTab({ data, setData, user, notify }) {
  const [date, setDate] = useState(isoToday());
  const [venue, setVenue] = useState(VENUES[0].id);
  const [court, setCourt] = useState(1);
  const [time, setTime] = useState("19:00");
  const [paid, setPaid] = useState(false);
  const v = VENUES.find(x=>x.id===venue);
  const slots = Array.from({length:14}, (_,i)=>`${String(i+7).padStart(2,"0")}:00`);
  const booked = data.bookings.some(b=>b.date===date && b.venueId===venue && b.court===court && b.time===time && b.status!=="cancelled");
  const create = async () => {
    if (!user) return notify("먼저 로그인해 주세요.");
    if (booked) return notify("이미 예약된 시간입니다.");
    const b = { id:uid("booking"), userId:user.id, userName:user.name, date, venueId:venue, court, time, price:v.price, status: paid ? "confirmed" : "pending_payment", createdAt:Date.now() };
    setData(d=>({...d,bookings:[...d.bookings,b],payments:paid?[...d.payments,{id:uid("pay"),bookingId:b.id,userId:user.id,amount:v.price,status:"paid",createdAt:Date.now()}]:d.payments}));
    notify(paid ? "예약이 확정되었습니다." : "예약이 생성되었습니다. 결제 후 확정됩니다.");
  };
  return <div className="stack">
    <div className="hero"><div><div className="eyebrow">REAL-TIME COURT BOOKING</div><h1>빠델 코트를 바로 예약하세요.</h1><p>실시간 중복 예약 방지 · 모바일 최적화 · 결제 연동 구조</p></div><CalendarDays size={56}/></div>
    <Card><div className="grid4"><Field label="날짜" type="date" min={isoToday()} value={date} onChange={e=>setDate(e.target.value)}/><label className="field"><span>센터</span><select value={venue} onChange={e=>setVenue(e.target.value)}>{VENUES.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label><label className="field"><span>코트</span><select value={court} onChange={e=>setCourt(Number(e.target.value))}>{Array.from({length:v.courts},(_,i)=><option key={i} value={i+1}>Court {i+1}</option>)}</select></label><label className="field"><span>시간</span><select value={time} onChange={e=>setTime(e.target.value)}>{slots.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <div className="availability"><span className={booked?"dot busy":"dot"}></span>{booked?"이미 예약됨":"예약 가능"} · {money(v.price)}</div>
      <label className="check"><input type="checkbox" checked={paid} onChange={e=>setPaid(e.target.checked)}/> 결제 완료 상태로 테스트 예약</label>
      <Button onClick={create} disabled={booked}><CreditCard size={17}/> {paid?"결제 완료 & 예약 확정":"예약 신청"}</Button>
    </Card>
    <Card><h3>내 예약</h3>{data.bookings.filter(b=>user&&b.userId===user.id).length===0?<p className="muted">예약 내역이 없습니다.</p>:data.bookings.filter(b=>user&&b.userId===user.id).map(b=><div className="row" key={b.id}><div><b>{b.date} {b.time}</b><div className="muted">{VENUES.find(v=>v.id===b.venueId)?.name} · Court {b.court}</div></div><span className={`badge ${b.status}`}>{b.status === "confirmed"?"확정":b.status === "pending_payment"?"결제대기":"취소"}</span></div>)}</Card>
  </div>;
}

function ResultBox({onSave}){const[a,setA]=useState("");const[b,setB]=useState("");return <div className="resultBox"><b>경기 결과 입력</b><div className="scoreInputs"><input type="number" min="0" value={a} onChange={e=>setA(e.target.value)} placeholder="팀 A"/><span>:</span><input type="number" min="0" value={b} onChange={e=>setB(e.target.value)} placeholder="팀 B"/><Button small onClick={()=>onSave(a,b)}>결과 저장</Button></div></div>}

function MatchTab({ data, setData, user, notify }) {
  const [form, setForm] = useState({date:isoToday(), venueId:VENUES[0].id, time:"19:00", level:"3.0", needed:3, note:""});
  const openMatches=data.matches.filter(m=>m.status!=="completed");
  const create=()=>{if(!user)return notify("로그인해 주세요."); const m={id:uid("match"),...form,hostId:user.id,hostName:user.name,players:[user.id],status:"open",createdAt:Date.now()};setData(d=>({...d,matches:[...d.matches,m]}));notify("모집 글이 등록되었습니다.");};
  const join=(m)=>{if(!user)return notify("로그인해 주세요.");if(m.players.includes(user.id))return; if(m.players.length>=4)return notify("4명 모집이 완료되었습니다.");const players=[...m.players,user.id];setData(d=>({...d,matches:d.matches.map(x=>x.id===m.id?{...x,players,status:players.length===4?"matched":"open"}:x)}));notify(players.length===4?"4명 자동 매칭 완료! 경기가 확정되었습니다.":"참가 신청 완료");};
  const saveResult=(m,a,b)=>{if(!user)return notify("로그인해 주세요.");if(a===""||b==="")return notify("스코어를 입력해 주세요.");setData(d=>{const old=d.matches.find(x=>x.id===m.id);if(old?.result)return d;const winA=Number(a)>Number(b);const nextMembers=d.members.map(p=>m.players.includes(p.id)?{...p,wins:p.wins+(winA?(m.players.indexOf(p.id)<2?1:0):(m.players.indexOf(p.id)>=2?1:0)),losses:p.losses+(winA?(m.players.indexOf(p.id)>=2?1:0):(m.players.indexOf(p.id)<2?1:0)),points:p.points+(m.players.indexOf(p.id)<2?(winA?30:10):(winA?10:30))}:p);return {...d,members:nextMembers,matches:d.matches.map(x=>x.id===m.id?{...x,result:{a:Number(a),b:Number(b)},status:"completed"}:x)}});notify("경기 결과가 저장되고 랭킹에 반영되었습니다.")};
  return <div className="stack"><div className="sectionHead"><div><div className="eyebrow">MATCH MAKING</div><h2>경기 참가자 모집</h2></div><Button onClick={create}><Plus size={17}/> 모집글 만들기</Button></div>
    <Card><div className="grid4"><Field label="날짜" type="date" value={form.date} min={isoToday()} onChange={e=>setForm({...form,date:e.target.value})}/><label className="field"><span>센터</span><select value={form.venueId} onChange={e=>setForm({...form,venueId:e.target.value})}>{VENUES.map(v=><option value={v.id} key={v.id}>{v.name}</option>)}</select></label><label className="field"><span>레벨</span><select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}>{LEVELS.map(x=><option key={x}>{x}</option>)}</select></label><Field label="시간" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></div><Field label="메모" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="예: 남자 2명 / 즐겁게 게임하실 분"/></Card>
    {openMatches.length===0?<Card><p className="muted">현재 모집 중인 경기가 없습니다. 첫 모집글을 만들어 보세요.</p></Card>:openMatches.map(m=>{const full=m.players.length>=4;return <Card key={m.id}><div className="row"><div><div className="tag">{m.status==="matched"?"MATCHED":"모집중"}</div><h3>{m.date} · {m.time}</h3><p className="muted">{VENUES.find(v=>v.id===m.venueId)?.name} · Level {m.level} · {m.players.length}/4명</p></div><Button small onClick={()=>join(m)} disabled={full||m.players.includes(user?.id)}>{full?"매칭 완료":m.players.includes(user?.id)?"참가중":"참가하기"}</Button></div><div className="avatars">{m.players.map(id=><span key={id}>{data.members.find(x=>x.id===id)?.name?.slice(0,1)||"?"}</span>)}{Array.from({length:4-m.players.length}).map((_,i)=><span className="empty" key={i}>+</span>)}</div>{m.note&&<div className="note">{m.note}</div>}{m.status==="matched"&&!m.result&&<ResultBox onSave={(a,b)=>saveResult(m,a,b)}/>} {m.result&&<div className="note"><b>결과 {m.result.a} : {m.result.b}</b> · 랭킹 반영 완료</div>}</Card>})}
  </div>;
}

function TournamentTab({data,setData,user,notify}){
  const [name,setName]=useState("");const [date,setDate]=useState(isoToday());const [fee,setFee]=useState(30000);
  const create=()=>{if(!user||user.role!=="admin")return notify("관리자만 대회를 생성할 수 있습니다.");const t={id:uid("t"),name:name||"K-PADEL Open",date,fee:Number(fee),status:"open",maxPlayers:32,players:[],createdAt:Date.now()};setData(d=>({...d,tournaments:[...d.tournaments,t]}));setName("");notify("대회가 생성되었습니다.");};
  const join=t=>{if(!user)return notify("로그인해 주세요.");if(t.players.includes(user.id))return;setData(d=>({...d,tournaments:d.tournaments.map(x=>x.id===t.id?{...x,players:[...x.players,user.id]}:x)}));notify("대회 참가 신청이 완료되었습니다.");};
  return <div className="stack"><div className="sectionHead"><div><div className="eyebrow">TOURNAMENT</div><h2>대회 생성 & 참가 신청</h2></div></div>{user?.role==="admin"&&<Card><div className="grid3"><Field label="대회명" value={name} onChange={e=>setName(e.target.value)} placeholder="K-PADEL Open 2026"/><Field label="대회일" type="date" min={isoToday()} value={date} onChange={e=>setDate(e.target.value)}/><Field label="참가비" type="number" value={fee} onChange={e=>setFee(e.target.value)}/></div><Button onClick={create}><Plus size={17}/> 대회 생성</Button></Card>}{data.tournaments.length===0?<Card><p className="muted">등록된 대회가 없습니다.</p></Card>:data.tournaments.map(t=><Card key={t.id}><div className="row"><div><div className="tag">OPEN</div><h3>{t.name}</h3><p className="muted">{t.date} · 참가비 {money(t.fee)} · {t.players.length}/{t.maxPlayers}명</p></div><Button small onClick={()=>join(t)} disabled={t.players.includes(user?.id)}>{t.players.includes(user?.id)?"참가 신청 완료":"참가 신청"}</Button></div></Card>)}</div>;
}

function RankingTab({data}){const ranking=[...data.members].sort((a,b)=>b.points-a.points);return <div className="stack"><div className="hero compact"><div><div className="eyebrow">PLAYER RANKING</div><h1>개인 랭킹 / 레벨</h1><p>경기 결과가 누적되어 포인트와 승률에 반영됩니다.</p></div><Trophy size={52}/></div><Card><div className="ranking">{ranking.map((m,i)=><div className="rankRow" key={m.id}><strong>{i+1}</strong><div className="avatar">{m.name.slice(0,1)}</div><div className="grow"><b>{m.name}</b><span>Level {m.level} · {m.wins}승 {m.losses}패</span></div><b>{m.points.toLocaleString()} P</b></div>)}</div></Card></div>}

function ClubTab({data,setData,user,notify}){const [name,setName]=useState("");const join=c=>{if(!user)return notify("로그인해 주세요.");if(c.memberIds.includes(user.id))return;setData(d=>({...d,clubs:d.clubs.map(x=>x.id===c.id?{...x,memberIds:[...x.memberIds,user.id]}:x)}));notify("클럽 가입 완료");};return <div className="stack"><div className="sectionHead"><div><div className="eyebrow">CLUB MANAGEMENT</div><h2>클럽별 회원 관리</h2></div></div>{user?.role==="admin"&&<Card><div className="inline"><Field label="새 클럽명" value={name} onChange={e=>setName(e.target.value)} placeholder="Seoul Padel Club"/><Button onClick={()=>{if(name){setData(d=>({...d,clubs:[...d.clubs,{id:uid("club"),name,city:"Seoul",memberIds:[]}]}));setName("")}}}><Plus size={17}/> 클럽 생성</Button></div></Card>}{data.clubs.map(c=><Card key={c.id}><div className="row"><div><h3>{c.name}</h3><p className="muted"><MapPin size={14}/> {c.city} · 회원 {c.memberIds.length}명</p></div><Button small onClick={()=>join(c)} disabled={c.memberIds.includes(user?.id)}>{c.memberIds.includes(user?.id)?"가입 완료":"가입하기"}</Button></div><div className="memberPills">{c.memberIds.map(id=><span key={id}>{data.members.find(m=>m.id===id)?.name||"회원"}</span>)}</div></Card>)}</div>}

function NotificationsTab({data}){return <div className="stack"><div className="sectionHead"><div><div className="eyebrow">PUSH NOTIFICATIONS</div><h2>푸시 알림</h2></div></div><Card><h3>브라우저 알림 권한</h3><p className="muted">예약 확정, 매칭 완료, 대회 일정 등의 알림을 브라우저 푸시로 받을 수 있도록 준비되어 있습니다.</p><Button onClick={async()=>{if("Notification" in window){const p=await Notification.requestPermission();alert(p==="granted"?"알림 권한이 허용되었습니다.":"알림 권한이 허용되지 않았습니다.")}}}><Bell size={17}/> 알림 권한 허용</Button></Card>{data.notifications.length===0?<Card><p className="muted">새 알림이 없습니다.</p></Card>:data.notifications.map(n=><Card key={n.id}><b>{n.title}</b><p>{n.body}</p></Card>)}</div>}

function AdminTab({data,setData,notify}){const revenue=data.payments.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);const confirmed=data.bookings.filter(b=>b.status==="confirmed").length;const upcoming=data.bookings.filter(b=>b.date>=isoToday()&&b.status!=="cancelled").length;const cancel=()=>{setData(d=>({...d,bookings:d.bookings.map(b=>b.date<isoToday()?{...b,status:"completed"}:b)}));notify("지난 예약 상태를 정리했습니다.");};return <div className="stack"><div className="sectionHead"><div><div className="eyebrow">ADMIN DASHBOARD</div><h2>운영 / 매출 / 예약 통계</h2></div><Button secondary onClick={cancel}><Settings size={17}/> 데이터 정리</Button></div><div className="stats"><Card><span>총 매출</span><b>{money(revenue)}</b><small>결제 완료 기준</small></Card><Card><span>확정 예약</span><b>{confirmed}</b><small>누적</small></Card><Card><span>예정 예약</span><b>{upcoming}</b><small>오늘 이후</small></Card><Card><span>회원</span><b>{data.members.length}</b><small>등록 회원</small></Card></div><Card><h3>최근 예약</h3>{data.bookings.slice(-8).reverse().map(b=><div className="row" key={b.id}><span>{b.date} {b.time} · {b.userName}</span><span>{money(b.price)} · {b.status}</span></div>)}{data.bookings.length===0&&<p className="muted">예약 데이터가 없습니다.</p>}</Card></div>}

export default function PadelLeagueApp(){
  const [data,setData]=useState(null);const [tab,setTab]=useState("booking");const [user,setUser]=useState(null);const [auth,setAuth]=useState(false);const [notice,setNotice]=useState("");const [mobileNav,setMobileNav]=useState(false);
  useEffect(()=>{(async()=>{try{const raw=await kvGet("kpa:v2:data");setData(raw?JSON.parse(raw):defaultData());}catch{setData(defaultData())} try{const id=localStorage.getItem("kpa:v2:user");if(id){const raw=await kvGet("kpa:v2:data");if(raw){const d=JSON.parse(raw);setUser(d.members.find(m=>m.id===id)||null)}}}catch{}})()},[]);
  useEffect(()=>{if(!data)return;const t=setTimeout(()=>kvSet("kpa:v2:data",JSON.stringify(data)).catch(()=>{}),250);return()=>clearTimeout(t)},[data]);
  useEffect(()=>{if(!data)return;const q=new URLSearchParams(window.location.search);const kid=q.get("kakao_id");const kname=q.get("kakao_name");if(kid){let u=data.members.find(m=>m.kakaoId===kid);if(!u){u={id:uid("member"),kakaoId:kid,name:kname||"카카오 회원",email:"",phone:"",level:"3.0",role:"user",wins:0,losses:0,points:1000,clubId:null};setData(d=>({...d,members:[...d.members,u]}))}setUser(u);localStorage.setItem("kpa:v2:user",u.id);window.history.replaceState({},"",window.location.pathname);}} ,[data]);
  const notify=(x)=>{setNotice(x);setTimeout(()=>setNotice(""),2800)};
  const login=form=>{const existing=data.members.find(m=>(form.email&&m.email===form.email));const u=existing||data.members[0];setUser(u);localStorage.setItem("kpa:v2:user",u.id);setAuth(false);notify(`${u.name}님, 환영합니다.`)};
  const signup=form=>{const u={id:uid("member"),name:form.name,email:form.email,phone:form.phone,level:form.level,role:"user",wins:0,losses:0,points:1000,clubId:null};setData(d=>({...d,members:[...d.members,u]}));setUser(u);localStorage.setItem("kpa:v2:user",u.id);setAuth(false);notify("회원가입이 완료되었습니다.")};
  const logout=()=>{setUser(null);localStorage.removeItem("kpa:v2:user")};
  if(!data)return <div className="loading"><div className="brandMark">K</div><b>K-PADEL ARENA</b><span>앱을 불러오는 중...</span></div>;
  const page={booking:<BookingTab data={data} setData={setData} user={user} notify={notify}/>,match:<MatchTab data={data} setData={setData} user={user} notify={notify}/>,tournament:<TournamentTab data={data} setData={setData} user={user} notify={notify}/>,ranking:<RankingTab data={data}/>,club:<ClubTab data={data} setData={setData} user={user} notify={notify}/>,notifications:<NotificationsTab data={data}/>,admin:user?.role==="admin"?<AdminTab data={data} setData={setData} notify={notify}/>:<Card><h2>관리자 권한이 필요합니다.</h2><p className="muted">관리자 계정으로 로그인하면 운영 대시보드를 사용할 수 있습니다.</p></Card>}[tab];
  return <><div className="app"><header><div className="logo" onClick={()=>setTab("booking")}><div className="brandMark">K</div><div><b>{BRAND}</b><small>PADEL SPORTS PLATFORM</small></div></div><button className="mobileMenu" onClick={()=>setMobileNav(!mobileNav)}>{mobileNav?<X/>:<Menu/>}</button><div className="userArea">{user?<><span className="userName">{user.name} <em>Lv.{user.level}</em></span><button className="iconBtn" onClick={logout} title="로그아웃"><LogOut size={18}/></button></>:<Button small onClick={()=>setAuth(true)}><LogIn size={16}/> 로그인</Button>}</div></header><div className={`layout ${mobileNav?"navOpen":""}`}><aside><nav>{TABS.map(([k,l,I])=><button key={k} className={tab===k?"active":""} onClick={()=>{setTab(k);setMobileNav(false)}}><I size={18}/>{l}{k==="admin"&&user?.role!=="admin"?<span className="lock">•</span>:null}</button>)}</nav><div className="sideFoot"><Zap size={15}/> 실시간 플랫폼 V2</div></aside><main>{page}</main></div><footer><span>© 2026 K-PADEL ARENA</span><span>예약 · 매칭 · 대회 · 랭킹 · 클럽</span></footer></div>{auth&&<AuthModal onClose={()=>setAuth(false)} onLogin={login} onSignup={signup}/>} {notice&&<div className="toast"><CheckCircle2 size={17}/>{notice}</div>}</>;
}
