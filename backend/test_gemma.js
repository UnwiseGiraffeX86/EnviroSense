const API_KEY = "AIzaSyBQheHz9DVvIt-0C6nq34G9GZt0oycCiMY";
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=" + API_KEY;

async function test() {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Hello" }] }]
      })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();
