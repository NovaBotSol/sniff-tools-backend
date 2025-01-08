const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const HELIUS_API_KEY = "287c7b47-4d53-4bf6-b1c4-af3f40718e4b"; // Your Helius API key

// Sniff endpoint
app.post("/sniff", async (req, res) => {
  const { mintAddress } = req.body;

  if (!mintAddress) {
    return res.status(400).json({ error: "Mint address is required." });
  }

  try {
    const response = await fetch(`https://rpc.helius.xyz/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [mintAddress, { encoding: "jsonParsed" }]
      }),
    });

    const data = await response.json();
    if (data.result && data.result.value) {
      res.json({ mintAddress, status: "Success 🐾", data: data.result.value });
    } else {
      res.json({ mintAddress, status: "No data found. 🐕", data: {} });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
