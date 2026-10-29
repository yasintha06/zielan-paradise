"""
Builds the WTM print kit from the site's own data (data/*.json), so nothing can disagree with the website.
  python docs/wtm/make_wtm.py      -> docs/wtm/*.html, then PDFs via Microsoft Edge (headless)
Also copies the sample itinerary and fact sheet to frontend/public/files/ so their download buttons
on /agents appear. Only confirmed facts are used: no prices, rates, commission or licences.
"""
import html
import json
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
IMG = '../../frontend/public/img/'
FONTS = '../../frontend/node_modules/'
EDGE = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
FFMPEG = os.path.expanduser(r'~\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwefmpeg-9.0.2-full_buildinfmpeg.exe')

PHONE, EMAIL, WEB = '+44 7818 792995', 'info@zeilanparadise.com', 'zeilanparadise.com'
FOUNDER, ROLE = 'Yasintha Agampodi', 'Founder'

tours = json.load(open(os.path.join(ROOT, 'data', 'tours-uk.json'), encoding='utf8'))
days = json.load(open(os.path.join(ROOT, 'data', 'day-tours-uk.json'), encoding='utf8'))
e = html.escape


def img(path, size=900):
    """JPEG copies in docs/wtm/img (Edge stores WebP uncompressed in PDFs, which makes them huge)."""
    name = os.path.basename(path).rsplit('.', 1)[0]
    out = os.path.join(HERE, 'img', f"{name}{'-cover' if size > 900 else ''}.jpg")
    if not os.path.exists(out):
        src = os.path.join(ROOT, 'frontend', 'public', 'img', f'{name}-{2000 if size > 900 else 900}.webp')
        subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', src] + (['-vf', 'scale=1800:-2'] if size > 900 else []) + ['-q:v', '4', out], check=True)
    return 'img/' + os.path.basename(out)


BASE_CSS = f"""
@font-face {{ font-family: 'Cormorant Garamond'; font-weight: 500; src: url('{FONTS}@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2'); }}
@font-face {{ font-family: 'Cormorant Garamond'; font-weight: 600; src: url('{FONTS}@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2'); }}
@font-face {{ font-family: 'Cormorant Garamond'; font-style: italic; font-weight: 500; src: url('{FONTS}@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2'); }}
@font-face {{ font-family: 'Manrope'; font-weight: 200 800; src: url('{FONTS}@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'); }}
:root {{ --teal: #005B52; --gold: #D4AF37; --gold-dark: #B08F2A; --ink: #0A1F1C; --ivory: #F7F3EA; --sand: #EFE7D6; --soft: #4c5a57; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
@page {{ size: A4; margin: 0; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Manrope', sans-serif; color: var(--ink); font-size: 9.4pt; line-height: 1.5; }}
h1, h2, h3 {{ font-family: 'Cormorant Garamond', serif; font-weight: 500; line-height: 1.1; }}
em {{ font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--teal); }}
.eyebrow {{ font-size: 7pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--gold-dark); }}
.page {{ width: 210mm; height: 297mm; padding: 14mm 15mm; position: relative; overflow: hidden; page-break-after: always; }}
.page:last-child {{ page-break-after: auto; }}
"""


def write(name, title, css, body):
    path = os.path.join(HERE, name + '.html')
    with open(path, 'w', encoding='utf8') as f:
        f.write(f'<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>{e(title)}</title>'
                f'<style>{BASE_CSS}{css}</style></head><body>{body}</body></html>')
    return path


def pdf(html_path, out_pdf):
    subprocess.run([EDGE, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--allow-file-access-from-files',
                    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=8000',
                    f'--print-to-pdf={out_pdf}', 'file:///' + html_path.replace('\\', '/')], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('  ', os.path.relpath(out_pdf, ROOT), f'{os.path.getsize(out_pdf) // 1024} KB')


contact_block = f"""
<div class="contact">
  <div><p class="eyebrow">Talk to us</p>
    <p class="who">{FOUNDER}<span>{ROLE}</span></p>
    <p>{PHONE} &nbsp;·&nbsp; WhatsApp<br>{EMAIL}<br>{WEB}</p></div>
  <div class="qr"><img src="qr-agents.svg" alt=""><span>Agent enquiries<br>{WEB}/agents</span></div>
</div>"""

# ── 1. Agent fact sheet (A4, 2 pages) ──────────────────────────────────────────
rows = ''.join(
    f"<tr><td><strong>{e(t['title'])}</strong><span>{e(t['targetAudience'])}</span></td>"
    f"<td class='len'>{e(t['duration'].replace(' Days / ', ' days · ').replace(' Nights', ' nights'))}</td><td>{e(t['bestTime'])}</td>"
    f"<td class='route'>{e(t['route'])}</td></tr>" for t in tours)
day_items = ''.join(f"<li><strong>{e(d['title'])}</strong> · {e(d['duration'])}</li>" for d in days)
incl = ''.join(f'<li>{e(x)}</li>' for x in tours[0]['inclusions'])
excl = ', '.join(tours[0]['exclusions']).lower().capitalize()

fact_css = """
.cover { height: 92mm; margin: -14mm -15mm 0; position: relative; color: #fff; }
.cover img.bg { width: 100%; height: 100%; object-fit: cover; }
.cover::after { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, rgba(10,31,28,.88) 30%, rgba(10,31,28,.25)); }
.cover .in { position: absolute; inset: 0; z-index: 1; padding: 13mm 15mm; display: flex; flex-direction: column; justify-content: space-between; }
.cover .logo { height: 19mm; align-self: flex-start; }
.cover h1 { font-size: 25pt; max-width: 150mm; }
.cover h1 em { color: var(--gold); }
.cover p { max-width: 135mm; font-size: 10pt; opacity: .92; margin-top: 2.5mm; }
.cover .eyebrow { color: var(--gold); }
h2 { font-size: 16pt; margin: 4.5mm 0 2mm; }
table { width: 100%; border-collapse: collapse; font-size: 7.6pt; }
th { text-align: left; font-size: 6.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--gold-dark); padding: 0 2mm 1.5mm 0; border-bottom: 1px solid var(--ink); }
td { padding: 1.1mm 2mm 1.1mm 0; border-bottom: 1px solid #e4dccb; vertical-align: top; }
td strong { display: block; font-size: 8.3pt; }
td.len { white-space: nowrap; }
td span { color: var(--soft); font-size: 7.3pt; }
td.route { color: var(--soft); font-size: 7.3pt; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.days { list-style: none; columns: 2; column-gap: 6mm; font-size: 8.2pt; }
.days li { padding: 1.3mm 0; border-bottom: 1px solid #e4dccb; break-inside: avoid; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin-top: 2mm; }
.steps div { border-top: 2px solid var(--gold); padding-top: 2.5mm; }
.steps b { font-family: 'Cormorant Garamond', serif; font-size: 14pt; font-weight: 600; display: block; margin-bottom: 1mm; }
ul.ticks { list-style: none; }
ul.ticks li { padding: 1mm 0 1mm 4.5mm; position: relative; }
ul.ticks li::before { content: ''; position: absolute; left: 0; top: 2.6mm; width: 2mm; height: 2mm; background: var(--gold); transform: rotate(45deg); }
.note { color: var(--soft); font-size: 8pt; margin-top: 2mm; }
.band { background: var(--sand); margin: 6mm -15mm 0; padding: 5mm 15mm; }
.contact { position: absolute; left: 15mm; right: 15mm; bottom: 11mm; background: #fff; display: flex; justify-content: space-between; align-items: flex-end;
  border-top: 1px solid var(--ink); padding-top: 4.5mm; }
.contact .who { font-family: 'Cormorant Garamond', serif; font-size: 17pt; margin: 1mm 0; }
.contact .who span { font-family: 'Manrope'; font-size: 8pt; color: var(--soft); margin-left: 3mm; }
.qr { display: flex; align-items: center; gap: 3mm; font-size: 7.5pt; color: var(--soft); text-align: right; }
.qr img { width: 24mm; height: 24mm; }
.photos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm; height: 27mm; margin-top: 4mm; }
.photos > img { display: block; width: 100%; height: 27mm; min-height: 0; object-fit: cover; border-radius: 1mm; }
.photos { overflow: hidden; }
"""
fact_body = f"""
<section class="page">
  <div class="cover"><img class="bg" src="{img('sigiriya-rock-01', 2000)}" alt="">
    <div class="in"><img class="logo" src="../../frontend/public/logo-light.png" alt="Zeilan Paradise">
      <div><p class="eyebrow">For travel agents · Inbound Sri Lanka</p>
        <h1>Private Sri Lanka journeys <em>for your clients</em></h1>
        <p>Zeilan Paradise is an inbound Sri Lanka tour business for UK travellers and travel agents. We offer {len(tours)} private round tours and {len(days)} day tours, each tailored to your clients.</p></div></div></div>
  <h2>{len(tours)} private round tours</h2>
  <table><thead><tr><th>Journey · ideal for</th><th>Length</th><th>Best time</th><th>Route</th></tr></thead><tbody>{rows}</tbody></table>
  <p class="note">Every itinerary is a starting point: we tailor the route, hotels and pace to each client.</p>
  {contact_block}
</section>
<section class="page">
  <h2 style="margin-top:0">{len(days)} private day tours</h2>
  <ul class="days">{day_items}</ul>
  <h2>How it works</h2>
  <div class="steps">
    <div><b>1 · Enquiry</b>Tell us which tours or dates your clients are interested in, by email, phone or the form at {WEB}/agents.</div>
    <div><b>2 · Quote</b>We send you a written quote for the journey, built around your clients’ dates and group.</div>
    <div><b>3 · Confirmation</b>When your clients are happy, we confirm the arrangements in Sri Lanka.</div>
  </div>
  <div class="cols">
    <div><h2>What a quote contains</h2><ul class="ticks">
      <li>A day-by-day itinerary</li><li>Where your clients stay each night, with hotels as listed or similar</li>
      <li>What is included and what is not</li><li>The price for your clients’ dates and group size</li></ul></div>
    <div><h2>Every round tour includes</h2><ul class="ticks">{incl}</ul>
      <p class="note">Not included: {e(excl)}.</p></div>
  </div>
  <div class="band"><p class="eyebrow">How our journeys are planned</p>
    <p style="margin-top:1.5mm">First night near the airport after a long flight · one direction around the island, no backtracking ·
    two or more nights at most stops · early starts for Sigiriya and safaris · ethical wildlife only: no elephant rides ·
    routes timed to the season, south and west coast December to April, east coast May to September.</p></div>
  <div class="photos"><img src="{img('kandy-temple-tooth-01')}" alt=""><img src="{img('teatrails-walkers-01')}" alt=""><img src="{img('untamed-leopard-01')}" alt=""></div>
  {contact_block}
</section>"""
fact = write('zeilan-agent-factsheet', 'Zeilan Paradise · Agent fact sheet', fact_css, fact_body)

# ── 2. Sample itinerary: Classic Ceylon & Coast ────────────────────────────────
t = next(x for x in tours if x['id'] == 'tour-classic-ceylon-coast')
stays = ''.join(f"<li><b>{e(s['place'])}</b>{s['nights']} night{'s' if s['nights'] > 1 else ''}</li>" for s in t['stays'])
day_rows = ''.join(f"<div class='day'><span class='n'>{e(d['day'].replace('Day ', ''))}</span><div><h3>{e(d['title'])}"
                   f"<small>{e(d['location'])}</small></h3><p>{e(d['description'])}</p></div></div>" for d in t['itinerary'])
hl = ''.join(f'<li>{e(h)}</li>' for h in t['highlights'])
it_css = fact_css + """
.page.flow { height: auto; min-height: 297mm; overflow: visible; padding-bottom: 40mm; }
.facts { display: flex; gap: 8mm; margin: 5mm 0 2mm; }
.facts div { border-left: 2px solid var(--gold); padding-left: 3mm; }
.facts b { display: block; font-size: 10.5pt; }
.stays { list-style: none; display: flex; flex-wrap: wrap; gap: 2mm; margin-top: 2mm; }
.stays li { border: 1px solid #e0d6c2; border-radius: 1mm; padding: 1.5mm 3mm; font-size: 8pt; }
.stays b { font-family: 'Cormorant Garamond'; font-size: 11.5pt; font-weight: 600; margin-right: 2mm; }
.day { display: grid; grid-template-columns: 11mm 1fr; gap: 3mm; padding: 2.4mm 0; border-bottom: 1px solid #e4dccb; break-inside: avoid; }
.day .n { width: 9mm; height: 9mm; border-radius: 50%; background: var(--teal); color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 8.5pt; }
.day h3 { font-size: 12.5pt; }
.day h3 small { font-family: 'Manrope'; font-size: 7.3pt; color: var(--gold-dark); letter-spacing: .1em; text-transform: uppercase; margin-left: 2.5mm; }
.day p { color: #33403d; margin-top: .6mm; }
.sig { background: var(--ink); color: var(--ivory); padding: 4mm 5mm; border-radius: 1mm; margin-top: 4mm; }
.sig .eyebrow { color: var(--gold); }
.sig p:last-child { font-family: 'Cormorant Garamond'; font-size: 13pt; margin-top: 1mm; }
.contact { position: static; margin-top: 8mm; }
"""
it_body = f"""
<section class="page flow">
  <div class="cover"><img class="bg" src="{img(t['image'], 2000)}" alt="">
    <div class="in"><img class="logo" src="../../frontend/public/logo-light.png" alt="Zeilan Paradise">
      <div><p class="eyebrow">Sample itinerary · {e(t['badge']['text'])}</p><h1>{e(t['title'])}</h1><p>{e(t['description'])}</p></div></div></div>
  <div class="facts"><div><span class="eyebrow">Length</span><b>{e(t['duration'])}</b></div>
    <div><span class="eyebrow">Best time</span><b>{e(t['bestTime'])}</b></div>
    <div><span class="eyebrow">Ideal for</span><b>{e(t['targetAudience'])}</b></div>
    <div><span class="eyebrow">Style</span><b>Private &amp; tailor-made</b></div></div>
  <p class="note">Every itinerary is a starting point: we tailor the route, hotels and pace to each client.</p>
  <div class="sig"><p class="eyebrow">Zeilan signature experience</p><p>{e(t['signature'])}</p></div>
  <div class="cols"><div><h2>Highlights</h2><ul class="ticks">{hl}</ul></div>
    <div><h2>Where you stay</h2><ul class="stays">{stays}</ul><p class="note">Hotels are chosen with you when we plan the journey.</p></div></div>
  <h2>Day by day</h2>{day_rows}
  <p class="note" style="margin-top:3mm"><b>Optional on request:</b> {e(t.get('optional', ''))}</p>
  <div class="cols"><div><h2>Included</h2><ul class="ticks">{incl}</ul></div>
    <div><h2>Not included</h2><ul class="ticks">{''.join(f'<li>{e(x)}</li>' for x in t['exclusions'])}</ul>
    <h2>Price</h2><p>On request, for your clients’ dates and group size.</p></div></div>
  {contact_block}
</section>"""
itin = write('zeilan-sample-itinerary', 'Zeilan Paradise · Sample itinerary', it_css, it_body)

# ── 3. Business card, 85 x 55 mm plus 3 mm bleed (91 x 61 mm), front and back ──
card_css = """
@page { size: 91mm 61mm; margin: 0; }
.card { width: 91mm; height: 61mm; padding: 7mm 8mm; position: relative; overflow: hidden; page-break-after: always; }
.card:last-child { page-break-after: auto; }
.front { background: var(--ink); color: var(--ivory); display: flex; flex-direction: column; justify-content: space-between; }
.front img { height: 17mm; align-self: flex-start; }
.front .name { font-family: 'Cormorant Garamond'; font-size: 15pt; line-height: 1; }
.front .role { font-size: 6.5pt; letter-spacing: .18em; text-transform: uppercase; color: var(--gold); margin-top: 1mm; }
.front .lines { font-size: 7.4pt; line-height: 1.55; margin-top: 2.5mm; }
.back { background: var(--ivory); display: flex; align-items: center; gap: 5mm; }
.back img { width: 28mm; height: 28mm; }
.back h3 { font-size: 14pt; }
.back h3 em { color: var(--teal); }
.back p { font-size: 7pt; color: var(--soft); margin-top: 1.5mm; }
"""
card_body = f"""
<section class="card front"><img src="../../frontend/public/logo-light.png" alt="Zeilan Paradise">
  <div><p class="name">{FOUNDER}</p><p class="role">{ROLE}</p>
  <p class="lines">{PHONE} · WhatsApp<br>{EMAIL}<br>{WEB}</p></div></section>
<section class="card back"><img src="qr-agents.svg" alt="">
  <div><h3>Private Sri Lanka journeys <em>for your clients</em></h3>
  <p>{len(tours)} round tours · {len(days)} day tours<br>Scan for agent enquiries<br>{WEB}/agents</p></div></section>"""
card = write('zeilan-business-card', 'Zeilan Paradise · Business card', card_css, card_body)

print('PDFs:')
pdf(fact, os.path.join(HERE, 'zeilan-agent-factsheet.pdf'))
pdf(itin, os.path.join(HERE, 'zeilan-sample-itinerary.pdf'))
pdf(card, os.path.join(HERE, 'zeilan-business-card.pdf'))
os.makedirs(os.path.join(ROOT, 'frontend', 'public', 'files'), exist_ok=True)
for name in ('zeilan-sample-itinerary.pdf', 'zeilan-agent-factsheet.pdf'):
    with open(os.path.join(HERE, name), 'rb') as src, \
            open(os.path.join(ROOT, 'frontend', 'public', 'files', name), 'wb') as dst:
        dst.write(src.read())
print('  copied the sample itinerary and fact sheet to frontend/public/files/ (download buttons on /agents)')
