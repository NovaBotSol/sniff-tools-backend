const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/sniff', async (req, res) => {
    const { mintAddress } = req.body;

    if (!mintAddress) {
        return res.status(400).json({ error: 'Mint address is required.' });
    }

    try {
        const response = await fetch(`https://rpc.helius.xyz/?api-key=287c7b47-4d53-4bf6-b1c4-af3f40718e4b`, {
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

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.json({
            mintAddress,
            prediction: 'Bullish 🐶', // Example logic; you can customize this later
            tokenData: data.result.value || {},
        });
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
