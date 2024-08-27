export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Forward the file to the Flask backend
    const response = await fetch('http://127.0.0.1:5000', {
      method: 'POST',
      body: req.body,
    });

    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
