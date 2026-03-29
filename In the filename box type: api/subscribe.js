export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
 
  const { email, profession } = req.body;
 
  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/9260632/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: "MIBl3ebdZg5YyDUpqcZ-fw",
          email,
          fields: { profession: profession || "unknown" },
        }),
      }
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
}
 
