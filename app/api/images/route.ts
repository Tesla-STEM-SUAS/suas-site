import fs from "fs";
import path from "path";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const folder = url.searchParams.get("folder") || "gallery";

        const imagesDir = path.join(process.cwd(), "public", "images", folder);
        const files = fs.readdirSync(imagesDir);

        const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
        const images = files
            .filter((f) => exts.has(path.extname(f).toLowerCase()))
            // Newest file first, oldest last (by last-modified time).
            .sort(
                (a, b) =>
                    fs.statSync(path.join(imagesDir, b)).mtimeMs -
                    fs.statSync(path.join(imagesDir, a)).mtimeMs,
            )
            .map((f) => `/images/${folder}/${f}`);

        return new Response(JSON.stringify(images), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                // Matches the edge caching the rest of the site gets, so this
                // keeps serving the real gallery list from Cloudflare's cache
                // even when the origin is unreachable.
                // Keep the origin policy aligned with the Cloudflare rule:
                // browsers may reuse it for 4 hours, while the edge keeps it
                // for 24 hours before revalidating.
                "Cache-Control": "public, max-age=14400, s-maxage=86400, stale-while-revalidate=60",
            },
        });
    } catch (err) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                // Never let an origin/filesystem failure poison the CDN cache.
                "Cache-Control": "no-store",
            },
        });
    }
}
