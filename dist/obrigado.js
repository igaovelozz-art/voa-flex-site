const WHATSAPP_NUMBER = '5511966750618';
const sendLeadButton = document.querySelector('#sendLead');

async function copyLeadMessage(message) {
  if (!navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(message);
    return true;
  } catch {
    return false;
  }
}

sendLeadButton?.addEventListener('click', async () => {
  const message = sessionStorage.getItem('voaLeadMessage')
    || 'Olá! Conheci a VOA FLEX pelo site e quero solicitar análise da minha operação Flex.';

  if (WHATSAPP_NUMBER) {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
    return;
  }

  const copied = await copyLeadMessage(message);
  window.alert(
    copied
      ? 'Mensagem copiada. O WhatsApp comercial oficial ainda precisa ser conectado. Nenhum número fictício foi utilizado.'
      : `O WhatsApp comercial oficial ainda precisa ser conectado. Copie esta mensagem para continuar:\n\n${message}`
  );
});
