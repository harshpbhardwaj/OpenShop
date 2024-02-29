import express from 'express';

export const home = async ( req:express.Request, res:express.Response) => {
    const htmlResponse = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Open Shop API</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #1a1a1a;
            color: #e0e0e0;
        }

        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 40px;
            background-color: #2d2d2d;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        h1 {
            text-align: center;
            color: #ffffff;
            font-weight: 700;
            margin-bottom: 30px;
        }

        p {
            line-height: 1.8;
            color: #cccccc;
            margin-bottom: 20px;
        }

        ul {
            list-style-type: none;
            padding: 0;
        }

        ul li {
            margin-bottom: 15px;
            font-size: 18px;
            position: relative;
            padding-left: 30px;
        }

        ul li:before {
            content: "•";
            color: #5f9ea0;
            font-size: 20px;
            position: absolute;
            left: 0;
            top: 4px;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            color: #999;
        }

        .footer a {
            color: #5f9ea0;
            text-decoration: none;
            font-weight: 700;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Welcome to the Open Shop API</h1>
    <p>This API is crafted to register your business and meticulously manage catalogs and much more.</p>

    <div class="feature">
        <h2>Key Features:</h2>
        <ul>
            <li>Business Registration</li>
            <li>Catalog Management</li>
            <li>Order Processing</li>
            <li>Customer Management</li>
            <li>Analytics and Reporting</li>
            <li>Integration Capabilities</li>
            <li>Security and Compliance</li>
        </ul>
    </div>
</div>

<div class="footer">
    <p>&copy; ${new Date().getFullYear()} Open Shop API. All rights reserved.</p>
</div>

</body>
</html>

    
    `;
    const jsonResponse = {
        message: 'Welcome to the Open Shop API',
        year: new Date().getFullYear()
    };

    // Check the 'Accept' header of the request
    const acceptHeader = req.headers.accept;

    // Send the appropriate response based on 'Accept' header
    if (acceptHeader && acceptHeader.includes('text/html')) {
        // Respond with HTML
        res.send(htmlResponse);
    } else {
        // Respond with JSON
        res.json(jsonResponse);
    }
}