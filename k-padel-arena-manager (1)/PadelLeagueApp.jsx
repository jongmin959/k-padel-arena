"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Trophy,
  Users,
  CalendarRange,
  ListOrdered,
  Plus,
  X,
  Shuffle,
  RefreshCw,
  Settings2,
  ChevronDown,
  Grid3x3,
  UserPlus,
  Trash2,
  UserCircle,
  LogOut,
} from "lucide-react";

/* ---------------------------------------------------------
   토큰 — 파델 코트의 소재를 그대로 색과 타이포에 옮김
   turf: 코트 인조잔디, ball: 형광 옐로그린 볼,
   glass: 코트 유리벽, ink: 실내 파델장 조명 아래의 어둠
--------------------------------------------------------- */
const C = {
  ink: "#10151A",
  inkSoft: "#1A2229",
  turf: "#0F3D3E",
  turfLight: "#175651",
  paper: "#ECEFEA",
  paperDim: "#DDE2D8",
  ball: "#D7F13B",
  glass: "#6C97A0",
  charcoal: "#1B2422",
  line: "rgba(255,255,255,0.28)",
  danger: "#C25450",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
`;

const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const BRAND_LOGO = "data:image/jpeg;base64,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";

const STORAGE_KEY = "padel-league-active-v1";
const MEMBERS_KEY = "padel-members-v1";
const CURRENT_MEMBER_KEY = "padel-current-member-v1";
const LEVEL_MIN = 0;
const LEVEL_MAX = 7;
const LEVEL_STEP = 0.1;

const VENUES = ["Yongsan Mmove", "Gimpo Padel Society", "Dongtan Garros Padel"];

const CATEGORIES = [
  { key: "rental", label: "대관", color: "#8B5CF6" },
  { key: "match", label: "매치", color: "#16A34A" },
  { key: "league", label: "리그매치", color: "#D97706" },
  { key: "lesson", label: "레슨", color: "#E4574B" },
];
const categoryOf = (key) => CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];

const AMENITIES = [
  { key: "parking", label: "주차" },
  { key: "lockerRoom", label: "탈의실" },
  { key: "shower", label: "샤워시설" },
  { key: "restroom", label: "화장실" },
  { key: "racketRental", label: "라켓대여" },
  { key: "wifi", label: "와이파이" },
];

function venueAmenitiesKey(venue) {
  return `padel-venue-amenities:${venue}`;
}

function venuePhotoKey(venue) {
  return `padel-venue-photo:${venue}`;
}

/* Retries a storage write a few times with a short backoff before
   giving up — smooths over transient failures so "add a photo" reliably
   ends in a save instead of a one-shot attempt. */
async function storageSetWithRetry(key, value, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await window.storage.set(key, value, false);
      if (res) return res;
    } catch (e) {
      // fall through to retry
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, 350 * (i + 1)));
    }
  }
  return null;
}

/* Shrinks an image aggressively so it fits in storage.
   Never rejects: if canvas processing fails for any reason, it falls
   back to the raw data URL so the photo still shows on screen. */
function resizeImageFile(file, maxWidth = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("파일을 읽지 못했습니다"));
    reader.onload = () => {
      const raw = reader.result;
      const img = new Image();
      img.onerror = () => resolve(raw); // can't decode? hand back the original
      img.onload = () => {
        try {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(raw);
          ctx.drawImage(img, 0, 0, w, h);
          let out = canvas.toDataURL("image/jpeg", quality);
          // keep shrinking until it comfortably fits the storage limit
          let q = quality;
          let width = w;
          while (out.length > 1_200_000 && (q > 0.35 || width > 300)) {
            if (q > 0.35) q -= 0.15;
            else {
              width = Math.round(width * 0.7);
              const c2 = document.createElement("canvas");
              c2.width = width;
              c2.height = Math.round((h / w) * width);
              const x2 = c2.getContext("2d");
              if (!x2) break;
              x2.drawImage(img, 0, 0, c2.width, c2.height);
              out = c2.toDataURL("image/jpeg", q);
              continue;
            }
            out = canvas.toDataURL("image/jpeg", q);
          }
          resolve(out);
        } catch (e) {
          resolve(raw);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

function defaultLeague() {
  return {
    id: uid(),
    name: "새 리그",
    venue: VENUES[0],
    format: "americano", // 'americano' | 'mexicano' | 'round_robin'
    courtCount: 2,
    players: [],
    teams: [],
    rounds: [],
    bookings: [],
    resultPhoto: null,
    createdAt: Date.now(),
  };
}

const BOOKING_SLOTS_PER_MATCH = 4;

function generateTimeSlots(startHour, endHour, stepMinutes) {
  const slots = [];
  let mins = startHour * 60;
  const end = endHour * 60;
  while (mins <= end) {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    mins += stepMinutes;
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots(7, 22, 60);
const WEEKDAY_KR = ["일", "월", "화", "수", "목", "금", "토"];

function nextDays(count) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    out.push({
      iso,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      weekday: WEEKDAY_KR[d.getDay()],
      isToday: i === 0,
    });
  }
  return out;
}

/* ---------------------------------------------------------
   스케줄 생성 알고리즘
--------------------------------------------------------- */
function generateAmericanoRounds(players, courtCount, numRounds) {
  const ids = players.map((p) => p.id);
  const n = ids.length;
  const partner = {};
  const opp = {};
  const playCount = {};
  ids.forEach((a) => {
    partner[a] = {};
    opp[a] = {};
    playCount[a] = 0;
    ids.forEach((b) => {
      partner[a][b] = 0;
      opp[a][b] = 0;
    });
  });

  const rounds = [];
  for (let r = 0; r < numRounds; r++) {
    const matchesThisRound = Math.min(courtCount, Math.floor(n / 4));
    const activeCount = matchesThisRound * 4;
    if (activeCount < 4) break;

    const sortedByRest = [...ids].sort(
      (a, b) => playCount[a] - playCount[b] || Math.random() - 0.5
    );
    const active = sortedByRest.slice(0, activeCount);
    const sitOut = sortedByRest.slice(activeCount);

    let pool = [...active].sort(() => Math.random() - 0.5);
    const matches = [];
    let courtIdx = 0;

    while (pool.length >= 4) {
      const p1 = pool.shift();
      pool.sort((a, b) => partner[p1][a] - partner[p1][b] || Math.random() - 0.5);
      const p2 = pool.shift();

      pool.sort(() => Math.random() - 0.5);
      const p3 = pool.shift();
      pool.sort((a, b) => partner[p3][a] - partner[p3][b] || Math.random() - 0.5);
      const p4 = pool.shift();

      partner[p1][p2]++;
      partner[p2][p1]++;
      partner[p3][p4]++;
      partner[p4][p3]++;
      [p1, p2].forEach((x) =>
        [p3, p4].forEach((y) => {
          opp[x][y]++;
          opp[y][x]++;
        })
      );
      [p1, p2, p3, p4].forEach((x) => (playCount[x] += 1));

      matches.push({
        id: `r${r}-c${courtIdx}`,
        court: courtIdx + 1,
        sideA: [p1, p2],
        sideB: [p3, p4],
        scoreA: "",
        scoreB: "",
      });
      courtIdx++;
    }
    rounds.push({ roundNumber: r + 1, matches, sitOut });
  }
  return rounds;
}

function generateRoundRobinRounds(teams, courtCount) {
  let arr = teams.map((t) => t.id);
  if (arr.length % 2 !== 0) arr.push("BYE");
  const n = arr.length;
  const totalRounds = n - 1;
  const rounds = [];
  let current = [...arr];

  for (let r = 0; r < totalRounds; r++) {
    const roundMatches = [];
    for (let i = 0; i < n / 2; i++) {
      const a = current[i];
      const b = current[n - 1 - i];
      if (a !== "BYE" && b !== "BYE") roundMatches.push({ a, b });
    }
    const matches = roundMatches.map((m, idx) => ({
      id: `r${r}-m${idx}`,
      court: (idx % courtCount) + 1,
      sideA: [m.a],
      sideB: [m.b],
      scoreA: "",
      scoreB: "",
    }));
    rounds.push({ roundNumber: r + 1, matches });
    current = [current[0], current[n - 1], ...current.slice(1, n - 1)];
  }
  return rounds;
}

/* Mexicano — unlike Americano's rotate-for-variety approach, pairing is
   re-computed each round from the CURRENT standings, so it's generated
   one round at a time (not upfront): within each rank-ordered group of
   4 active players, 1st+4th play together against 2nd+3rd, which keeps
   matches close instead of stacking the two best players together. */
function generateMexicanoRound(players, existingRounds, courtCount) {
  const ids = players.map((p) => p.id);
  const n = ids.length;
  const points = {};
  const playCount = {};
  ids.forEach((id) => {
    points[id] = 0;
    playCount[id] = 0;
  });

  existingRounds.forEach((round) => {
    round.matches.forEach((m) => {
      const a = Number(m.scoreA);
      const b = Number(m.scoreB);
      const hasScore = m.scoreA !== "" && m.scoreB !== "" && !isNaN(a) && !isNaN(b);
      m.sideA.forEach((pid) => {
        if (points[pid] === undefined) return;
        playCount[pid] += 1;
        if (hasScore) points[pid] += a;
      });
      m.sideB.forEach((pid) => {
        if (points[pid] === undefined) return;
        playCount[pid] += 1;
        if (hasScore) points[pid] += b;
      });
    });
  });

  const matchesThisRound = Math.min(courtCount, Math.floor(n / 4));
  const activeCount = matchesThisRound * 4;
  if (activeCount < 4) return null;

  // Sit-out fairness: whoever has played the least gets priority to play.
  const sortedByPlay = [...ids].sort((a, b) => playCount[a] - playCount[b] || Math.random() - 0.5);
  const active = sortedByPlay.slice(0, activeCount);
  const sitOut = sortedByPlay.slice(activeCount);

  // Rank the active players by current points, then chunk into groups of 4.
  const ranked = active.sort((a, b) => points[b] - points[a] || Math.random() - 0.5);

  const matches = [];
  for (let i = 0; i < matchesThisRound; i++) {
    const [r1, r2, r3, r4] = ranked.slice(i * 4, i * 4 + 4);
    matches.push({
      id: uid(),
      court: i + 1,
      sideA: [r1, r4],
      sideB: [r2, r3],
      scoreA: "",
      scoreB: "",
    });
  }

  return { matches, sitOut };
}

/* ---------------------------------------------------------
   작은 UI 조각들
--------------------------------------------------------- */
function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Oswald', sans-serif",
        letterSpacing: "0.18em",
        fontSize: 11,
        fontWeight: 600,
        color: C.ball,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function IconBtn({ onClick, children, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1px solid ${danger ? C.danger : "rgba(0,0,0,0.12)"}`,
        color: danger ? C.danger : C.charcoal,
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, children, icon: Icon, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 10,
        border: "none",
        background: disabled ? "#B8BDB2" : C.ink,
        color: disabled ? "#7A7F74" : C.ball,
        fontFamily: "'Pretendard Variable', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

/* ---------------------------------------------------------
   코트 다이어그램 매치 카드 — 시그니처 요소
--------------------------------------------------------- */
function CourtMatch({ match, nameOf, onScore, disabled }) {
  const a = Number(match.scoreA);
  const b = Number(match.scoreB);
  const hasScore = match.scoreA !== "" && match.scoreB !== "" && !isNaN(a) && !isNaN(b);
  const aWins = hasScore && a > b;
  const bWins = hasScore && b > a;

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        background: C.turf,
        border: `1px solid ${C.turfLight}`,
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
          }}
        >
          Court {match.court}
        </span>
      </div>

      <div style={{ display: "flex", position: "relative" }}>
        {/* net line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 0,
            borderLeft: `2px dashed ${C.line}`,
          }}
        />
        {[match.sideA, match.sideB].map((side, si) => {
          const isWinner = si === 0 ? aWins : bWins;
          return (
            <div
              key={si}
              style={{
                flex: 1,
                padding: "14px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                background: isWinner ? "rgba(215,241,59,0.08)" : "transparent",
              }}
            >
              {side.map((id) => (
                <div
                  key={id}
                  style={{
                    fontFamily: "'Pretendard Variable', sans-serif",
                    fontWeight: isWinner ? 700 : 500,
                    fontSize: 14,
                    color: isWinner ? C.ball : "#EDEFE8",
                    lineHeight: 1.35,
                  }}
                >
                  {nameOf(id)}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "10px 12px 14px",
        }}
      >
        <ScoreInput
          value={match.scoreA}
          onChange={(v) => onScore("scoreA", v)}
          highlight={aWins}
          disabled={disabled}
        />
        <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
          :
        </span>
        <ScoreInput
          value={match.scoreB}
          onChange={(v) => onScore("scoreB", v)}
          highlight={bWins}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

function ScoreInput({ value, onChange, highlight, disabled }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder="-"
      style={{
        width: 48,
        height: 40,
        textAlign: "center",
        borderRadius: 8,
        border: `1px solid ${highlight ? C.ball : "rgba(255,255,255,0.25)"}`,
        background: highlight ? "rgba(215,241,59,0.14)" : "rgba(255,255,255,0.06)",
        color: highlight ? C.ball : "#fff",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 17,
        outline: "none",
      }}
    />
  );
}

/* ---------------------------------------------------------
   메인 앱
--------------------------------------------------------- */
export default function PadelLeagueApp() {
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [tab, setTab] = useState("booking");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [numRounds, setNumRounds] = useState(5);
  const [editingName, setEditingName] = useState(false);
  const [venuePhotos, setVenuePhotos] = useState({});
  const [venueAmenities, setVenueAmenities] = useState({});
  const [photoUploading, setPhotoUploading] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setLeague({ venue: VENUES[0], bookings: [], resultPhoto: null, ...parsed });
        } else {
          setLeague(defaultLeague());
        }
      } catch (e) {
        setLeague(defaultLeague());
      } finally {
        setLoading(false);
      }
    })();

    (async () => {
      const photos = {};
      for (const v of VENUES) {
        try {
          const res = await window.storage.get(venuePhotoKey(v), false);
          if (res && res.value) photos[v] = res.value;
        } catch (e) {
          // no photo saved yet for this venue
        }
      }
      setVenuePhotos(photos);
    })();

    (async () => {
      const amenities = {};
      for (const v of VENUES) {
        try {
          const res = await window.storage.get(venueAmenitiesKey(v), false);
          if (res && res.value) amenities[v] = JSON.parse(res.value);
        } catch (e) {
          // no amenities saved yet for this venue
        }
      }
      setVenueAmenities(amenities);
    })();

    (async () => {
      try {
        const res = await window.storage.get(MEMBERS_KEY, false);
        if (res && res.value) setMembers(JSON.parse(res.value));
      } catch (e) {
        // no members yet
      }
      // "Who am I on this device" is deliberately local-only — it must
      // never be written through the shared backend, or one person
      // logging in would switch the identity for every visitor.
      try {
        const localId = window.localStorage?.getItem(CURRENT_MEMBER_KEY);
        if (localId) setCurrentMemberId(localId);
      } catch (e) {
        // localStorage unavailable; stays logged out
      }
    })();
  }, []);

  const [photoError, setPhotoError] = useState("");

  const uploadVenuePhoto = useCallback(async (venue, file) => {
    setPhotoUploading(true);
    setPhotoError("");
    try {
      const dataUrl = await resizeImageFile(file);
      // Show it right away — display must not depend on the save succeeding.
      setVenuePhotos((prev) => ({ ...prev, [venue]: dataUrl }));
      const res = await storageSetWithRetry(venuePhotoKey(venue), dataUrl);
      if (!res) setPhotoError("사진은 표시되지만 저장에 실패했어요. 새로고침하면 사라질 수 있어요.");
    } catch (e) {
      setPhotoError("사진을 불러오지 못했어요. 다른 파일로 시도해 주세요.");
    } finally {
      setPhotoUploading(false);
    }
  }, []);

  const setVenuePhotoUrl = useCallback(async (venue, url) => {
    setVenuePhotos((prev) => ({ ...prev, [venue]: url }));
    await storageSetWithRetry(venuePhotoKey(venue), url);
  }, []);

  const toggleVenueAmenity = useCallback(
    (venue, key) => {
      const current = venueAmenities[venue] || {};
      const next = { ...current, [key]: !current[key] };
      setVenueAmenities((prev) => ({ ...prev, [venue]: next }));
      storageSetWithRetry(venueAmenitiesKey(venue), JSON.stringify(next));
    },
    [venueAmenities]
  );

  const [resultPhotoUploading, setResultPhotoUploading] = useState(false);

  const uploadResultPhoto = useCallback(
    async (file) => {
      if (!league) return;
      setResultPhotoUploading(true);
      try {
        const dataUrl = await resizeImageFile(file, 1000);
        await persist({ ...league, resultPhoto: dataUrl });
      } catch (e) {
        // couldn't read the file
      } finally {
        setResultPhotoUploading(false);
      }
    },
    [league]
  );

  const setResultPhotoUrl = useCallback(
    (url) => {
      if (!league) return;
      persist({ ...league, resultPhoto: url });
    },
    [league]
  );

  const persistMembers = useCallback(async (next) => {
    setMembers(next);
    await storageSetWithRetry(MEMBERS_KEY, JSON.stringify(next));
  }, []);

  const loginAs = useCallback(async (memberId) => {
    setCurrentMemberId(memberId);
    try {
      window.localStorage?.setItem(CURRENT_MEMBER_KEY, memberId);
    } catch (e) {
      // best effort
    }
  }, []);

  const logout = useCallback(async () => {
    setCurrentMemberId(null);
    try {
      window.localStorage?.removeItem(CURRENT_MEMBER_KEY);
    } catch (e) {
      // best effort
    }
  }, []);

  const signUp = useCallback(
    async ({ name, phone, email, gender, level, photo }) => {
      const member = {
        id: uid(),
        name,
        phone: phone || "",
        email: email || "",
        gender: gender || "",
        level,
        photo: photo || null,
        createdAt: Date.now(),
      };
      const next = [...members, member];
      await persistMembers(next);
      await loginAs(member.id);
      if (league && !league.players.some((p) => p.id === member.id)) {
        persist({ ...league, players: [...league.players, { id: member.id, name: member.name }] });
      }
      return member;
    },
    [members, persistMembers, loginAs, league]
  );

  const updateProfilePhoto = useCallback(
    async (file) => {
      if (!currentMemberId) return;
      setProfileUploading(true);
      try {
        const dataUrl = await resizeImageFile(file, 400);
        // Update local state first so the avatar appears immediately.
        const next = members.map((m) => (m.id === currentMemberId ? { ...m, photo: dataUrl } : m));
        setMembers(next);
        await storageSetWithRetry(MEMBERS_KEY, JSON.stringify(next));
      } catch (e) {
        // couldn't read the file
      } finally {
        setProfileUploading(false);
      }
    },
    [currentMemberId, members]
  );

  const updateProfilePhotoUrl = useCallback(
    (url) => {
      if (!currentMemberId) return;
      const next = members.map((m) => (m.id === currentMemberId ? { ...m, photo: url } : m));
      persistMembers(next);
    },
    [currentMemberId, members, persistMembers]
  );

  const updateProfileLevel = useCallback(
    (level) => {
      if (!currentMemberId) return;
      const next = members.map((m) => (m.id === currentMemberId ? { ...m, level } : m));
      persistMembers(next);
    },
    [currentMemberId, members, persistMembers]
  );

  const currentMember = members.find((m) => m.id === currentMemberId) || null;

  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error

  const persist = useCallback(async (next) => {
    setLeague(next);
    setSaveStatus("saving");
    const res = await storageSetWithRetry(STORAGE_KEY, JSON.stringify(next));
    if (!res) {
      setSaveError(true);
      setSaveStatus("error");
    } else {
      setSaveError(false);
      setSaveStatus("saved");
    }
  }, []);

  const nameOf = useCallback(
    (id) => {
      if (!league) return id;
      const p = league.players.find((x) => x.id === id);
      if (p) return p.name;
      const t = league.teams.find((x) => x.id === id);
      if (t) return t.name;
      return "?";
    },
    [league]
  );

  const standings = useMemo(() => {
    if (!league) return [];
    if (league.format === "americano" || league.format === "mexicano") {
      const stats = {};
      league.players.forEach((p) => {
        stats[p.id] = { id: p.id, name: p.name, points: 0, played: 0, wins: 0 };
      });
      league.rounds.forEach((round) => {
        round.matches.forEach((m) => {
          const a = Number(m.scoreA);
          const b = Number(m.scoreB);
          if (m.scoreA === "" || m.scoreB === "" || isNaN(a) || isNaN(b)) return;
          m.sideA.forEach((pid) => {
            if (!stats[pid]) return;
            stats[pid].points += a;
            stats[pid].played += 1;
            if (a > b) stats[pid].wins += 1;
          });
          m.sideB.forEach((pid) => {
            if (!stats[pid]) return;
            stats[pid].points += b;
            stats[pid].played += 1;
            if (b > a) stats[pid].wins += 1;
          });
        });
      });
      return Object.values(stats).sort((x, y) => y.points - x.points || y.wins - x.wins);
    } else {
      const stats = {};
      league.teams.forEach((t) => {
        stats[t.id] = {
          id: t.id,
          name: t.name,
          played: 0,
          win: 0,
          loss: 0,
          pf: 0,
          pa: 0,
        };
      });
      league.rounds.forEach((round) => {
        round.matches.forEach((m) => {
          const a = Number(m.scoreA);
          const b = Number(m.scoreB);
          if (m.scoreA === "" || m.scoreB === "" || isNaN(a) || isNaN(b)) return;
          const ta = m.sideA[0];
          const tb = m.sideB[0];
          if (stats[ta]) {
            stats[ta].played += 1;
            stats[ta].pf += a;
            stats[ta].pa += b;
            if (a > b) stats[ta].win += 1;
            else stats[ta].loss += 1;
          }
          if (stats[tb]) {
            stats[tb].played += 1;
            stats[tb].pf += b;
            stats[tb].pa += a;
            if (b > a) stats[tb].win += 1;
            else stats[tb].loss += 1;
          }
        });
      });
      return Object.values(stats)
        .map((s) => ({ ...s, pts: s.win * 3, diff: s.pf - s.pa }))
        .sort((x, y) => y.pts - x.pts || y.diff - x.diff);
    }
  }, [league]);

  if (loading || !league) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: C.paper,
          fontFamily: "'Pretendard Variable', sans-serif",
          color: C.charcoal,
        }}
      >
        불러오는 중...
      </div>
    );
  }

  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (!name) return;
    persist({ ...league, players: [...league.players, { id: uid(), name }] });
    setNewPlayerName("");
  };

  const removePlayer = (id) => {
    persist({
      ...league,
      players: league.players.filter((p) => p.id !== id),
      teams: league.teams.filter((t) => !t.playerIds.includes(id)),
    });
  };

  const autoAssignTeams = () => {
    const shuffled = [...league.players].sort(() => Math.random() - 0.5);
    const teams = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const pair = [shuffled[i], shuffled[i + 1]];
      teams.push({
        id: `team-${uid()}`,
        name: pair.map((p) => p.name).join(" & "),
        playerIds: pair.map((p) => p.id),
      });
    }
    persist({ ...league, teams });
  };

  const generateSchedule = () => {
    if (league.format === "americano") {
      if (league.players.length < 4) return;
      const rounds = generateAmericanoRounds(league.players, league.courtCount, numRounds);
      persist({ ...league, rounds });
    } else if (league.format === "mexicano") {
      if (league.players.length < 4) return;
      const roundData = generateMexicanoRound(league.players, [], league.courtCount);
      if (roundData) {
        persist({ ...league, rounds: [{ roundNumber: 1, matches: roundData.matches, sitOut: roundData.sitOut }] });
      }
    } else {
      if (league.teams.length < 2) return;
      const rounds = generateRoundRobinRounds(league.teams, league.courtCount);
      persist({ ...league, rounds });
    }
    setTab("schedule");
  };

  const generateNextMexicanoRound = () => {
    if (league.players.length < 4) return;
    const roundData = generateMexicanoRound(league.players, league.rounds, league.courtCount);
    if (!roundData) return;
    const newRound = {
      roundNumber: league.rounds.length + 1,
      matches: roundData.matches,
      sitOut: roundData.sitOut,
    };
    persist({ ...league, rounds: [...league.rounds, newRound] });
  };

  const removeLastMexicanoRound = () => {
    persist({ ...league, rounds: league.rounds.slice(0, -1) });
  };

  const updateScore = (roundIdx, matchId, field, value) => {
    const rounds = league.rounds.map((round, ri) => {
      if (ri !== roundIdx) return round;
      return {
        ...round,
        matches: round.matches.map((m) => (m.id === matchId ? { ...m, [field]: value } : m)),
      };
    });
    persist({ ...league, rounds });
  };

  const setFormat = (format) => {
    if (format === league.format) return;
    persist({ ...league, format, rounds: [] });
  };

  const resetLeague = () => {
    persist(defaultLeague());
  };

  const tabs = [
    { key: "booking", label: "코트 예약", icon: Grid3x3 },
    { key: "myschedule", label: "내 일정", icon: UserCircle },
    { key: "players", label: "선수 · 팀", icon: Users },
    { key: "schedule", label: "대진표", icon: CalendarRange },
    { key: "standings", label: "순위", icon: ListOrdered },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.paper,
        fontFamily: "'Pretendard Variable', sans-serif",
        color: C.charcoal,
      }}
    >
      <style>{FONTS}</style>

      {/* Header */}
      <div style={{ background: C.ink, color: "#fff", padding: "20px 20px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Trophy size={18} color={C.ball} />
              <Eyebrow>K-PADEL ARENA MANAGER</Eyebrow>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <img
                src={BRAND_LOGO}
                alt="K-Padel Arena"
                style={{
                  width: 108,
                  height: 27,
                  objectFit: "contain",
                }}
              />
              <SaveStatus status={saveStatus} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            {editingName ? (
              <input
                autoFocus
                value={league.name}
                onChange={(e) => setLeague({ ...league, name: e.target.value })}
                onBlur={() => {
                  setEditingName(false);
                  persist(league);
                }}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${C.ball}`,
                  color: "#fff",
                  outline: "none",
                  padding: "2px 0",
                }}
              />
            ) : (
              <h1
                onClick={() => setEditingName(true)}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                  cursor: "text",
                }}
              >
                {league.name}
              </h1>
            )}
          </div>

          <div style={{ marginTop: 10 }}>
            <VenueSelect value={league.venue} onChange={(v) => persist({ ...league, venue: v })} />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
            <FormatPill
              active={league.format === "americano"}
              onClick={() => setFormat("americano")}
              label="아메리카노 · 개인전"
            />
            <FormatPill
              active={league.format === "mexicano"}
              onClick={() => setFormat("mexicano")}
              label="멕시카노 · 개인전"
            />
            <FormatPill
              active={league.format === "round_robin"}
              onClick={() => setFormat("round_robin")}
              label="라운드로빈 · 팀전"
            />
            <CourtStepper
              value={league.courtCount}
              onChange={(v) => persist({ ...league, courtCount: v })}
            />
            <div style={{ flex: 1 }} />
            {currentMember ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 10px 5px 5px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {currentMember.photo ? (
                  <img
                    src={currentMember.photo}
                    alt={currentMember.name}
                    style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <UserCircle size={22} color="rgba(255,255,255,0.7)" />
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{currentMember.name}</span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.ball,
                  }}
                >
                  Lv.{currentMember.level.toFixed(1)}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: `1px solid ${C.ball}`,
                  background: "transparent",
                  color: C.ball,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                회원가입 · 로그인
              </button>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, marginTop: 20, overflowX: "auto" }}>
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "8px 10px",
                    background: "transparent",
                    border: "none",
                    borderBottom: `2px solid ${active ? C.ball : "transparent"}`,
                    color: active ? C.ball : "rgba(255,255,255,0.55)",
                    fontFamily: "'Pretendard Variable', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px 80px" }}>
        {tab === "booking" && (
          <BookingTab
            league={league}
            persist={persist}
            venuePhotos={venuePhotos}
            onUploadPhoto={uploadVenuePhoto}
            onSetPhotoUrl={setVenuePhotoUrl}
            photoUploading={photoUploading}
            photoError={photoError}
            venueAmenities={venueAmenities}
            onToggleAmenity={toggleVenueAmenity}
          />
        )}

        {tab === "myschedule" && (
          <MyScheduleTab league={league} currentMember={currentMember} onOpenAuth={() => setAuthModalOpen(true)} />
        )}

        {tab === "players" && (
          <PlayersTab
            league={league}
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
            addPlayer={addPlayer}
            removePlayer={removePlayer}
            autoAssignTeams={autoAssignTeams}
          />
        )}

        {tab === "schedule" && (
          <ScheduleTab
            league={league}
            numRounds={numRounds}
            setNumRounds={setNumRounds}
            generateSchedule={generateSchedule}
            updateScore={updateScore}
            nameOf={nameOf}
            onGenerateNextMexicanoRound={generateNextMexicanoRound}
            onRemoveLastMexicanoRound={removeLastMexicanoRound}
          />
        )}

        {tab === "standings" && (
          <StandingsTab
            league={league}
            standings={standings}
            onUploadResultPhoto={uploadResultPhoto}
            onSetResultPhotoUrl={setResultPhotoUrl}
            resultPhotoUploading={resultPhotoUploading}
          />
        )}

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={() => {
              if (window.confirm("현재 리그 데이터를 모두 지우고 새로 시작할까요?")) resetLeague();
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(27,36,34,0.45)",
              fontSize: 12,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            새 리그로 초기화
          </button>
          {saveError && (
            <div style={{ marginTop: 8, fontSize: 12, color: C.danger }}>
              저장에 실패했어요. 네트워크를 확인하고 다시 시도해 주세요.
            </div>
          )}
        </div>
      </div>

      {authModalOpen && (
        <AuthModal
          members={members}
          currentMember={currentMember}
          onLogin={loginAs}
          onLogout={logout}
          onSignUp={signUp}
          onUploadProfilePhoto={updateProfilePhoto}
          onSetProfilePhotoUrl={updateProfilePhotoUrl}
          onUpdateLevel={updateProfileLevel}
          profileUploading={profileUploading}
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

function PhotoUploadField({ label, onFile, uploading, style }) {
  return (
    <label
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.4)",
        background: "rgba(16,21,26,0.5)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: uploading ? "wait" : "pointer",
        overflow: "hidden",
        ...style,
      }}
    >
      {uploading ? "업로드 중..." : label}
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: uploading ? "wait" : "pointer",
        }}
      />
    </label>
  );
}

function DropZone({ onFile, children, style }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) onFile(file);
      }}
      style={{
        outline: hover ? `2px dashed ${C.ball}` : "none",
        outlineOffset: -4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* PhotoInput — file-picker button + a guaranteed-to-work URL fallback,
   since native file dialogs can be unreliable inside sandboxed frames. */
function PhotoInput({ label, uploading, onFile, onSetUrl, dark }) {
  const [showUrl, setShowUrl] = useState(false);
  const [urlVal, setUrlVal] = useState("");
  const linkColor = dark ? "rgba(255,255,255,0.75)" : "rgba(27,36,34,0.55)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <PhotoUploadField
          label={label}
          uploading={uploading}
          onFile={onFile}
          style={
            dark
              ? undefined
              : { border: "1px solid rgba(0,0,0,0.15)", background: "transparent", color: C.charcoal }
          }
        />
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          style={{
            background: "none",
            border: "none",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 11,
            color: linkColor,
          }}
        >
          {showUrl ? "취소" : "URL로 추가"}
        </button>
      </div>
      {showUrl && (
        <div style={{ display: "flex", gap: 4, width: "100%" }}>
          <input
            value={urlVal}
            onChange={(e) => setUrlVal(e.target.value)}
            placeholder="이미지 URL 붙여넣기"
            style={{
              flex: 1,
              fontSize: 12,
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.2)",
            }}
          />
          <button
            onClick={() => {
              if (urlVal.trim()) {
                onSetUrl(urlVal.trim());
                setUrlVal("");
                setShowUrl(false);
              }
            }}
            style={{
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 6,
              border: "none",
              background: C.turf,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            적용
          </button>
        </div>
      )}
    </div>
  );
}

function LevelSlider({ value, onChange }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>레벨 (0.0 ~ 7.0)</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: C.turf }}>
          {value.toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={LEVEL_MIN}
        max={LEVEL_MAX}
        step={LEVEL_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", marginTop: 8, accentColor: C.turf }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(27,36,34,0.4)" }}>
        <span>0.0 · 입문</span>
        <span>7.0 · 프로</span>
      </div>
    </div>
  );
}

function AuthModal({
  members,
  currentMember,
  onLogin,
  onLogout,
  onSignUp,
  onUploadProfilePhoto,
  onSetProfilePhotoUrl,
  onUpdateLevel,
  profileUploading,
  onClose,
}) {
  const [mode, setMode] = useState(currentMember ? "profile" : members.length ? "login" : "signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState(3.0);
  const [signupPhoto, setSignupPhoto] = useState(null);

  const submitSignUp = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onSignUp({ name: trimmed, phone, email, gender, level, photo: signupPhoto });
    setMode("profile");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16,21,26,0.55)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: "18px 18px 0 0",
          padding: 20,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Eyebrow>
            {mode === "profile" ? "내 프로필" : mode === "login" ? "로그인" : "회원가입"}
          </Eyebrow>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} color={C.charcoal} />
          </button>
        </div>

        {mode === "profile" && currentMember && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative" }}>
                {currentMember.photo ? (
                  <img
                    src={currentMember.photo}
                    alt={currentMember.name}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: C.paperDim,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserCircle size={34} color="rgba(27,36,34,0.4)" />
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{currentMember.name}</div>
                <div style={{ fontSize: 12, color: "rgba(27,36,34,0.5)" }}>
                  Lv.{currentMember.level.toFixed(1)}
                  {currentMember.phone ? ` · ${currentMember.phone}` : ""}
                  {currentMember.email ? ` · ${currentMember.email}` : ""}
                </div>
              </div>
            </div>

            <PhotoInput
              label={currentMember.photo ? "프로필 사진 교체" : "프로필 사진 추가"}
              uploading={profileUploading}
              onFile={onUploadProfilePhoto}
              onSetUrl={onSetProfilePhotoUrl}
            />

            <LevelSlider value={currentMember.level} onChange={onUpdateLevel} />

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {members.length > 1 && (
                <PrimaryButton
                  onClick={() => setMode("login")}
                  style={{ background: "transparent", color: C.charcoal, border: "1px solid rgba(0,0,0,0.15)" }}
                >
                  다른 계정으로
                </PrimaryButton>
              )}
              <PrimaryButton onClick={onLogout} icon={LogOut} style={{ background: C.danger, color: "#fff" }}>
                로그아웃
              </PrimaryButton>
            </div>
          </div>
        )}

        {mode === "login" && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {members.length === 0 ? (
              <EmptyHint text="등록된 회원이 없어요. 먼저 회원가입을 해주세요." />
            ) : (
              members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onLogin(m.id);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <UserCircle size={28} color="rgba(27,36,34,0.4)" />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</span>
                  <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(27,36,34,0.5)" }}>
                    Lv.{m.level.toFixed(1)}
                  </span>
                </button>
              ))
            )}
            <button
              onClick={() => setMode("signup")}
              style={{ marginTop: 8, background: "none", border: "none", color: C.turf, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              + 새 회원가입
            </button>
          </div>
        )}

        {mode === "signup" && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {signupPhoto ? (
                <img src={signupPhoto} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: C.paperDim,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserCircle size={30} color="rgba(27,36,34,0.4)" />
                </div>
              )}
              <PhotoInput
                label="프로필 사진"
                uploading={false}
                onFile={async (file) => {
                  try {
                    const dataUrl = await resizeImageFile(file, 400);
                    setSignupPhoto(dataUrl);
                  } catch (e) {
                    // couldn't read the file
                  }
                }}
                onSetUrl={(url) => setSignupPhoto(url)}
              />
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 14 }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "male", label: "Male" },
                { key: "female", label: "Female" },
              ].map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setGender(g.key)}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: `1px solid ${gender === g.key ? C.turf : "rgba(0,0,0,0.15)"}`,
                    background: gender === g.key ? C.turf : "transparent",
                    color: gender === g.key ? "#fff" : C.charcoal,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 (선택)"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 14 }}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="연락처 (선택)"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", fontSize: 14 }}
            />
            <LevelSlider value={level} onChange={setLevel} />

            <PrimaryButton onClick={submitSignUp} icon={UserPlus} disabled={!name.trim()}>
              가입하기
            </PrimaryButton>
            {members.length > 0 && (
              <button
                onClick={() => setMode("login")}
                style={{ background: "none", border: "none", color: "rgba(27,36,34,0.5)", fontSize: 13, cursor: "pointer" }}
              >
                이미 계정이 있어요
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MyScheduleTab({ league, currentMember, onOpenAuth }) {
  if (!currentMember) {
    return (
      <SectionCard>
        <Eyebrow>내 일정</Eyebrow>
        <EmptyHint text="회원가입 또는 로그인을 하면 내가 예약한 코트와 경기 일정을 모아볼 수 있어요." />
        <div style={{ marginTop: 12 }}>
          <PrimaryButton onClick={onOpenAuth}>회원가입 · 로그인</PrimaryButton>
        </div>
      </SectionCard>
    );
  }

  const myBookings = (league.bookings || [])
    .filter((b) => b.players.some((p) => p.id === currentMember.id || p.name === currentMember.name))
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const myMatches = [];
  league.rounds.forEach((round) => {
    round.matches.forEach((m) => {
      const inA = m.sideA.includes(currentMember.id);
      const inB = m.sideB.includes(currentMember.id);
      const inTeamA = league.teams.some((t) => t.id === m.sideA[0] && t.playerIds.includes(currentMember.id));
      const inTeamB = league.teams.some((t) => t.id === m.sideB[0] && t.playerIds.includes(currentMember.id));
      if (inA || inB || inTeamA || inTeamB) {
        myMatches.push({ ...m, roundNumber: round.roundNumber, mySide: inA || inTeamA ? "A" : "B" });
      }
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionCard>
        <Eyebrow>내 코트 예약</Eyebrow>
        {myBookings.length === 0 ? (
          <EmptyHint text="예약한 코트가 없어요. 코트 예약 탭에서 참여해 보세요." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {myBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: C.paperDim,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {b.date} · {b.time}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(27,36,34,0.55)" }}>
                    {b.venue} · 코트 {b.court}
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: categoryOf(b.category).color,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {categoryOf(b.category).label}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <Eyebrow>내 경기 일정</Eyebrow>
        {myMatches.length === 0 ? (
          <EmptyHint text="예정된 리그 경기가 없어요. 대진표를 생성하면 여기에 표시돼요." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {myMatches.map((m) => {
              const a = Number(m.scoreA);
              const b = Number(m.scoreB);
              const played = m.scoreA !== "" && m.scoreB !== "" && !isNaN(a) && !isNaN(b);
              const opponents = (m.mySide === "A" ? m.sideB : m.sideA)
                .map((id) => league.players.find((p) => p.id === id)?.name || league.teams.find((t) => t.id === id)?.name || "?")
                .join(" & ");
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: C.paperDim,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>ROUND {m.roundNumber} · 코트 {m.court}</div>
                    <div style={{ fontSize: 12, color: "rgba(27,36,34,0.55)" }}>vs {opponents}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      fontSize: 14,
                      color: played ? C.turf : "rgba(27,36,34,0.35)",
                    }}
                  >
                    {played ? `${m.scoreA} : ${m.scoreB}` : "예정"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function SaveStatus({ status }) {
  const map = {
    idle: { dot: "rgba(255,255,255,0.3)", label: "" },
    saving: { dot: C.ball, label: "저장 중" },
    saved: { dot: C.ball, label: "실시간 저장됨" },
    error: { dot: C.danger, label: "저장 실패" },
  };
  const s = map[status] || map.idle;
  if (!s.label) return <div />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
        }}
      />
      {s.label}
    </div>
  );
}

function FormatPill({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? C.ball : "rgba(255,255,255,0.25)"}`,
        background: active ? "rgba(215,241,59,0.12)" : "transparent",
        color: active ? C.ball : "rgba(255,255,255,0.65)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function VenueSelect({ value, onChange }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          border: `1px solid ${C.glass}`,
          borderRadius: 999,
          color: "#fff",
          padding: "6px 30px 6px 12px",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Pretendard Variable', sans-serif",
          cursor: "pointer",
        }}
      >
        {VENUES.map((v) => (
          <option key={v} value={v} style={{ color: C.charcoal }}>
            {v}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        color="rgba(255,255,255,0.65)"
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
    </div>
  );
}

function CourtStepper({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      <Settings2 size={13} color="rgba(255,255,255,0.6)" />
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>코트</span>
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        style={{ background: "none", border: "none", color: C.ball, fontSize: 16, cursor: "pointer", width: 18 }}
      >
        −
      </button>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#fff", width: 14, textAlign: "center" }}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(8, value + 1))}
        style={{ background: "none", border: "none", color: C.ball, fontSize: 16, cursor: "pointer", width: 18 }}
      >
        +
      </button>
    </div>
  );
}

function SectionCard({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        padding: 18,
      }}
    >
      {children}
    </div>
  );
}

function BookingTab({
  league,
  persist,
  venuePhotos,
  onUploadPhoto,
  onSetPhotoUrl,
  photoUploading,
  photoError,
  venueAmenities,
  onToggleAmenity,
}) {
  const days = useMemo(() => nextDays(7), []);
  const [selectedDate, setSelectedDate] = useState(days[0].iso);
  const [activeSlot, setActiveSlot] = useState(null); // { date, time, court }
  const [joinPlayerId, setJoinPlayerId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [duration, setDuration] = useState(1);

  const findBooking = (date, time, court) =>
    (league.bookings || []).find(
      (b) => b.venue === league.venue && b.date === date && b.time === time && b.court === court
    );

  const availableDurations = (date, court, time) => {
    const startIdx = TIME_SLOTS.indexOf(time);
    const out = [];
    for (let d = 1; d <= 3; d++) {
      const endIdx = startIdx + d - 1;
      if (endIdx > TIME_SLOTS.length - 1) break;
      let ok = true;
      for (let k = 0; k < d; k++) {
        if (findBooking(date, TIME_SLOTS[startIdx + k], court)) {
          ok = false;
          break;
        }
      }
      if (ok) out.push(d);
      else break;
    }
    return out.length ? out : [1];
  };

  const openSlot = (date, time, court) => {
    const existing = findBooking(date, time, court);
    setActiveSlot({ date, time, court });
    setJoinPlayerId(league.players[0]?.id || "");
    setGuestName("");
    setCategory(existing ? existing.category : CATEGORIES[0].key);
    setDuration(1);
  };

  const closeModal = () => setActiveSlot(null);

  const joinSlot = () => {
    if (!activeSlot) return;
    const name = guestName.trim() || league.players.find((p) => p.id === joinPlayerId)?.name;
    if (!name) return;
    const { date, time, court } = activeSlot;
    const existing = findBooking(date, time, court);
    const participant = { id: uid(), name };

    let bookings;
    if (existing) {
      if (existing.players.length >= BOOKING_SLOTS_PER_MATCH) return;
      const groupId = existing.groupId;
      bookings = league.bookings.map((b) =>
        (groupId ? b.groupId === groupId : b === existing) ? { ...b, players: [...b.players, participant] } : b
      );
    } else {
      const startIdx = TIME_SLOTS.indexOf(time);
      const groupId = uid();
      const newSlots = Array.from({ length: duration }, (_, k) => ({
        id: uid(),
        groupId,
        venue: league.venue,
        date,
        time: TIME_SLOTS[startIdx + k],
        court,
        category,
        durationHours: duration,
        players: [participant],
      }));
      bookings = [...(league.bookings || []), ...newSlots];
    }
    persist({ ...league, bookings });
    setGuestName("");
    setJoinPlayerId(league.players[0]?.id || "");
  };

  const removeParticipant = (participantId) => {
    if (!activeSlot) return;
    const { date, time, court } = activeSlot;
    const existing = findBooking(date, time, court);
    if (!existing) return;
    const groupId = existing.groupId;
    const inGroup = (b) => (groupId ? b.groupId === groupId : b === existing);
    const players = existing.players.filter((p) => p.id !== participantId);
    const bookings =
      players.length === 0
        ? league.bookings.filter((b) => !inGroup(b))
        : league.bookings.map((b) => (inGroup(b) ? { ...b, players } : b));
    persist({ ...league, bookings });
  };


  const courts = Array.from({ length: league.courtCount }, (_, i) => i + 1);
  const activeBooking = activeSlot && findBooking(activeSlot.date, activeSlot.time, activeSlot.court);
  const photo = venuePhotos?.[league.venue];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          position: "relative",
          height: 140,
          borderRadius: 16,
          overflow: "hidden",
          background: photo ? `#000` : `linear-gradient(135deg, ${C.turf}, ${C.ink})`,
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt={league.venue}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />
        ) : (
          <CourtWatermark />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.55))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 14,
          }}
        >
          <Eyebrow>{league.venue}</Eyebrow>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <PhotoInput
              label={photo ? "사진 교체" : "사진 추가"}
              uploading={photoUploading}
              onFile={(file) => onUploadPhoto(league.venue, file)}
              onSetUrl={(url) => onSetPhotoUrl(league.venue, url)}
              dark
            />
          </div>
        </div>
      </div>

      {photoError && (
        <div
          style={{
            fontSize: 12,
            color: C.danger,
            background: "rgba(194,84,80,0.08)",
            border: `1px solid ${C.danger}`,
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          {photoError}
        </div>
      )}

      <SectionCard>
        <Eyebrow>편의시설</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {AMENITIES.map((a) => {
            const active = !!venueAmenities?.[league.venue]?.[a.key];
            return (
              <button
                key={a.key}
                onClick={() => onToggleAmenity(league.venue, a.key)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: `1px solid ${active ? C.turf : "rgba(0,0,0,0.15)"}`,
                  background: active ? C.turf : "transparent",
                  color: active ? "#fff" : "rgba(27,36,34,0.5)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {active ? "✓ " : ""}
                {a.label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard>
        <Eyebrow>날짜 선택</Eyebrow>
        <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
          {days.map((d) => (
            <button
              key={d.iso}
              onClick={() => setSelectedDate(d.iso)}
              style={{
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "8px 14px",
                borderRadius: 12,
                border: `1px solid ${selectedDate === d.iso ? C.turf : "rgba(0,0,0,0.12)"}`,
                background: selectedDate === d.iso ? C.turf : "#fff",
                color: selectedDate === d.iso ? "#fff" : C.charcoal,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>
                {d.isToday ? "오늘" : d.weekday}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 14 }}>
                {d.label}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap", fontSize: 12, color: "rgba(27,36,34,0.6)" }}>
          <LegendDot color="#fff" border="rgba(0,0,0,0.2)" label="예약 가능" />
          <LegendDot color="#D6E6FB" border="#7FA6E0" label="일부 예약 (참여 가능)" />
          <LegendDot color="#3E6FD9" border="#3E6FD9" label="마감" />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap", fontSize: 12, color: "rgba(27,36,34,0.6)" }}>
          {CATEGORIES.map((c) => (
            <LegendDot key={c.key} color={c.color} border={c.color} label={c.label} />
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `64px repeat(${courts.length}, minmax(96px, 1fr))`,
              gap: 6,
              minWidth: 64 + courts.length * 96,
            }}
          >
            <div />
            {courts.map((c) => (
              <CourtHeaderCell key={c} court={c} />
            ))}

            {TIME_SLOTS.map((time) => (
              <React.Fragment key={time}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(27,36,34,0.6)",
                  }}
                >
                  {time}
                </div>
                {courts.map((court) => {
                  const booking = findBooking(selectedDate, time, court);
                  return (
                    <BookingCell
                      key={court}
                      booking={booking}
                      onClick={() => openSlot(selectedDate, time, court)}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </SectionCard>

      {activeSlot && (
        <JoinModal
          slot={activeSlot}
          booking={activeBooking}
          players={league.players}
          joinPlayerId={joinPlayerId}
          setJoinPlayerId={setJoinPlayerId}
          guestName={guestName}
          setGuestName={setGuestName}
          category={category}
          setCategory={setCategory}
          duration={duration}
          setDuration={setDuration}
          availableDurations={availableDurations(activeSlot.date, activeSlot.court, activeSlot.time)}
          onJoin={joinSlot}
          onRemove={removeParticipant}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function CourtWatermark() {
  return (
    <svg
      viewBox="0 0 200 120"
      style={{ position: "absolute", right: -14, bottom: -22, width: 200, opacity: 0.14 }}
    >
      <rect x="10" y="10" width="180" height="100" rx="8" fill="none" stroke="white" strokeWidth="4" />
      <line x1="100" y1="10" x2="100" y2="110" stroke="white" strokeWidth="3" strokeDasharray="6 6" />
      <rect x="10" y="40" width="45" height="40" fill="none" stroke="white" strokeWidth="3" />
      <rect x="145" y="40" width="45" height="40" fill="none" stroke="white" strokeWidth="3" />
    </svg>
  );
}

function CourtHeaderCell({ court }) {
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "'Oswald', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "rgba(27,36,34,0.6)",
        padding: "4px 0",
      }}
    >
      코트 {court}
    </div>
  );
}

function LegendDot({ color, border, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 4,
          background: color,
          border: `1px solid ${border}`,
          display: "inline-block",
        }}
      />
      {label}
    </div>
  );
}

function BookingCell({ booking, onClick }) {
  const count = booking ? booking.players.length : 0;
  const full = count >= BOOKING_SLOTS_PER_MATCH;
  const empty = count === 0;
  const cat = booking ? categoryOf(booking.category) : null;

  const bg = empty ? "#fff" : full ? "#3E6FD9" : "#D6E6FB";
  const border = empty ? "rgba(0,0,0,0.15)" : full ? "#3E6FD9" : "#7FA6E0";
  const textColor = full ? "#fff" : C.charcoal;

  return (
    <button
      onClick={onClick}
      style={{
        height: 56,
        borderRadius: 10,
        border: `1px solid ${border}`,
        background: bg,
        color: textColor,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 4,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700 }}>
        {empty ? "예약 가능" : full ? "마감" : `${BOOKING_SLOTS_PER_MATCH - count}자리 남음`}
      </span>
      {!empty && (
        <span style={{ fontSize: 10, opacity: 0.85, fontFamily: "'JetBrains Mono', monospace" }}>
          {count}/{BOOKING_SLOTS_PER_MATCH}
        </span>
      )}
      {cat && (
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, display: "inline-block" }} />
          {cat.label}
        </span>
      )}
    </button>
  );
}

function JoinModal({
  slot,
  booking,
  players,
  joinPlayerId,
  setJoinPlayerId,
  guestName,
  setGuestName,
  category,
  setCategory,
  duration,
  setDuration,
  availableDurations,
  onJoin,
  onRemove,
  onClose,
}) {
  const count = booking ? booking.players.length : 0;
  const full = count >= BOOKING_SLOTS_PER_MATCH;
  const isNewBooking = !booking;
  const endTime = (() => {
    const idx = TIME_SLOTS.indexOf(slot.time);
    const endIdx = Math.min(idx + duration, TIME_SLOTS.length - 1);
    return TIME_SLOTS[endIdx] || slot.time;
  })();

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(16,21,26,0.55)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderRadius: "18px 18px 0 0",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Eyebrow>
              {slot.date} · {slot.time}
              {isNewBooking && duration > 1 ? ` – ${endTime}` : ""}
            </Eyebrow>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700, marginTop: 4 }}>
              코트 {slot.court}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} color={C.charcoal} />
          </button>
        </div>

        {isNewBooking && (
          <div style={{ marginTop: 14 }}>
            <Eyebrow>예약 시간</Eyebrow>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {[1, 2, 3].map((d) => {
                const disabled = !availableDurations.includes(d);
                const active = duration === d;
                return (
                  <button
                    key={d}
                    disabled={disabled}
                    onClick={() => setDuration(d)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: `1px solid ${active ? C.turf : "rgba(0,0,0,0.15)"}`,
                      background: active ? C.turf : disabled ? "#F1F1EC" : "transparent",
                      color: active ? "#fff" : disabled ? "rgba(0,0,0,0.3)" : C.charcoal,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {d}시간
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          {isNewBooking ? (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: `1px solid ${category === c.key ? c.color : "rgba(0,0,0,0.15)"}`,
                    background: category === c.key ? c.color : "transparent",
                    color: category === c.key ? "#fff" : C.charcoal,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                background: categoryOf(booking.category).color,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {categoryOf(booking.category).label}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: BOOKING_SLOTS_PER_MATCH }, (_, i) => {
            const p = booking?.players[i];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: p ? C.paperDim : "transparent",
                  border: p ? "none" : "1px dashed rgba(0,0,0,0.2)",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: p ? 700 : 500, color: p ? C.charcoal : "rgba(27,36,34,0.4)" }}>
                  {p ? p.name : `빈 자리 ${i + 1}`}
                </span>
                {p && (
                  <button
                    onClick={() => onRemove(p.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(27,36,34,0.4)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {!full && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <Eyebrow>참여하기</Eyebrow>
            {players.length > 0 && (
              <select
                value={joinPlayerId}
                onChange={(e) => {
                  setJoinPlayerId(e.target.value);
                  setGuestName("");
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.15)",
                  fontSize: 14,
                }}
              >
                <option value="">등록된 선수 선택</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
            <input
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setJoinPlayerId("");
              }}
              placeholder="또는 이름 직접 입력 (게스트)"
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
                fontSize: 14,
              }}
            />
            <PrimaryButton onClick={onJoin} icon={UserPlus}>
              {isNewBooking ? "예약하기" : "이 시간에 참여"}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayersTab({ league, newPlayerName, setNewPlayerName, addPlayer, removePlayer, autoAssignTeams }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionCard>
        <Eyebrow>선수 등록</Eyebrow>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="이름 입력"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.15)",
              fontSize: 14,
              outline: "none",
            }}
          />
          <PrimaryButton onClick={addPlayer} icon={Plus}>
            추가
          </PrimaryButton>
        </div>

        {league.players.length === 0 ? (
          <EmptyHint text="선수를 4명 이상 등록하면 대진표를 만들 수 있어요." />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {league.players.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 8px 6px 12px",
                  borderRadius: 999,
                  background: C.paperDim,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {p.name}
                <button
                  onClick={() => removePlayer(p.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "rgba(27,36,34,0.5)" }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 10, fontSize: 12, color: "rgba(27,36,34,0.5)" }}>
          총 {league.players.length}명 등록됨
        </div>
      </SectionCard>

      {league.format === "round_robin" && (
        <SectionCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Eyebrow>팀 편성</Eyebrow>
            <PrimaryButton onClick={autoAssignTeams} icon={Shuffle} disabled={league.players.length < 2}>
              자동 팀 편성
            </PrimaryButton>
          </div>
          {league.teams.length === 0 ? (
            <EmptyHint text="선수를 등록한 뒤 자동 팀 편성을 눌러 2인 1팀으로 묶어주세요." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              {league.teams.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: C.paperDim,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(27,36,34,0.5)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}

function ScheduleTab({
  league,
  numRounds,
  setNumRounds,
  generateSchedule,
  updateScore,
  nameOf,
  onGenerateNextMexicanoRound,
  onRemoveLastMexicanoRound,
}) {
  const isMexicano = league.format === "mexicano";
  const isAmericano = league.format === "americano";
  const canGenerate = isAmericano || isMexicano ? league.players.length >= 4 : league.teams.length >= 2;

  const formatDescription = isAmericano
    ? "매 라운드 파트너가 바뀌는 아메리카노 방식이에요."
    : isMexicano
    ? "매 라운드 현재 순위 기준으로 짝을 다시 맞추는 멕시카노 방식이에요."
    : "고정된 팀끼리 한 번씩 맞붙는 라운드로빈 방식이에요.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionCard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <Eyebrow>대진표 생성</Eyebrow>
            <div style={{ fontSize: 12, color: "rgba(27,36,34,0.55)", marginTop: 4 }}>{formatDescription}</div>
          </div>
          {isAmericano && (
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              라운드 수
              <input
                type="number"
                min={1}
                max={20}
                value={numRounds}
                onChange={(e) => setNumRounds(Number(e.target.value) || 1)}
                style={{
                  width: 52,
                  padding: "6px 8px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.15)",
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: "center",
                }}
              />
            </label>
          )}
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {isMexicano ? (
            <>
              <PrimaryButton
                onClick={league.rounds.length === 0 ? generateSchedule : onGenerateNextMexicanoRound}
                icon={RefreshCw}
                disabled={!canGenerate}
              >
                {league.rounds.length === 0 ? "1라운드 생성" : "다음 라운드 생성"}
              </PrimaryButton>
              {league.rounds.length > 0 && (
                <PrimaryButton
                  onClick={onRemoveLastMexicanoRound}
                  style={{ background: "transparent", color: C.danger, border: `1px solid ${C.danger}` }}
                >
                  마지막 라운드 취소
                </PrimaryButton>
              )}
            </>
          ) : (
            <PrimaryButton onClick={generateSchedule} icon={RefreshCw} disabled={!canGenerate}>
              {league.rounds.length > 0 ? "대진표 다시 생성" : "대진표 생성"}
            </PrimaryButton>
          )}
        </div>

        {isMexicano && league.rounds.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(27,36,34,0.5)" }}>
            다음 라운드는 지금까지 입력된 점수를 기준으로 순위를 다시 계산해 짝을 맞춰요. 이번 라운드 점수를 먼저 입력하세요.
          </div>
        )}

        {!canGenerate && (
          <div style={{ marginTop: 10, fontSize: 12, color: "rgba(27,36,34,0.5)" }}>
            {isAmericano || isMexicano
              ? "선수 · 팀 탭에서 4명 이상 등록해 주세요."
              : "선수 · 팀 탭에서 팀을 2개 이상 편성해 주세요."}
          </div>
        )}
      </SectionCard>

      {league.rounds.length === 0 ? (
        <EmptyHint text="아직 생성된 라운드가 없어요." />
      ) : (
        league.rounds.map((round, ri) => (
          <div key={round.roundNumber}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 700 }}>
                ROUND {round.roundNumber}
              </span>
              {round.sitOut && round.sitOut.length > 0 && (
                <span style={{ fontSize: 12, color: "rgba(27,36,34,0.5)" }}>
                  대기: {round.sitOut.map((id) => nameOf(id)).join(", ")}
                </span>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {round.matches.map((m) => (
                <CourtMatch
                  key={m.id}
                  match={m}
                  nameOf={nameOf}
                  onScore={(field, value) => updateScore(ri, m.id, field, value)}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StandingsTab({ league, standings, onUploadResultPhoto, onSetResultPhotoUrl, resultPhotoUploading }) {
  const isIndividual = league.format === "americano" || league.format === "mexicano";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionCard>
        <Eyebrow>결과 사진</Eyebrow>
        {league.resultPhoto && (
          <img
            src={league.resultPhoto}
            alt="경기 결과"
            style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12, marginTop: 10 }}
          />
        )}
        <div style={{ marginTop: 10 }}>
          <PhotoInput
            label={league.resultPhoto ? "사진 교체" : "사진 추가"}
            uploading={resultPhotoUploading}
            onFile={onUploadResultPhoto}
            onSetUrl={onSetResultPhotoUrl}
          />
        </div>
      </SectionCard>

      {standings.length === 0 ? (
        <EmptyHint text="아직 순위 데이터가 없어요. 대진표에서 경기 결과를 입력해 주세요." />
      ) : (
        <SectionCard>
          <Eyebrow>{league.name} · 순위</Eyebrow>
          <div style={{ marginTop: 14, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.ink}` }}>
                  <Th align="left">#</Th>
                  <Th align="left">{isIndividual ? "선수" : "팀"}</Th>
                  {isIndividual ? (
                    <>
                      <Th>경기</Th>
                      <Th>승</Th>
                      <Th>포인트</Th>
                    </>
                  ) : (
                    <>
                      <Th>경기</Th>
                      <Th>승</Th>
                      <Th>패</Th>
                      <Th>득실차</Th>
                      <Th>승점</Th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {standings.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                      background: i < 3 ? "rgba(215,241,59,0.15)" : "transparent",
                    }}
                  >
                    <Td>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          color: i === 0 ? C.turf : C.charcoal,
                        }}
                      >
                        {i + 1}
                      </span>
                    </Td>
                    <Td align="left">
                      <span style={{ fontWeight: 700 }}>{s.name}</span>
                    </Td>
                    {isIndividual ? (
                      <>
                        <Td>{s.played}</Td>
                        <Td>{s.wins}</Td>
                        <Td>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                            {s.points}
                          </span>
                        </Td>
                      </>
                    ) : (
                      <>
                        <Td>{s.played}</Td>
                        <Td>{s.win}</Td>
                        <Td>{s.loss}</Td>
                        <Td>{s.diff > 0 ? `+${s.diff}` : s.diff}</Td>
                        <Td>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                        {s.pts}
                      </span>
                    </Td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
      )}
    </div>
  );
}

function Th({ children, align = "center" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "8px 6px",
        fontSize: 11,
        letterSpacing: "0.06em",
        color: "rgba(27,36,34,0.55)",
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "center" }) {
  return (
    <td style={{ textAlign: align, padding: "10px 6px" }}>{children}</td>
  );
}

function EmptyHint({ text }) {
  return (
    <div
      style={{
        marginTop: 14,
        padding: "16px",
        borderRadius: 10,
        border: "1px dashed rgba(0,0,0,0.15)",
        fontSize: 13,
        color: "rgba(27,36,34,0.55)",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
}
