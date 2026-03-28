import React, { useEffect, useState } from "react";

export default function MinecraftServerWebsite() {
  const serverIp = "bucksmp.dat.gg";
  const trackerHost = serverIp;
  const statusHost = encodeURIComponent(trackerHost.trim().toLowerCase());

  const screenshots = [
    "/season7-1.png",
    "/season7-2.png",
    "/season7-3.png",
    "/season7-4.png",
  ];

  const staff = [
    { name: "Leon", role: "Owner" },
    { name: "evie_spellx", role: "Admin" },
    { name: "MinkWho", role: "Mod" },
    { name: "airskate", role: "Mod" },
    { name: "justtom0123", role: "Admin" },
  ];

  const [isVisible, setIsVisible] = useState(false);
  const [serverData, setServerData] = useState({
    online: null,
    playersOnline: 0,
    maxPlayers: 0,
    playerList: [],
    motd: "Checking server status...",
    copyMessage: "",
    lastUpdated: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchStatus() {
      const endpoints = [
        `https://api.mcsrvstat.us/3/${statusHost}`,
        `https://api.mcsrvstat.us/3/java/${statusHost}`,
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (!response.ok) continue;

          const data = await response.json();
          if (!active) return;

          const isOnline = data.online === true;
          const playersOnline = isOnline ? Number(data.players?.online ?? 0) : 0;
          const maxPlayers = isOnline ? Number(data.players?.max ?? 0) : 0;

          const rawPlayers = isOnline
            ? Array.isArray(data.players?.list)
              ? data.players.list
              : Array.isArray(data.players?.sample)
                ? data.players.sample
                : []
            : [];

          const playerList = rawPlayers
            .map((player) => {
              if (typeof player === "string") return player;
              if (player && typeof player === "object") {
                if (typeof player.name === "string") return player.name;
                if (typeof player.username === "string") return player.username;
              }
              return null;
            })
            .filter(Boolean);

          const cleanMotd = Array.isArray(data.motd?.clean)
            ? data.motd.clean.join(" ")
            : data.motd?.clean;

          const now = new Date();
          setServerData((prev) => ({
            ...prev,
            online: isOnline,
            playersOnline,
            maxPlayers,
            playerList,
            motd: cleanMotd || (isOnline ? "Server is active right now!" : "Server is sleeping right now."),
            lastUpdated: now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          }));
          return;
        } catch {
          // try next endpoint
        }
      }

      if (!active) return;
      const now = new Date();
      setServerData((prev) => ({
        ...prev,
        online: false,
        playersOnline: 0,
        maxPlayers: 0,
        playerList: [],
        motd: "Server is offline or unreachable right now.",
        lastUpdated: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }));
    }

    fetchStatus();
    const interval = window.setInterval(fetchStatus, 10000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [statusHost]);

  async function copyIp() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(serverIp);
      } else {
        const input = document.createElement("input");
        input.value = serverIp;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setServerData((prev) => ({ ...prev, copyMessage: "Server IP copied!" }));
    } catch {
      setServerData((prev) => ({ ...prev, copyMessage: `Copy this IP: ${serverIp}` }));
    }

    window.setTimeout(() => {
      setServerData((prev) => ({ ...prev, copyMessage: "" }));
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.2),transparent_35%),linear-gradient(180deg,#f0f9ff_0%,#fff7ed_55%,#f7fee7_100%)]" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {screenshots.map((src, index) => (
          <div
            key={src}
            className={`absolute overflow-hidden rounded-[2.5rem] ${
              index === 0
                ? "left-[-5%] top-[8%] h-[34vh] w-[28vw] rotate-[-8deg]"
                : index === 1
                  ? "right-[-4%] top-[12%] h-[38vh] w-[26vw] rotate-[8deg]"
                  : index === 2
                    ? "left-[4%] bottom-[10%] h-[30vh] w-[24vw] rotate-[6deg]"
                    : "right-[8%] bottom-[6%] h-[28vh] w-[26vw] rotate-[-6deg]"
            }`}
            style={{ opacity: 0.12 }}
          >
            <img src={src} alt="BucksSMP background" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <section className="relative overflow-hidden border-b border-orange-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.18),transparent_35%)]" />
        <div
          className={`relative mx-auto max-w-6xl px-6 py-20 md:py-28 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border border-orange-300 bg-white/80 px-3 py-1 text-sm text-orange-700 shadow-sm">
                Welcome to BucksSMP • A fun place to play together
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Welcome to <span className="text-orange-500">Bucks</span><span className="text-green-500">SMP</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                BucksSMP is a PvP SMP server built for competition, custom spawn fights, and a fun community with quality-of-life plugins.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://discord.gg/dW8XjXbsG9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.369A19.791 19.791 0 0016.885 3c-.161.287-.349.67-.478.969a18.27 18.27 0 00-4.814 0c-.129-.3-.317-.682-.479-.969a19.736 19.736 0 00-3.432 1.369C3.533 8.246 2.97 12.028 3.254 15.757a19.9 19.9 0 005.993 3.044c.482-.66.912-1.355 1.282-2.083-.705-.267-1.377-.596-2.006-.98.168-.124.332-.252.491-.384 3.87 1.82 8.07 1.82 11.893 0 .16.132.324.26.492.384-.63.384-1.302.713-2.007.98.37.728.8 1.423 1.282 2.083a19.877 19.877 0 005.993-3.044c.333-4.298-.568-8.046-2.937-11.388zM9.545 13.545c-1.183 0-2.155-1.085-2.155-2.418 0-1.333.951-2.418 2.155-2.418 1.214 0 2.166 1.095 2.155 2.418 0 1.333-.951 2.418-2.155 2.418zm4.91 0c-1.183 0-2.155-1.085-2.155-2.418 0-1.333.951-2.418 2.155-2.418 1.214 0 2.166 1.095 2.155 2.418 0 1.333-.941 2.418-2.155 2.418z" />
                  </svg>
                  Discord
                </a>
                <button
                  onClick={copyIp}
                  className="rounded-2xl border border-green-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-green-50"
                >
                  Copy Server IP
                </button>
              </div>
              <div className="mt-6 rounded-3xl border border-orange-100 bg-white/85 p-5 shadow-lg shadow-orange-100/60">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Server IP</p>
                <p className="mt-2 text-2xl font-bold text-green-600">{serverIp}</p>
                <p className="mt-2 text-sm text-slate-500">Use this IP in Minecraft to join the server.</p>
                {serverData.copyMessage ? (
                  <p className="mt-2 text-sm font-medium text-orange-600">{serverData.copyMessage}</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-100 bg-white/85 p-6 shadow-2xl shadow-sky-100/50 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Live Server Tracker</h2>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    serverData.online === true
                      ? "bg-green-100 text-green-700"
                      : serverData.online === false
                        ? "bg-rose-100 text-rose-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {serverData.online === true
                    ? "Online"
                    : serverData.online === false
                      ? "Offline"
                      : "Checking..."}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                  <p className="text-sm text-slate-500">IP</p>
                  <p className="mt-2 text-lg font-bold break-all">{trackerHost}</p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm text-slate-500">Players</p>
                  <p className="mt-2 text-2xl font-bold">
                    {serverData.playersOnline}/{serverData.maxPlayers}
                  </p>
                </div>
                <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                  <p className="text-sm text-slate-500">Server Status</p>
                  <p className="mt-2 text-2xl font-bold text-green-600">
                    Server is {serverData.online ? "Active" : "Sleeping"}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm text-slate-500">Last Update</p>
                  <p className="mt-2 text-2xl font-bold text-orange-600">{serverData.lastUpdated || "--:--:--"}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-green-50 p-5">
                <p className="text-sm text-slate-500">Server message</p>
                <p className="mt-2 text-lg font-semibold text-slate-800">{serverData.motd}</p>
                <p className="mt-2 text-sm text-slate-500">Updates automatically every 10 seconds</p>
                <img
                  className="mt-4 h-16 w-full rounded-xl border border-orange-100 bg-white object-contain p-2"
                  src={`https://api.mcsrvstat.us/icon/${statusHost}`}
                  alt={`Live status icon for ${serverIp}`}
                />

                <div className="mt-6 rounded-2xl border border-sky-100 bg-white/80 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Live players</p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">Online Player List</h3>
                    </div>
                    <div className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                      {serverData.playersOnline} online
                    </div>
                  </div>

                  {serverData.online === true && serverData.playerList.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {serverData.playerList.map((player, index) => (
                        <div
                          key={`${player}-${index}`}
                          className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3"
                        >
                          <span className="font-semibold text-slate-800">{player}</span>
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                            #{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : serverData.online === true ? (
                    <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-5 py-8 text-center text-slate-600">
                      The server is online, but the status API is not giving player names right now.
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-5 py-8 text-center text-slate-600">
                      No players to show right now because the server is offline.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-orange-100 bg-white/60 px-6 py-20 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.25em] text-orange-500">Season 7</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">pictures from season 7</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {screenshots.map((src, index) => (
              <div key={src} className="overflow-hidden rounded-[2rem] border border-white bg-white/80 shadow-2xl shadow-sky-100/50">
                <img src={src} alt={`Season 7 screenshot ${index + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/70 px-6 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-orange-100 bg-white/85 p-8 shadow-xl shadow-orange-100/50">
          <h3 className="text-2xl font-black text-slate-900">Staff</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
              <div key={member.name} className="rounded-2xl border border-green-100 bg-green-50/70 px-4 py-4">
                <p className="text-lg font-bold text-slate-900">{member.name}</p>
                <p className="mt-1 text-sm text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-green-100 bg-white/80 px-6 py-20 text-center backdrop-blur-sm">
        <p className="text-xl font-semibold text-slate-700">owned by leonbeonbus</p>
      </section>
    </div>
  );
}
