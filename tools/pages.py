"""Write every page (index.html, quant.html, ...) from one template, so they all load the same scripts in the same order.
Usage:  python tools/pages.py      then  node tools/stamp.js  (fresh version stamps)
Data folders (data/q/**, data/gen/**, data/sets/**, data/learn/<sec>.js) are globbed, so new files are picked up automatically."""
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def glob(sub, only_ext=".js"):
    """All .js files under data/<sub>, sorted, as 'data/<sub>/...' paths. Missing folder = empty list."""
    base = os.path.join(ROOT, "data", *sub.split("/"))
    out = []
    for d, dirs, files in os.walk(base):
        dirs.sort()
        for f in sorted(files):
            if f.endswith(only_ext):
                out.append(os.path.relpath(os.path.join(d, f), ROOT).replace(os.sep, "/"))
    return out


def exists(rel):
    return os.path.exists(os.path.join(ROOT, rel))


HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="assets/style.css">
<link rel="stylesheet" href="assets/fx/fx.css">
<link rel="stylesheet" href="assets/practice.css">
<link rel="stylesheet" href="assets/brutal.css">
<script>try{{var h=document.documentElement,t=localStorage.getItem('theme');if(t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches)h.dataset.theme='dark';var a=localStorage.getItem('anim');h.dataset.anim=a==='on'||(a!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)?'on':'off'}}catch(e){{}}</script>
</head>
<body>
<header id="topbar"></header>
'''
PAGE = '<main class="page" id="content"></main>\n'
DOC = '<div class="layout">\n  <aside class="sidebar" id="sidebar"></aside>\n  <main class="content" id="content"></main>\n</div>\n'
FX = ["assets/fx/fx-core.js", "assets/fx/fx-page.js", "assets/fx/fx-header.js", "assets/fx/fx-sidebar.js",
      "assets/fx/fx-cursor.js", "assets/fx/fx-celebrate.js"]
TAIL = ["data/progress.js", "assets/find.js", "assets/search.js", "assets/rough.js"]


def page(name, title, body, data, scripts_after, init):
    """data: scripts loaded after catalog.js (page data); scripts_after: the page's own script(s), loaded before the fx files."""
    scripts = ["assets/site.js", "assets/common.js", "data/catalog.js"] + data + scripts_after
    h = HEAD.format(title=title) + body
    h += "".join(f'<script src="{s}"></script>\n' for s in scripts)
    # the page's init script comes before the fx files (as in the Study Hub), so the content exists when they start
    h += f"<script>\n  {init}\n</script>\n"
    h += "".join(f'<script src="{s}"></script>\n' for s in FX)
    h += "".join(f'<script src="{s}"></script>\n' for s in TAIL if s not in scripts)
    h += "</body>\n</html>\n"
    open(os.path.join(ROOT, name), "w", encoding="utf-8", newline="\n").write(h)


def qfiles(sec=None):
    return glob("q/" + sec) if sec else glob("q")


# ---- lesson pages (DocPage) -------------------------------------------------------------------------------------
def opt(*rels):
    """only the files that exist (agents add them over time)"""
    return [r for r in rels if exists(r)]


def learn_files(sec):
    return [f for f in glob("learn") if f.split("/")[-1] == sec + ".js" or f.split("/")[-1].startswith(sec + "-")]


ALLQ = lambda: glob("q") + glob("gen") + glob("sets")
charts = opt("assets/charts.js")                    # DI charts drawn from a data spec (adds QB.chartHTML)


def lesson(sec, name, title):
    data = ["assets/glossary.js", "assets/qbank.js"] + charts + ["data/briefs.js"] + learn_files(sec) + qfiles(sec) + glob("sets")
    page(f"{sec}.html", f"{title} · Aptitude Hub", DOC, data, [],
         f'topbar("{sec}.html");\n  DocPage({{ sections: learnSections("{sec}"), kind: "{sec}", title: "{title}", noun: "topics" }});')


lesson("quant", "quant", "Quantitative Aptitude")
lesson("reasoning", "reasoning", "Logical Reasoning")
lesson("verbal", "verbal", "Verbal Ability")
lesson("di", "di", "Data Interpretation")

# ---- dashboard, practice, mocks, revision, strategy, cheat sheet ------------------------------------------------
page("index.html", "Dashboard · Aptitude Hub", PAGE, ["data/progress.js"] + opt("data/mocks.js"), ["assets/home.js"], 'topbar("index.html");')
page("practice.html", "Practice · Aptitude Hub", PAGE, ["assets/glossary.js", "assets/qbank.js"] + charts + ALLQ() + ["data/progress.js"],
     ["assets/practice.js"], 'topbar("practice.html");')
page("mock.html", "Mock tests · Aptitude Hub", PAGE, ["assets/qbank.js"] + charts + ALLQ() + ["data/progress.js"] + opt("data/mocks.js"),
     opt("assets/mock.js"), 'topbar("mock.html");\n  if (window.MockPage) MockPage();')
page("revision.html", "Revision · Aptitude Hub", PAGE, ["assets/glossary.js", "assets/qbank.js"] + charts + ALLQ() + glob("formulas") + opt("data/vocab.js") + ["data/progress.js"],
     opt("assets/revision.js"), 'topbar("revision.html");\n  if (window.RevisionPage) RevisionPage();')
page("strategy.html", "Placement strategy · Aptitude Hub", DOC, ["assets/glossary.js", "data/briefs.js"] + opt("data/mocks.js") + learn_files("strategy"), [],
     'topbar("strategy.html");\n  DocPage({ sections: (window.LEARN && LEARN.strategy && LEARN.strategy.length) ? LEARN.strategy : learnSections("strategy"), kind: "strategy", title: "Placement strategy", noun: "sections" });')
page("formulas.html", "Cheat sheet · Aptitude Hub", PAGE, glob("formulas"), opt("assets/formulas.js"),
     'topbar("formulas.html");\n  if (window.CheatSheet) CheatSheet();')
print("pages written")
