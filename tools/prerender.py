"""Refresh the static copy of the page content inside index.html.

Run this after editing anything in data/*.js:
    python tools/prerender.py

It opens the site in headless Chrome with app.js and motion.js blocked, so only
js/render.js runs, then writes the rendered HTML into the
<!-- prerender:NAME --> ... <!-- /prerender:NAME --> markers of index.html.
Needs: pip install playwright, and Google Chrome installed.
"""
import http.server
import pathlib
import re
import socketserver
import threading

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"


def serve():
    handler = lambda *a, **k: http.server.SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    handler.log_message = lambda *a: None
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    httpd = serve()
    port = httpd.server_address[1]
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(channel="chrome")
        except Exception:
            browser = p.chromium.launch()
        page = browser.new_page()
        page.route(re.compile(r".*/js/(app|motion)\.js$"), lambda r: r.abort())
        page.goto(f"http://127.0.0.1:{port}/index.html")
        page.wait_for_load_state("load")
        regions = page.evaluate(
            "() => Object.fromEntries([...document.querySelectorAll('[data-render]')].map(e => [e.dataset.render, e.innerHTML]))"
        )
        browser.close()
    httpd.shutdown()

    html = INDEX.read_text(encoding="utf-8")
    for name, inner in regions.items():
        pattern = re.compile(rf"<!-- prerender:{name} -->.*?<!-- /prerender:{name} -->", re.S)
        block = f"<!-- prerender:{name} -->\n{inner}\n<!-- /prerender:{name} -->"
        html, n = pattern.subn(lambda m: block, html)
        print(f"{name}: {'ok' if n else 'MARKER MISSING'} ({len(inner)} chars)")
    INDEX.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    main()
