import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/visualize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { image, style } = (await request.json()) as {
          image?: string;
          style?: string;
        };
        if (!image || !style) {
          return new Response("Image and style are required", { status: 400 });
        }
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const prompt = `Redesign this outdoor space as a professionally landscaped garden in a "${style}" style. Keep the original camera angle, perspective, architecture and permanent structures exactly the same. Add realistic planting, pathways, lighting and hardscaping appropriate to the style. Photorealistic, natural daylight, high detail.`;

        const upstream = await fetch(
          "https://ai.gateway.lovable.dev/v1/images/generations",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-image",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: image } },
                  ],
                },
              ],
              modalities: ["image", "text"],
            }),
          },
        );

        if (!upstream.ok) {
          const text = await upstream.text();
          return new Response(text, { status: upstream.status });
        }

        const json = (await upstream.json()) as {
          data?: Array<{ b64_json?: string; url?: string }>;
        };
        const first = json.data?.[0];
        const url = first?.b64_json
          ? `data:image/png;base64,${first.b64_json}`
          : first?.url;
        if (!url) return new Response("No image returned", { status: 502 });

        return new Response(JSON.stringify({ image: url }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
