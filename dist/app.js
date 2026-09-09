const WHATSAPP_NUMBER = '';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
document.documentElement.classList.add('motion-ready');

function analytics(event, data={}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({event, ...data});
  window.dispatchEvent(new CustomEvent('voa:analytics', {detail:{event,...data}}));
}
function toast(message){const el=$('.toast');el.textContent=message;el.classList.add('show');clearTimeout(window._toast);window._toast=setTimeout(()=>el.classList.remove('show'),3500)}
function whatsappUrl(message){const number=WHATSAPP_NUMBER.replace(/\D/g,'');return `https://wa.me/${number}?text=${encodeURIComponent(message)}`}
function openWhatsApp(message, source){analytics('whatsapp_click',{source});if(!WHATSAPP_NUMBER){navigator.clipboard?.writeText(message);toast('Mensagem copiada. O WhatsApp comercial oficial será conectado em breve.');location.hash='contato';return}window.open(whatsappUrl(message),'_blank','noopener')}

$$('.js-whatsapp').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openWhatsApp(a.dataset.message||'Olá! Gostaria de falar com a VOA FLEX.',a.textContent.trim())}));
const menuBtn=$('.menu-btn'), nav=$('.nav');menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open);document.body.classList.toggle('menu-open',open)});$$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')}));

const motionGroups=[
  '.problem-grid.reveal',
  '.standard-grid.reveal',
  '.flow.reveal',
  '.fit-columns.reveal',
  '.marketplace-row.reveal',
  '.coverage-status.reveal',
  '.price-grid.reveal',
  '.identity-grid.reveal',
  '.relationship-journey.reveal',
  '.service-grid.reveal',
  '.base-gallery.reveal',
  '.base-principles.reveal',
  '.capacity-indicators',
  '.select-features'
];
motionGroups.forEach(selector=>$$(selector).forEach(group=>{group.classList.add('motion-group');[...group.children].forEach((child,index)=>child.style.setProperty('--stagger-index',index))}));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>revealObserver.observe(el));

// Progresso, header compacto e seção ativa ajudam o seller a se orientar na página longa.
const scrollProgress=$('#scrollProgress'),pageHeader=$('.header');
const sectionLinks=$$('.nav a[href^="#"]:not(.btn)').map(link=>({link,section:$(link.getAttribute('href'))})).filter(item=>item.section);
let scrollFrame=0;
function updateScrollExperience(){
  const max=Math.max(document.documentElement.scrollHeight-innerHeight,1);
  scrollProgress?.style.setProperty('transform',`scaleX(${Math.min(scrollY/max,1)})`);
  pageHeader?.classList.toggle('scrolled',scrollY>24);
  let current=sectionLinks[0];
  for(const item of sectionLinks){if(item.section.getBoundingClientRect().top<=170)current=item}
  sectionLinks.forEach(item=>{const active=item===current;item.link.classList.toggle('active',active);if(active)item.link.setAttribute('aria-current','location');else item.link.removeAttribute('aria-current')});
  scrollFrame=0;
}
function scheduleScrollExperience(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollExperience)}
addEventListener('scroll',scheduleScrollExperience,{passive:true});addEventListener('resize',scheduleScrollExperience,{passive:true});updateScrollExperience();

// Profundidade sutil somente em dispositivos com cursor preciso.
const finePointer=matchMedia('(hover:hover) and (pointer:fine)'),reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
const interactiveCards=$$('.problem-grid article,.standard-grid article,.fit-columns>article,.service-grid article,.price-grid article,.zones article,.coverage-status article,.identity-grid article,.relationship-journey article,.base-principles>span,.brand-card,.operation-block');
interactiveCards.forEach(card=>{card.classList.add('interactive-card');card.addEventListener('pointermove',event=>{if(!finePointer.matches)return;const rect=card.getBoundingClientRect();card.style.setProperty('--spot-x',`${event.clientX-rect.left}px`);card.style.setProperty('--spot-y',`${event.clientY-rect.top}px`)})});
const heroVisual=$('.hero-visual'),heroMap=$('.map-card'),heroMascot=$('.hero-visual .mascot');
if(heroVisual&&heroMap&&finePointer.matches&&!reducedMotion.matches){
  let parallaxFrame=0;
  heroVisual.addEventListener('pointermove',event=>{const rect=heroVisual.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;cancelAnimationFrame(parallaxFrame);parallaxFrame=requestAnimationFrame(()=>{heroVisual.classList.add('is-interacting');heroMap.style.transform=`perspective(1100px) rotateX(${-y*2.3}deg) rotateY(${x*3.1}deg)`;if(heroMascot)heroMascot.style.transform=`translate3d(${x*10}px,${y*8}px,0)`})});
  heroVisual.addEventListener('pointerleave',()=>{heroVisual.classList.remove('is-interacting');heroMap.style.transform='';if(heroMascot)heroMascot.style.transform=''})
}

// Números entram de forma curta e respeitam a preferência de movimento reduzido.
const counters=$$('.js-counter');
if(counters.length){
  const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target,target=+(el.dataset.count||0),suffix=el.dataset.suffix||'';
    if(reducedMotion.matches||!target){el.textContent=`${target}${suffix}`;counterObserver.unobserve(el);return}
    const started=performance.now(),duration=850;
    const tick=now=>{const progress=Math.min((now-started)/duration,1),eased=1-Math.pow(1-progress,3);el.textContent=`${Math.round(target*eased)}${suffix}`;if(progress<1)requestAnimationFrame(tick)};
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  }),{threshold:.6});
  counters.forEach(el=>counterObserver.observe(el));
}

// Feedback visual rápido para CTAs e atalhos, sem atrasar a ação escolhida.
$$('.btn,.decision-grid button').forEach(control=>control.addEventListener('pointerdown',event=>{if(reducedMotion.matches)return;const rect=control.getBoundingClientRect(),ripple=document.createElement('i');ripple.className='action-ripple';ripple.style.left=`${event.clientX-rect.left}px`;ripple.style.top=`${event.clientY-rect.top}px`;control.appendChild(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true})}));
$$('.volume-options button').forEach(btn=>btn.addEventListener('click',()=>{$$('.volume-options button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');$('#selectedVolume').textContent=btn.dataset.volume==='parte'?'Parte do volume':`${btn.dataset.volume} pacotes/dia`;analytics('pilot_volume_select',{volume:btn.dataset.volume})}));

function maskCep(input){input.addEventListener('input',()=>{const d=input.value.replace(/\D/g,'').slice(0,8);input.value=d.length>5?`${d.slice(0,5)}-${d.slice(5)}`:d})}$$('input[name="cep"]').forEach(maskCep);

$('#coverageForm')?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const btn=$('button[type="submit"]',form),out=$('.form-result',form),data=Object.fromEntries(new FormData(form));btn.classList.add('loading');btn.disabled=true;analytics('coverage_check_start',{marketplace:data.marketplace});setTimeout(()=>{btn.classList.remove('loading');btn.disabled=false;out.innerHTML='<strong>Análise preliminar concluída.</strong><br>Os dados estão prontos para validação. A cobertura final depende da equipe VOA. <button type="button" class="inline-wa">Preparar mensagem comercial →</button>';out.classList.add('show');$('.inline-wa',out).addEventListener('click',()=>openWhatsApp(`Olá! Quero validar a cobertura da VOA.\nLoja: ${data.loja}\nCEP: ${data.cep}\nBairro: ${data.bairro}\nVolume/dia: ${data.volume}\nMarketplace: ${data.marketplace}`,'consulta_cobertura'));analytics('coverage_check_complete')},650)});

const daily=$('#daily'),shopee=$('#shopeePct'),ml=$('#mlPct'),days=$('#days');
function calculate(){if(!daily)return;const qty=+daily.value||0,s=+shopee.value||0,m=+ml.value||0,d=+days.value||0,error=$('.calc-error');$('#dailyValue').textContent=qty;if(s+m!==100){error.textContent='Os percentuais precisam somar 100%.';return}error.textContent='';const week=qty*d,month=week*4.33,cost=month*((s/100)*7+(m/100)*8);$('#weekly').textContent=Math.round(week).toLocaleString('pt-BR');$('#monthly').textContent=Math.round(month).toLocaleString('pt-BR');$('#cost').textContent=cost.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});$('#calcCta').dataset.message=`Olá! Simulei ${qty} pacotes/dia (${s}% Shopee e ${m}% Mercado Livre), ${d} dias/semana. A estimativa mensal foi ${cost.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}. Quero solicitar uma análise.`}
[daily,shopee,ml,days].forEach(el=>el?.addEventListener('input',()=>{calculate();analytics('calculator_change')}));calculate();

$('#leadForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const form=e.currentTarget;
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form));
  const btn=$('button[type="submit"]',form),out=$('.form-result',form);
  btn.classList.add('loading');
  btn.disabled=true;
  analytics('lead_form_submit',{marketplace:data.marketplace});
  const message=`Olá! Quero solicitar a análise de entrada da minha operação na VOA FLEX.\nNome: ${data.nome}\nLoja: ${data.loja}\nWhatsApp: ${data.whatsapp}\nE-mail: ${data.email}\nCEP/Bairro: ${data.cep} — ${data.bairro}\nMarketplace: ${data.marketplace}\nPacotes/dia: ${data.pacotes}\nDias de operação: ${data.dias_operacao}\nHorário de corte atual: ${data.cutoff}\nTransportadora atual: ${data.transportadora||'Não informado'}\nPrincipal dificuldade: ${data.problema}\nVolume para piloto: ${data.volume_teste}\nMelhor horário: ${data.horario}`;
  sessionStorage.setItem('voaLeadMessage',message);
  setTimeout(()=>{
    btn.classList.remove('loading');
    btn.disabled=false;
    if(WHATSAPP_NUMBER){
      window.open(whatsappUrl(message),'_blank','noopener');
      location.href='/obrigado/';
      return;
    }
    navigator.clipboard?.writeText(message);
    out.innerHTML='<strong>Sua solicitação foi preparada para análise.</strong><br>O WhatsApp comercial oficial ainda não foi informado. A mensagem foi copiada e nenhuma aprovação automática foi gerada.';
    out.classList.add('show');
    toast('Solicitação copiada. Falta apenas conectar o WhatsApp comercial oficial.');
    analytics('lead_form_prepared',{channel:'clipboard'});
  },700);
});

$$('[data-jump]').forEach(button=>button.addEventListener('click',()=>{$(button.dataset.jump)?.scrollIntoView({behavior:'smooth'});analytics('decision_shortcut',{target:button.dataset.jump})}));

// Diagnóstico operacional preliminar
const diagnosticForm=$('#diagnosticForm');
let diagnosticStep=1;
function setDiagnosticStep(step){diagnosticStep=step;$$('.diag-step',diagnosticForm).forEach(el=>el.classList.toggle('active',+el.dataset.step===step));$('.diag-result',diagnosticForm)?.classList.remove('active');$('.diag-actions',diagnosticForm).style.display='flex';$('#diagStepNumber').textContent=step;$('#diagProgress').style.width=`${step*25}%`;$('.diag-back',diagnosticForm).style.visibility=step===1?'hidden':'visible';$('.diag-next',diagnosticForm).textContent=step===4?'Ver meu diagnóstico →':'Continuar →'}
function selectedDiagnostic(name){return $(`input[name="${name}"]:checked`,diagnosticForm)}
function finishDiagnostic(){const marketplace=selectedDiagnostic('diag_marketplace')?.value,zone=selectedDiagnostic('diag_zone')?.value,volumeEl=selectedDiagnostic('diag_volume'),volume=volumeEl?.value,count=+(volumeEl?.dataset.count||0),pain=selectedDiagnostic('diag_pain')?.value;let title,text,pilot;if(zone==='Outra região'){title='Sua região está fora da cobertura inicial.';text='A VOA começa pela Zona Sul e Oeste para preservar o controle. Podemos registrar o interesse em expansão, sem prometer uma coleta antes da análise.';pilot='Interesse em expansão'}else if(count>200){title='Possível aderência, com entrada faseada.';text='O volume ultrapassa a capacidade diária inicialmente planejada. A equipe precisa avaliar um piloto parcial e uma evolução por etapas para proteger a execução.';pilot='Piloto sob análise'}else{pilot=count<=20?'Até 20 pacotes':count<=50?'Piloto de 20 pacotes':count<=100?'Piloto de 30 pacotes':'Piloto de 50 pacotes';title='Possível aderência para piloto controlado.';text=`A região está no foco inicial e o volume permite solicitar uma análise de entrada gradual. Para ${pain.toLowerCase()}, o objetivo é estruturar acompanhamento e um ponto claro de resposta.`}$('#diagTitle').textContent=title;$('#diagText').textContent=text;$('#diagSummary').innerHTML=`<span>Canal<b>${marketplace}</b></span><span>Região<b>${zone}</b></span><span>Volume diário<b>${volume}</b></span><span>Próximo passo<b>${pilot}</b></span>`;$('.diag-step.active',diagnosticForm)?.classList.remove('active');$('.diag-actions',diagnosticForm).style.display='none';$('.diag-result',diagnosticForm).classList.add('active');$('#diagProgress').style.width='100%';const message=`Olá! Fiz a consulta de aderência VOA.\nCanal: ${marketplace}\nRegião: ${zone}\nVolume: ${volume} pacotes/dia\nPrincipal dificuldade: ${pain}\nOrientação preliminar: ${pilot}\nQuero solicitar análise da minha operação.`;$('#diagPilot').onclick=e=>{e.preventDefault();openWhatsApp(message,'diagnostico')};analytics('diagnostic_complete',{marketplace,zone,volume,pain})}
$('.diag-next',diagnosticForm)?.addEventListener('click',()=>{const current=$(`.diag-step[data-step="${diagnosticStep}"]`,diagnosticForm),checked=$('input:checked',current);if(!checked){toast('Selecione uma opção para continuar.');return}if(diagnosticStep<4)setDiagnosticStep(diagnosticStep+1);else finishDiagnostic()});
$('.diag-back',diagnosticForm)?.addEventListener('click',()=>diagnosticStep>1&&setDiagnosticStep(diagnosticStep-1));
$('.diag-restart',diagnosticForm)?.addEventListener('click',()=>{diagnosticForm.reset();setDiagnosticStep(1);analytics('diagnostic_restart')});
setDiagnosticStep(1);

// VOAÍ — assistente inteligente baseado nas regras atuais da operação
const chat=$('#chatbot'),chatLaunch=$('#chatLaunch'),chatClose=$('#chatClose'),chatMessages=$('#chatMessages'),chatQuick=$('#chatQuick'),chatForm=$('#chatForm'),chatInput=$('#chatInput');
const quickQuestions=[['entrada','Como funciona a entrada?'],['cobertura','Onde a VOA atende?'],['precos','Quais são os preços?'],['piloto','Como faço um piloto?'],['peso','Qual o peso máximo?']];
let chatStarted=false,chatBusy=false;
function normalizeText(value){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ')}
function addChatMessage(text,role='bot'){const el=document.createElement('div');el.className=`chat-message ${role}`;el.textContent=text;chatMessages.appendChild(el);chatMessages.scrollTop=chatMessages.scrollHeight;return el}
function renderQuick(){chatQuick.innerHTML='';quickQuestions.forEach(([intent,label])=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>askVoai(label,intent));chatQuick.appendChild(button)})}
function answerFor(message,intent=''){
  const text=normalizeText(`${intent} ${message}`);
  if(/oi|ola|bom dia|boa tarde|boa noite|comecar/.test(text))return'Olá! Eu sou o VOAÍ, assistente automatizado da VOA FLEX. Posso explicar entrada, cobertura, preços, piloto, peso, horários, marketplaces, Sellers Fundadores e VOA Select. O que você quer saber?';
  if(/entrada|aderencia|solicitacao|ativacao|onboarding/.test(text))return'A entrada começa com uma solicitação de análise. A equipe avalia CEP, região, marketplace, volume, rotina de coleta e capacidade disponível. Se houver aderência, o próximo passo pode ser um piloto controlado. O site não aprova nenhuma operação automaticamente.';
  if(/cobertura|zona|bairro|cep|regiao|atende onde/.test(text))return'A cobertura inicial está concentrada na Zona Sul e Zona Oeste de São Paulo. Centro, Zona Norte, Zona Leste e interior ainda não fazem parte da operação padrão. A confirmação final depende do CEP, volume e coleta.';
  if(/preco|precos|valor|custa|tarifa|plano/.test(text))return'Shopee Flex: a partir de R$ 7,00 por pacote.\nMercado Livre Flex: a partir de R$ 8,00.\nAvulsos e operações especiais ou emergenciais: sob consulta.\nO valor final varia por volume, região, densidade, frequência, peso e características da coleta.';
  if(/piloto|teste|testar|trocar transportadora/.test(text))return'Você não precisa trocar toda a operação. A proposta é solicitar capacidade para 20, 30 ou 50 pacotes — ou outra parte do volume — e comparar a execução. O aumento acontece somente se fizer sentido para o seller e para a capacidade da VOA.';
  if(/peso|kg|heavy|pesado/.test(text))return'Até 10 kg: fluxo normal.\nAcima de 10 kg até 15 kg: Heavy, sujeito a adicional e transporte em carro.\nAcima de 15 kg: não aceito na operação padrão.';
  if(/horario|cutoff|corte|sabado|domingo|funciona quando/.test(text))return'A operação inicial funciona de segunda a sábado. O cutoff de referência é 12h de segunda a sexta e 11h aos sábados. Esses horários podem variar conforme seller, região, volume e modalidade. Não há operação aos domingos inicialmente.';
  if(/select|voa select/.test(text))return'VOA Select é um conceito evolutivo para sellers com forte aderência operacional, recorrência e relacionamento estratégico. Pode envolver acompanhamento mais estruturado e participação em testes, quando disponíveis. Os critérios são definidos pela operação e não há benefício financeiro garantido.';
  if(/circle|indicacao|indicar/.test(text))return'VOA Circle é um conceito em desenvolvimento para indicações entre sellers com perfil compatível. Está apresentado como “em breve” e não oferece desconto ou recompensa automática anunciada.';
  if(/shopee|mercado livre|amazon|tiktok|magalu|marketplace|canal/.test(text))return'Shopee Flex e Mercado Livre Flex são o foco inicial. Pedidos de Amazon, TikTok Shop, Magalu e e-commerce próprio podem ser analisados conforme o fluxo, sem promessa de integração, parceria ou homologação oficial.';
  if(/ocorrencia|nao recebeu|baixa|devolucao|problema|sac/.test(text))return'A proposta VOA é não deixar ocorrência sem responsável: entender o que houve, acompanhar a tratativa e dar retorno ao seller. Isso inclui baixa incorreta, comprador dizendo que não recebeu e devoluções. Cada caso depende dos registros disponíveis.';
  if(/capacidade|pacotes por dia|volume/.test(text))return'A capacidade inicial planejada é de aproximadamente 100 a 200 pacotes por dia. A VOA quer crescer com densidade e controle, sem vender capacidade excessiva. Volumes maiores exigem avaliação de entrada faseada.';
  if(/como funciona|fluxo|coleta|entrega/.test(text))return'O fluxo previsto é: seller prepara → coleta → conferência → organização → bipagem oficial → roteirização → entrega → ocorrências/devoluções → fechamento. Não afirmamos possuir software proprietário ou integração que ainda não existe.';
  if(/base|galpao|estrutura|foto|fotos/.test(text))return'A seção da base mostra simulações fotográficas de uma estrutura inicial pequena, com triagem e despacho urbano. Elas ilustram o conceito operacional e não são registros de uma unidade real em funcionamento.';
  if(/fundador|seller fundador/.test(text))return'Os Sellers Fundadores formam a primeira geração de parceiros VOA. A comunicação prevê relacionamento próximo, participação em pilotos e análise de futuras iniciativas, sem promessa de desconto ou vantagem financeira.';
  if(/humano|comercial|atendente|falar com/.test(text))return'Use a Solicitação de Entrada para preparar os dados da sua operação. O WhatsApp oficial será conectado assim que o número comercial for confirmado; até lá, nenhuma informação de contato fictícia será usada.';
  return'Posso ajudar com entrada, cobertura, preços, piloto, peso, horários, marketplaces, ocorrências, capacidade, Sellers Fundadores ou VOA Select. Para uma orientação personalizada, use a consulta de aderência.';
}
function askVoai(message,intent=''){if(chatBusy||!message.trim())return;addChatMessage(message,'user');chatInput.value='';chatBusy=true;const typing=document.createElement('div');typing.className='chat-message bot typing';typing.innerHTML='<i></i><i></i><i></i>';chatMessages.appendChild(typing);chatMessages.scrollTop=chatMessages.scrollHeight;setTimeout(()=>{typing.remove();addChatMessage(answerFor(message,intent));chatBusy=false;analytics('chatbot_message',{intent:intent||'free_text'})},420)}
function openChat(){chat.classList.add('open');chat.setAttribute('aria-hidden','false');chatLaunch.setAttribute('aria-expanded','true');if(!chatStarted){addChatMessage('Olá! Eu sou o VOAÍ. Entendo as regras atuais da VOA FLEX e posso orientar sua operação sem prometer o que ainda depende da equipe. Como posso ajudar?');renderQuick();chatStarted=true}setTimeout(()=>chatInput.focus(),220);analytics('chatbot_open')}
function closeChat(){chat.classList.remove('open');chat.setAttribute('aria-hidden','true');chatLaunch.setAttribute('aria-expanded','false')}
chatLaunch?.addEventListener('click',()=>chat.classList.contains('open')?closeChat():openChat());chatClose?.addEventListener('click',closeChat);chatForm?.addEventListener('submit',e=>{e.preventDefault();askVoai(chatInput.value)});$$('[data-chat-intent]').forEach(button=>button.addEventListener('click',()=>{openChat();setTimeout(()=>askVoai(button.querySelector('strong')?.textContent||'Quero consultar cobertura',button.dataset.chatIntent),180)}));document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(chat?.classList.contains('open'))closeChat();if(nav?.classList.contains('open')){nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');menuBtn?.focus()}});
if(chatLaunch&&!reducedMotion.matches&&!sessionStorage.getItem('voaChatNudge'))setTimeout(()=>{if(!chat.classList.contains('open')){chatLaunch.classList.add('attention');sessionStorage.setItem('voaChatNudge','1');setTimeout(()=>chatLaunch.classList.remove('attention'),1100)}},5200);

// Galeria da base — amplia as simulações sem apresentá-las como registros reais
const photoDialog=$('#photoDialog'),photoDialogImage=$('#photoDialogImage'),photoDialogTitle=$('#photoDialogTitle'),photoDialogCopy=$('#photoDialogCopy');
function closePhotoDialog(){if(!photoDialog)return;if(typeof photoDialog.close==='function'&&photoDialog.open)photoDialog.close();else photoDialog.removeAttribute('open')}
$$('.js-base-photo').forEach(button=>button.addEventListener('click',()=>{
  const source=$('img',button);
  photoDialogImage.src=source.src;
  photoDialogImage.alt=source.alt;
  photoDialogTitle.textContent=button.dataset.title;
  photoDialogCopy.textContent=button.dataset.copy;
  if(typeof photoDialog.showModal==='function')photoDialog.showModal();else photoDialog.setAttribute('open','');
  analytics('base_photo_open',{photo:button.dataset.title});
}));
$('#photoClose')?.addEventListener('click',closePhotoDialog);
photoDialog?.addEventListener('click',event=>{if(event.target===photoDialog)closePhotoDialog()});

$$('.js-instagram').forEach(link=>link.addEventListener('click',()=>analytics('social_click',{network:'instagram',location:link.dataset.location||'site'})));

$('#year').textContent=new Date().getFullYear();
