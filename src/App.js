import React, { useEffect, useState } from "react";

export default function MinecraftServerWebsite() {
  const features = [
    {
      title: "PvP Survival",
      desc: "A PvP focused SMP where players can battle, form alliances, and compete for power.",
      icon: "⚔️",
    },
    {
      title: "Custom Spawn",
      desc: "Start your adventure at a nice custom spawn designed to help new players get started quickly.",
      icon: "🏰",
    },
    {
      title: "Quality of Life",
      desc: "The server includes lots of quality-of-life plugins that make gameplay smoother and more enjoyable.",
      icon: "✨",
    },
  ];

  const staff = [
    { name: "Leonbeonbus", role: "Owner" },
    { name: "Skyampify", role: "Mod" },
    { name: "Infamous", role: "Mod" },
    { name: "JustTom", role: "Admin" },
    { name: "Koii", role: "Admin" },
  ];

  const serverIp = "BucksSMP.mcserver.us";
  const trackerHost = "169.155.122.154:9100";
  const statusHost = encodeURIComponent(trackerHost.trim().toLowerCase());

  const [serverData, setServerData] = useState({
    online: null,
    playersOnline: 0,
    maxPlayers: 0,
    playerList: [],
    version: "1.21.11 Java",
    motd: "Checking server status...",
    checkedWith: "mcsrvstat.us",
    copyMessage: "",
    lastUpdated: "",
  });

  useEffect(() => {
    let active = true;

    async function fetchStatus() {
      try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${statusHost}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Status request failed");
        }

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
          version: "1.21.11 Java",
          motd: cleanMotd || (isOnline ? "Server is active right now!" : "Server is sleeping right now."),
          checkedWith: "mcsrvstat.us",
          lastUpdated: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }));
      } catch {
        if (!active) return;

        const now = new Date();
        setServerData((prev) => ({
          ...prev,
          online: false,
          playersOnline: 0,
          maxPlayers: 0,
          playerList: [],
          motd: "Server is offline or unreachable right now.",
          checkedWith: "mcsrvstat.us",
          lastUpdated: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }));
      }
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
        setServerData((prev) => ({ ...prev, copyMessage: "Server IP copied!" }));
      } else {
        const input = document.createElement("input");
        input.value = serverIp;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setServerData((prev) => ({ ...prev, copyMessage: "Server IP copied!" }));
      }
    } catch {
      setServerData((prev) => ({ ...prev, copyMessage: `Copy this IP: ${serverIp}` }));
    }

    window.setTimeout(() => {
      setServerData((prev) => ({ ...prev, copyMessage: "" }));
    }, 2500);
  }

  const ownerOnline = serverData.playerList.includes("Leonbeonbus");

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-orange-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border border-orange-300 bg-white/80 px-3 py-1 text-sm text-orange-700 shadow-sm">
                Welcome to BucksSMP • A fun place to play together
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Welcome to <span className="text-orange-500">Bucks</span><span className="text-sky-500">SMP</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                BucksSMP is a PvP SMP server built for competition, custom spawn fights, and a fun community with quality-of-life plugins.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#helpers"
                  className="rounded-2xl bg-gradient-to-r from-orange-400 to-sky-400 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  Meet the Staff
                </a>

                <button
                  onClick={copyIp}
                  className="rounded-2xl border border-sky-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-sky-50"
                >
                  Copy Server IP
                </button>

                <a
                  href="https://discord.gg/dW8XjXbsG9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.369A19.791 19.791 0 0016.885 3c-.161.287-.349.67-.478.969a18.27 18.27 0 00-4.814 0c-.129-.3-.317-.682-.479-.969a19.736 19.736 0 00-3.432 1.369C3.533 8.246 2.97 12.028 3.254 15.757a19.9 19.9 0 005.993 3.044c.482-.66.912-1.355 1.282-2.083-.705-.267-1.377-.596-2.006-.98.168-.124.332-.252.491-.384 3.87 1.82 8.07 1.82 11.893 0 .16.132.324.26.492.384-.63.384-1.302.713-2.007.98.37.728.8 1.423 1.282 2.083a19.877 19.877 0 005.993-3.044c.333-4.298-.568-8.046-2.937-11.388zM9.545 13.545c-1.183 0-2.155-1.085-2.155-2.418 0-1.333.951-2.418 2.155-2.418 1.214 0 2.166 1.095 2.155 2.418 0 1.333-.951 2.418-2.155 2.418zm4.91 0c-1.183 0-2.155-1.085-2.155-2.418 0-1.333.951-2.418 2.155-2.418 1.214 0 2.166 1.095 2.155 2.418 0 1.333-.941 2.418-2.155 2.418z"/>
                  </svg>
                  Discord
                </a>
              </div>
              <div className="mt-6 rounded-3xl border border-orange-100 bg-white/85 p-5 shadow-lg shadow-orange-100/60">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Server IP</p>
                <p className="mt-2 text-2xl font-bold text-sky-600">{serverIp}</p>
                <p className="mt-2 text-sm text-slate-500">Use this IP in Minecraft to join the server.</p>
                {serverData.copyMessage ? (
                  <p className="mt-2 text-sm font-medium text-orange-600">{serverData.copyMessage}</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-100 bg-white/85 p-6 shadow-2xl shadow-sky-100/50">
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
                  <p className="text-sm text-slate-500">Version</p>
                  <p className="mt-2 text-2xl font-bold">1.21.11 Java</p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm text-slate-500">Players</p>
                  <p className="mt-2 text-2xl font-bold">
                    {serverData.playersOnline}/{serverData.maxPlayers}
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                  <p className="text-sm text-slate-500">Server Status</p>
                  <p className="mt-2 text-2xl font-bold text-sky-600">
                    Server is {serverData.online ? "Active" : "Sleeping"}
                  </p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm text-slate-500">Owner</p>
                  <p className="mt-2 text-2xl font-bold text-orange-600">
                    {ownerOnline ? "Owner on" : "Owner offline"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-sky-50 p-5">
                <p className="text-sm text-slate-500">Server message</p>
                <p className="mt-2 text-lg font-semibold text-slate-800">{serverData.motd}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Updates automatically every 10 seconds • Source: {serverData.checkedWith}
                </p>
                <p className="mt-1 text-xs text-slate-400">Last checked: {serverData.lastUpdated || "just now"}</p>
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

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Why join us</p>
            <h2 className="mt-2 text-3xl font-bold">A PvP SMP server built for competition</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[1.5rem] border border-white bg-white p-6 shadow-lg shadow-sky-100/60">
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-sky-100 bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-500">About the server</p>
            </div>
            <div id="helpers" className="rounded-[1.5rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-sky-50 p-6 shadow-lg shadow-orange-100/40">
              <h3 className="text-xl font-bold">Helper & Staff Team</h3>
              <p className="mt-2 text-slate-600">
                The people that are holding the server hack free and making the experince fair and fun for everyone.
              </p>
              <div className="mt-5 space-y-4">
                {staff.map((member) => (
                  <div key={member.name} className="flex items-center justify-between rounded-2xl border border-white bg-white/80 px-4 py-3 shadow-sm">
                    <span className="font-medium text-slate-800">{member.name}</span>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-orange-500">Ready to join?</p>
        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Come hang out on BucksSMP</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Bring your friends, start your survival world, and become part of the BucksSMP community.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={copyIp}
            className="rounded-2xl bg-gradient-to-r from-orange-400 to-sky-400 px-6 py-3 font-semibold text-white shadow-lg"
          >
            Copy Server IP
          </button>
        </div>
      </section>
    </div>
  );
}
