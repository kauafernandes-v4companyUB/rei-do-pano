"""Teste de ponta a ponta da landing de crediário (Playwright).

Uso: python3 scripts/e2e.py [URL_BASE]   (padrão: sobe `vite preview` em :4173)
Variável MODE=backend-down (padrão) espera saved=false; MODE=live espera o lead salvo.
"""
import json, os, subprocess, sys, time
from urllib.parse import unquote
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = sys.argv[1] if len(sys.argv) > 1 else None
SHOTS = os.environ.get('SHOTS', '/tmp')
srv = None
if not BASE:
    srv = subprocess.Popen(['npx', 'vite', 'preview', '--port', '4173', '--strictPort'], cwd=ROOT,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(3)
    BASE = 'http://localhost:4173'
UTM = '?utm_source=instagram&utm_medium=organic_social&utm_campaign=rei_do_pano_crediario&utm_content=link_bio&utm_term=crediario'
fails = []


def check(cond, msg):
    print(('OK   ' if cond else 'FAIL ') + msg)
    if not cond:
        fails.append(msg)


INSTRUMENT = """
try { localStorage.setItem('rdp_cookies', 'recusado'); } catch (e) {}
window.__opens = [];
const _open = window.open.bind(window);
window.open = (...a) => { window.__opens.push({ url: a[0], target: a[1], features: a[2], dlAt: (window.dataLayer||[]).map(e => e.event) }); return _open(...a); };
"""


def events(page):
    return page.evaluate("(window.dataLayer||[]).map(e=>e.event).filter(Boolean).filter(e=>!e.startsWith('gtm.'))")


def fill_valid(page, nome='Maria Teste Silva'):
    page.fill('#form-pre-cadastro input[autocomplete=name]', nome)
    page.fill('#form-pre-cadastro input[type=email]', 'maria.teste@exemplo.com')
    page.fill('#form-pre-cadastro input[type=tel]', '69999998888')
    page.select_option('#form-pre-cadastro select', 'Cortinas Sob Medida')
    page.check('#form-pre-cadastro input[type=checkbox]')


def run_submit(ctx, route_mode, label):
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    reqs = []
    def handler(route):
        req = route.request
        if req.method == 'POST':
            reqs.append(req.post_data)
        if route_mode == 'abort':
            return route.abort('failed')
        if route_mode == '500':
            return route.fulfill(status=500, body='{"error":"boom"}', headers={'access-control-allow-origin': '*'})
        if route_mode == 'hang':
            return  # nunca responde: força o timeout do cliente
        return route.continue_()
    if route_mode != 'live':
        page.route('**/functions/v1/submit-lead', handler)
    else:
        page.on('request', lambda r: reqs.append(r.post_data) if 'submit-lead' in r.url and r.method == 'POST' else None)
    page.add_init_script(INSTRUMENT)
    page.goto(BASE + '/' + UTM)
    page.wait_for_timeout(600)
    fill_valid(page)
    with ctx.expect_page(timeout=8000) as pop:
        page.click('#btn-continuar-whatsapp')
    popup = pop.value
    page.wait_for_timeout(1500)
    ev = events(page)
    opens = page.evaluate('window.__opens')
    check(ev.count('lead') == 1 and ev.count('click_whatsapp') == 1, f'[{label}] exatamente 1 lead e 1 click_whatsapp')
    check(ev.index('lead') < ev.index('click_whatsapp'), f'[{label}] lead antes de click_whatsapp')
    check(len(opens) == 1 and 'lead' in opens[0]['dlAt'] and 'click_whatsapp' in opens[0]['dlAt'], f'[{label}] eventos já estavam no dataLayer quando o window.open rodou')
    check(opens and opens[0]['target'] == '_blank' and opens[0]['features'] == 'noopener,noreferrer', f'[{label}] _blank + noopener,noreferrer')
    msg = unquote(popup.url.split('?text=')[1]) if '?text=' in popup.url else ''
    check('wa.me/5565999279546' in popup.url and 'Nome: Maria Teste Silva' in msg and 'Interesse: Cortinas Sob Medida' in msg
          and 'E-mail: maria.teste@exemplo.com' in msg and 'WhatsApp: (69) 99999-8888' in msg, f'[{label}] WhatsApp 5565999279546 com mensagem preenchida')
    check(page.url.startswith(BASE), f'[{label}] landing continua aberta')
    check(page.is_visible('text=Continue no WhatsApp'), f'[{label}] tela de continuação visível')
    check(not errors, f'[{label}] sem erro de JS {errors}')
    check(len(reqs) == 1, f'[{label}] 1 POST para submit-lead ({len(reqs)})')
    if reqs and reqs[0]:
        body = json.loads(reqs[0])
        check(body.get('utm_source') == 'instagram' and body.get('utm_term') == 'crediario' and body.get('utm_content') == 'link_bio'
              and body.get('consentimento') is True and body.get('cidade') == 'Vilhena' and body.get('estado') == 'RO' and body.get('pais') == 'Brasil',
              f'[{label}] payload com UTMs, consentimento e praça')
    lead_ev = page.evaluate("dataLayer.find(e=>e.event==='lead')")
    check(lead_ev.get('utm_campaign') == 'rei_do_pano_crediario' and lead_ev.get('form_id') == 'form-pre-cadastro' and lead_ev.get('interesse') == 'Cortinas Sob Medida', f'[{label}] payload do evento lead')
    cw = page.evaluate("dataLayer.find(e=>e.event==='click_whatsapp')")
    check(cw == {'event': 'click_whatsapp', 'whatsapp_number': '5565999279546', 'origin': 'form_submit'}, f'[{label}] payload do click_whatsapp')
    check(page.evaluate("Object.keys(localStorage).filter(k => k !== 'rdp_cookies').length") == 0 and page.evaluate('sessionStorage.length') == 0, f'[{label}] só a escolha de cookies no localStorage, nada do formulário')
    popup.close(); page.close()


try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        ctx.route('**/wa.me/**', lambda r: r.fulfill(status=200, body='wa'))
        ctx.route('**googletagmanager.com/**', lambda r: r.fulfill(status=200, body='', content_type='application/javascript'))

        # Estrutura, form_start e validação
        page = ctx.new_page()
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))
        posts = []
        page.on('request', lambda r: posts.append(r.url) if 'submit-lead' in r.url else None)
        page.add_init_script(INSTRUMENT)
        page.goto(BASE + '/')
        page.wait_for_timeout(800)
        check(page.inner_text('h1').startswith('Facilidade para você comprar'), 'headline')
        body = page.inner_text('body')
        check(all(t in body for t in ['Até 6x sem juros', 'Crediário próprio', 'Também no cartão']), 'três benefícios')
        check(not any(t in body for t in ['10x', 'Pula', '60 dias', '90 dias', 'aprovação', 'desconto']), 'nenhuma condição inventada')
        check(page.get_attribute('#form-pre-cadastro', 'data-form') == 'pre-cadastro-crediario', 'form id e data-form')
        check(page.get_attribute('#btn-continuar-whatsapp', 'data-event') == 'submit_lead', 'botão id e data-event')
        top = page.evaluate("document.getElementById('form-pre-cadastro').getBoundingClientRect().top")
        print(f'     topo do formulário no 390px: {round(top)}px')
        check(page.get_attribute('link[rel=canonical]', 'href') == 'https://crediario.reidopano.com.br/', 'canonical')
        check('GTM-KFKG4QMG' in page.content(), 'GTM do Rei do Pano')
        check(page.evaluate("getComputedStyle(document.querySelector('#form-pre-cadastro input')).fontSize") == '16px', 'inputs com 16px (sem zoom no iOS)')
        check(len(events(page)) == 0 or 'form_start_crediario' not in events(page), 'form_start não dispara só por aparecer')
        page.click('#btn-continuar-whatsapp')  # vazio
        page.wait_for_timeout(300)
        alerts = page.locator('[role=alert]').count()
        check(alerts == 4, f'4 erros inline com role=alert ({alerts})')
        check(page.evaluate('document.activeElement.autocomplete') == 'name', 'foco vai para o primeiro campo inválido')
        ev = events(page)
        check('lead' not in ev and 'click_whatsapp' not in ev and not page.evaluate('window.__opens.length') and not posts, 'inválido: sem lead, sem click_whatsapp, sem POST, sem WhatsApp')
        page.fill('#form-pre-cadastro input[autocomplete=name]', 'Maria')
        page.fill('#form-pre-cadastro input[type=tel]', '(20) 99999-8888')
        page.focus('#form-pre-cadastro input[type=email]')
        check(events(page).count('form_start_crediario') == 1, 'form_start_crediario exatamente uma vez')
        check(page.evaluate("dataLayer.find(e=>e.event==='form_start_crediario').form_id") == 'form-pre-cadastro', 'payload do form_start')
        page.fill('#form-pre-cadastro input[type=email]', 'maria@x.com')
        page.check('#form-pre-cadastro input[type=checkbox]')
        page.click('#btn-continuar-whatsapp')
        page.wait_for_timeout(300)
        check(page.locator('[role=alert]').count() == 2 and 'lead' not in events(page), 'nome de uma palavra e DDD inválido barram o envio')
        check(page.input_value('#form-pre-cadastro input[type=tel]') == '(20) 99999-8888', 'máscara aplicada')
        check(not errs, f'sem erro de JS {errs}')
        page.close()

        mode = os.environ.get('MODE', 'backend-down')
        for rm, label in ([('live', 'backend real')] if mode == 'live' else []) + [('abort', 'rede falhou'), ('500', 'erro 500'), ('hang', 'timeout')]:
            run_submit(ctx, rm, label)

        # Painel
        page = ctx.new_page()
        page.goto(BASE + '/leads-panel')
        page.wait_for_timeout(2500)
        check(page.is_visible('text=Entrar com GitHub'), '/leads-panel mostra login com GitHub')
        check(page.get_attribute('meta[name=robots]', 'content') == 'noindex, nofollow', 'painel com noindex')
        page.close()

        # Responsivo
        for w in (320, 375, 390, 430, 768, 1280):
            pg = b.new_page(viewport={'width': w, 'height': 844}, is_mobile=w < 800, has_touch=w < 800)
            pg.route('**googletagmanager.com/**', lambda r: r.fulfill(status=200, body=''))
            pg.goto(BASE + '/')
            pg.wait_for_timeout(700)
            over = pg.evaluate("(W)=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>W+1||r.left<-1)&&!e.closest('[aria-hidden=true]')}).map(e=>e.tagName+'.'+e.className).slice(0,5)", w)
            check(not over, f'{w}px sem overflow {over}')
            pg.screenshot(path=f'{SHOTS}/crediario_{w}.png', full_page=True)
            pg.close()
        b.close()
finally:
    if srv:
        srv.terminate()

print('\n' + ('TUDO OK' if not fails else f'{len(fails)} FALHAS'))
sys.exit(1 if fails else 0)
