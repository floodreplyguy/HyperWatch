export const config = {
  runtime: "edge",
};

export default async function handler(req) {
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
      return new Response("Upstream API failed", { status: 502 });
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

    return new Response(
      JSON.stringify({
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
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
