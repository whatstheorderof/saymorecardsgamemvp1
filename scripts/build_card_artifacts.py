import json
import math
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path("outputs/say-more-120-card-set")
DATA = json.loads((ROOT / "say_more_120_card_master.json").read_text())["rows"]
SVG_DIR = ROOT / "cards" / "svg"
PDF_FRONTS = ROOT / "say_more_120_card_fronts_print_sheets.pdf"
PDF_BACKS = ROOT / "say_more_card_backs_print_sheets.pdf"
SVG_DIR.mkdir(parents=True, exist_ok=True)

CARD_W_MM = 63.5
CARD_H_MM = 88.9
BLEED_MM = 3
SAFE_MM = 6

PALETTE = {
    "Icebreaker": {
        "bg": "#F5EBDD",
        "panel": "#FFF8EE",
        "ink": "#2C2925",
        "accent": "#C7795B",
        "soft": "#E7D3BE",
        "symbol": "circle",
    },
    "Connection": {
        "bg": "#D7E5DF",
        "panel": "#F6FBF7",
        "ink": "#1D302D",
        "accent": "#2E746D",
        "soft": "#AFCBC4",
        "symbol": "line",
    },
    "Reflection": {
        "bg": "#B86D55",
        "panel": "#F6E7DC",
        "ink": "#241D1A",
        "accent": "#57322B",
        "soft": "#DDA48D",
        "symbol": "arc",
    },
    "Challenge": {
        "bg": "#F0725F",
        "panel": "#FFF2EA",
        "ink": "#2B1D1B",
        "accent": "#8B332B",
        "soft": "#F7B09E",
        "symbol": "spark",
    },
}


def wrap_text(text, font, size, max_width):
    words = text.split()
    lines = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if stringWidth(test, font, size) <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def svg_symbol(kind, x, y, color):
    if kind == "circle":
        return f'<circle cx="{x}" cy="{y}" r="18" fill="none" stroke="{color}" stroke-width="3"/>'
    if kind == "line":
        return f'<path d="M{x-22},{y+2} C{x-10},{y-18} {x+10},{y+22} {x+24},{y-4}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round"/>'
    if kind == "arc":
        return f'<path d="M{x-24},{y+16} C{x-8},{y-20} {x+8},{y-20} {x+24},{y+16}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round"/>'
    return f'<path d="M{x},{y-24} L{x+7},{y-6} L{x+26},{y} L{x+7},{y+6} L{x},{y+24} L{x-7},{y+6} L{x-26},{y} L{x-7},{y-6} Z" fill="none" stroke="{color}" stroke-width="3" stroke-linejoin="round"/>'


def card_svg(row):
    category = row["Category"]
    p = PALETTE[category]
    prompt = escape(row["Prompt"])
    card_id = escape(row["ID"])
    lines = []
    rough = row["Prompt"].split()
    line = ""
    for word in rough:
        test = f"{line} {word}".strip()
        if len(test) <= 23:
            line = test
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    line_height = 31 if len(lines) <= 4 else 27
    font_size = 28 if len(lines) <= 4 else 24
    total_h = len(lines) * line_height
    start_y = 332 - total_h / 2
    text = "\n".join(
        f'<text x="225" y="{start_y + i * line_height:.1f}" text-anchor="middle" font-family="Georgia, serif" font-size="{font_size}" fill="{p["ink"]}">{escape(line)}</text>'
        for i, line in enumerate(lines)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="450" height="630" viewBox="0 0 450 630">
  <rect width="450" height="630" rx="34" fill="{p["bg"]}"/>
  <rect x="24" y="24" width="402" height="582" rx="26" fill="{p["panel"]}" opacity="0.92"/>
  <path d="M60 80 C130 40 210 116 286 74 C344 42 382 70 402 104" fill="none" stroke="{p["soft"]}" stroke-width="3" opacity=".68"/>
  {svg_symbol(p["symbol"], 225, 102, p["accent"])}
  <text x="56" y="66" font-family="Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="2" fill="{p["accent"]}">{escape(category.upper())}</text>
  <text x="394" y="66" text-anchor="end" font-family="Arial, sans-serif" font-size="15" fill="{p["accent"]}">{card_id}</text>
  {text}
  <line x1="75" y1="520" x2="375" y2="520" stroke="{p["soft"]}" stroke-width="2"/>
  <text x="225" y="558" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="{p["ink"]}">Say More</text>
  <text x="225" y="582" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.4" fill="{p["accent"]}">A conversation game for closing the distance.</text>
</svg>'''


def back_svg():
    return '''<svg xmlns="http://www.w3.org/2000/svg" width="450" height="630" viewBox="0 0 450 630">
  <rect width="450" height="630" rx="34" fill="#2C2925"/>
  <rect x="24" y="24" width="402" height="582" rx="26" fill="#F5EBDD"/>
  <path d="M74 154 C154 72 254 236 366 118" fill="none" stroke="#2E746D" stroke-width="5" stroke-linecap="round"/>
  <path d="M78 448 C170 350 280 530 374 412" fill="none" stroke="#C7795B" stroke-width="5" stroke-linecap="round"/>
  <circle cx="225" cy="315" r="86" fill="none" stroke="#57322B" stroke-width="4"/>
  <text x="225" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#2C2925">Say</text>
  <text x="225" y="358" text-anchor="middle" font-family="Georgia, serif" font-size="54" fill="#2C2925">More</text>
  <text x="225" y="492" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" letter-spacing="1.6" fill="#57322B">A conversation game for closing the distance.</text>
</svg>'''


def hex_to_color(value):
    return colors.HexColor(value)


def draw_symbol(c, kind, x, y, col):
    c.setStrokeColor(hex_to_color(col))
    c.setLineWidth(1.1)
    if kind == "circle":
        c.circle(x, y, 3.5 * mm, stroke=1, fill=0)
    elif kind == "line":
        c.bezier(x - 5 * mm, y, x - 2 * mm, y + 4 * mm, x + 2 * mm, y - 4 * mm, x + 5 * mm, y)
    elif kind == "arc":
        c.arc(x - 6 * mm, y - 4 * mm, x + 6 * mm, y + 6 * mm, 0, 180)
    else:
        c.line(x, y - 5 * mm, x + 2 * mm, y - 1 * mm)
        c.line(x + 2 * mm, y - 1 * mm, x + 6 * mm, y)
        c.line(x + 6 * mm, y, x + 2 * mm, y + 1 * mm)
        c.line(x + 2 * mm, y + 1 * mm, x, y + 5 * mm)
        c.line(x, y + 5 * mm, x - 2 * mm, y + 1 * mm)
        c.line(x - 2 * mm, y + 1 * mm, x - 6 * mm, y)
        c.line(x - 6 * mm, y, x - 2 * mm, y - 1 * mm)
        c.line(x - 2 * mm, y - 1 * mm, x, y - 5 * mm)


def draw_front(c, row, x, y):
    category = row["Category"]
    p = PALETTE[category]
    w = CARD_W_MM * mm
    h = CARD_H_MM * mm
    c.setFillColor(hex_to_color(p["bg"]))
    c.roundRect(x, y, w, h, 5 * mm, stroke=0, fill=1)
    c.setFillColor(hex_to_color(p["panel"]))
    c.roundRect(x + 3 * mm, y + 3 * mm, w - 6 * mm, h - 6 * mm, 4 * mm, stroke=0, fill=1)
    c.setStrokeColor(hex_to_color(p["soft"]))
    c.setLineWidth(0.7)
    c.bezier(x + 9 * mm, y + h - 13 * mm, x + 20 * mm, y + h - 5 * mm, x + 34 * mm, y + h - 22 * mm, x + 54 * mm, y + h - 12 * mm)
    draw_symbol(c, p["symbol"], x + w / 2, y + h - 17 * mm, p["accent"])
    c.setFillColor(hex_to_color(p["accent"]))
    c.setFont("Helvetica-Bold", 7.8)
    c.drawString(x + 7 * mm, y + h - 9 * mm, category.upper())
    c.setFont("Helvetica", 7.8)
    c.drawRightString(x + w - 7 * mm, y + h - 9 * mm, row["ID"])
    max_width = w - 17 * mm
    font = "Times-Roman"
    size = 15.5
    lines = wrap_text(row["Prompt"], font, size, max_width)
    if len(lines) > 5:
        size = 13.2
        lines = wrap_text(row["Prompt"], font, size, max_width)
    line_h = size * 1.18
    block_h = len(lines) * line_h
    start_y = y + h / 2 + block_h / 2 - size
    c.setFillColor(hex_to_color(p["ink"]))
    c.setFont(font, size)
    for i, line in enumerate(lines):
        c.drawCentredString(x + w / 2, start_y - i * line_h, line)
    c.setStrokeColor(hex_to_color(p["soft"]))
    c.line(x + 12 * mm, y + 17 * mm, x + w - 12 * mm, y + 17 * mm)
    c.setFillColor(hex_to_color(p["ink"]))
    c.setFont("Helvetica-Bold", 8.5)
    c.drawCentredString(x + w / 2, y + 10 * mm, "Say More")
    c.setFillColor(hex_to_color(p["accent"]))
    c.setFont("Helvetica", 5.1)
    c.drawCentredString(x + w / 2, y + 6 * mm, "A conversation game for closing the distance.")


def draw_back(c, x, y):
    w = CARD_W_MM * mm
    h = CARD_H_MM * mm
    c.setFillColor(hex_to_color("#2C2925"))
    c.roundRect(x, y, w, h, 5 * mm, stroke=0, fill=1)
    c.setFillColor(hex_to_color("#F5EBDD"))
    c.roundRect(x + 3 * mm, y + 3 * mm, w - 6 * mm, h - 6 * mm, 4 * mm, stroke=0, fill=1)
    c.setStrokeColor(hex_to_color("#2E746D"))
    c.setLineWidth(1.5)
    c.bezier(x + 11 * mm, y + h - 23 * mm, x + 24 * mm, y + h - 6 * mm, x + 40 * mm, y + h - 36 * mm, x + 55 * mm, y + h - 18 * mm)
    c.setStrokeColor(hex_to_color("#C7795B"))
    c.bezier(x + 12 * mm, y + 24 * mm, x + 27 * mm, y + 42 * mm, x + 42 * mm, y + 11 * mm, x + 55 * mm, y + 31 * mm)
    c.setStrokeColor(hex_to_color("#57322B"))
    c.setLineWidth(1.2)
    c.circle(x + w / 2, y + h / 2, 16 * mm, stroke=1, fill=0)
    c.setFillColor(hex_to_color("#2C2925"))
    c.setFont("Times-Roman", 21)
    c.drawCentredString(x + w / 2, y + h / 2 + 4 * mm, "Say")
    c.drawCentredString(x + w / 2, y + h / 2 - 5 * mm, "More")
    c.setFillColor(hex_to_color("#57322B"))
    c.setFont("Helvetica", 5.6)
    c.drawCentredString(x + w / 2, y + 18 * mm, "A conversation game for closing the distance.")


def draw_crop_marks(c, x, y):
    w = CARD_W_MM * mm
    h = CARD_H_MM * mm
    mark = 3 * mm
    c.setStrokeColor(colors.HexColor("#B7B0A7"))
    c.setLineWidth(0.3)
    for sx in [x, x + w]:
        c.line(sx, y - mark, sx, y)
        c.line(sx, y + h, sx, y + h + mark)
    for sy in [y, y + h]:
        c.line(x - mark, sy, x, sy)
        c.line(x + w, sy, x + w + mark, sy)


def make_pdf(filename, rows, back=False):
    c = canvas.Canvas(str(filename), pagesize=A4)
    page_w, page_h = A4
    card_w = CARD_W_MM * mm
    card_h = CARD_H_MM * mm
    gap_x = 8 * mm
    gap_y = 7 * mm
    grid_w = 2 * card_w + gap_x
    grid_h = 3 * card_h + 2 * gap_y
    start_x = (page_w - grid_w) / 2
    start_y = (page_h - grid_h) / 2
    for page in range(math.ceil(len(rows) / 6)):
        batch = rows[page * 6 : page * 6 + 6]
        for i, row in enumerate(batch):
            col = i % 2
            r = i // 2
            x = start_x + col * (card_w + gap_x)
            y = start_y + (2 - r) * (card_h + gap_y)
            if back:
                draw_back(c, x, y)
            else:
                draw_front(c, row, x, y)
            draw_crop_marks(c, x, y)
        c.showPage()
    c.save()


for row in DATA:
    (SVG_DIR / f'{row["ID"]}.svg').write_text(card_svg(row), encoding="utf-8")
(SVG_DIR / "CARD-BACK.svg").write_text(back_svg(), encoding="utf-8")

make_pdf(PDF_FRONTS, DATA, back=False)
make_pdf(PDF_BACKS, DATA, back=True)

print(json.dumps({
    "front_pdf": str(PDF_FRONTS.resolve()),
    "back_pdf": str(PDF_BACKS.resolve()),
    "svg_dir": str(SVG_DIR.resolve()),
    "front_cards": len(DATA),
    "back_cards": len(DATA),
}, indent=2))
