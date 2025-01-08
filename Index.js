const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Solana RPC endpoint
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// Function to get token metadata
async function getTokenMetadata(mintAddress) {
  const response = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [mintAddress, { encoding: 'jsonParsed' }],
    }),
  });

  const data = await response.json();
  if (data.result.value) {
    return data.result.value.data.parsed.info;
  } else {
    return null;
  }
}

// Function to score the token
function calculateScore(metadata) {
  let score = 50; // Base score

  // Example scoring logic
  if (metadata.supply > 1000000000) score += 10;
  if (metadata.decimals === 9) score += 10;

  return score;
}

// API endpoint
app.post('/sniff', async (req, res) => {
  const { mintAddress } = req.body;

  if (!mintAddress) {
    return res.status(400).json({ error: 'Mint address is required.' });
  }

  try {
    const metadata = await getTokenMetadata(mintAddress);

    if (!metadata) {
      return res.json({ prediction: 'No token data found.', score: 0 });
    }

    const score = calculateScore(metadata);

    res.json({
      mintAddress,
      prediction: `Token score is ${score}/100 🐕`,
      metadata,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
