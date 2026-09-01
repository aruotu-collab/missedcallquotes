export async function POST() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Reject reason="busy"/>
</Response>`,
    { headers: { "Content-Type": "text/xml" } },
  );
}
