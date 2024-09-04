const http = require('http');

// Function to validate fields (same as before)
const validateFields = (data) => {
    const { name, email, address, id, phone } = data;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return { valid: false, error: 'Name is required and must be a non-empty string.' };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, error: 'Valid email is required.' };
    }

    if (!address || typeof address !== 'string' || address.trim() === '') {
        return { valid: false, error: 'Address is required and must be a non-empty string.' };
    }

    if (!id || !/^\d+$/.test(id)) {
        return { valid: false, error: 'ID is required and must be a positive number.' };
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
        return { valid: false, error: 'Phone number is required and must be a 10-digit number.' };
    }

    return { valid: true };
};

// Function to handle incoming requests
const handleRequest = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';

        // Collect the incoming data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Once the data has been received
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // Validate the data
                const validationResult = validateFields(data);

                if (!validationResult.valid) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: validationResult.error }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Data is valid!' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
};

// Create the server
const server = http.createServer(handleRequest);

// Start the server
const PORT = 3001;
server.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
