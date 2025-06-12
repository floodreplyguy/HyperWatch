export default async function handler(req, res) {
  try {
    const WALLET = "0x2c7b0430aF30EC885abF902996a9Fb011E59dEe6";

    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "userState",
        user: WALLET
      })
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Upstream API failed" });
    }

    const result = await response.json();

    const positions = result.assetPositions
      .filter(p => p.position.szi !== "0")
      .map(p => {
        const entry = parseFloat(p.position.entryPx);
        const mark = parseFloat(p.position.markPx);
        const size = parseFloat(p.position.szi);
        const pnl = (mark - entry) * size;
        return {
          symbol: p.position.coin + "-PERP",
          size,
          entry_price: entry,
          current_price: mark,
          unrealized_pnl: Math.round(pnl * 100) / 100
        };
      });

    res.status(200).json({
      streamer: {
        name: "Top PnL Trader",
        wallet: WALLET,
        status: "Live",
        sponsor: "Sponsored by $RUGDOG - Rug responsibly."
      },
      positions,
      trade_log: [],
      pnl: positions.reduce((acc, p) => acc + p.unrealized_pnl, 0),
      last_updated: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}

