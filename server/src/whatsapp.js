// const GRAPH_BASE_URL = "https://graph.facebook.com/v20.0";

// function authHeaders() {
//   return {
//     Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
//     "Content-Type": "application/json",
//   };
// }

// export async function sendText(to, body) {
//   const url = `${GRAPH_BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: authHeaders(),
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to,
//       type: "text",
//       text: { body },
//     }),
//   });

//   const data = await res.json();
//   if (!res.ok) {
//     console.error("sendText failed:", data);
//     throw new Error(data.error?.message || "WhatsApp send failed");
//   }
//   return data;
// }

// const GRAPH_BASE_URL = "https://graph.facebook.com/v20.0";

// function authHeaders() {
//   return {
//     Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
//     "Content-Type": "application/json",
//   };
// }

// export async function sendText(to, body) {
//   const url = `${GRAPH_BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`;
//   const res = await fetch(url, {
//     method: "POST",
//     headers: authHeaders(),
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to,
//       type: "text",
//       text: { body },
//     }),
//   });

//   const data = await res.json();
//   if (!res.ok) {
//     console.error("sendText failed:", data);
//     throw new Error(data.error?.message || "WhatsApp send failed");
//   }
//   console.log("sendText succeeded:", JSON.stringify(data));
//   return data;
// }

const GRAPH_BASE_URL = "https://graph.facebook.com/v20.0";

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function sendText(to, body) {
  const url = `${GRAPH_BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("sendText failed:", data);
    throw new Error(data.error?.message || "WhatsApp send failed");
  }
  console.log("sendText succeeded:", JSON.stringify(data));
  return data;
}

export async function sendTemplate(to, templateName, params) {
  const url = `${GRAPH_BASE_URL}/${process.env.META_PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: params.map((text) => ({ type: "text", text })),
          },
        ],
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("sendTemplate failed:", data);
    throw new Error(data.error?.message || "WhatsApp template send failed");
  }
  console.log("sendTemplate succeeded:", JSON.stringify(data));
  return data;
}