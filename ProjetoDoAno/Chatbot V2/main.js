// Chave de API do OpenAI
const apiKey = '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'
 
let conversas = JSON.parse(localStorage.getItem('conversas')) || [];
 
 
var message = document.getElementById('message-input')
    var messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
        }
    })
 
function sendMessage() {
    if(!message.value)
    {
        message.style.border = '1px solid red'
        return;
    }
    message.style.border = 'none'
 
    var status = document.getElementById('status')
    var btnSubmit = document.getElementById('btn-submit')
 
    status.style.display = 'block'
    status.innerHTML = 'Carregando...'
    btnSubmit.disabled = true
    btnSubmit.style.cursor = 'not-allowed'
    message.disabled = true
 
    const perguntaEspecifica = 'O que poderia ser o projeto do ano que vem?'; // pergunta aqui
 
    if (message.value.toLowerCase() === perguntaEspecifica.toLowerCase()) {
    const respostaPredefinida = 'Que tal um carregador por ondas eletromagnéticas???'; // resposta aqui
    status.style.display = 'none';
    showHistory(message.value, respostaPredefinida);
    message.value = '';
    }

    else {
    // Chamar API OpenAI
    fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: message.value,
        max_tokens: 2048,
        temperature: 0,
      }),
    })
    .then((response) => response.json())
    .then((response) => {
        let r = response.choices[0]['text']
        status.style.display = 'none'
        showHistory(message.value,r)
    })
    .catch((e) => {
        console.log(`Error -> ${e}`)
        status.innerHTML = 'Erro, tente novamente mais tarde...'
    })
    .finally(() => {
        btnSubmit.disabled = false
        btnSubmit.style.cursor = 'pointer'
        message.disabled = false
        message.value = ''
    })
    
}}

function armazenarConversa(titulo, mensagens) {
    const tituloAbreviado = titulo.length > 21 ? titulo.substring(0, 21) + '...' : titulo;
    conversas.push({ titulo: tituloAbreviado, mensagens });
    localStorage.setItem('conversas', JSON.stringify(conversas));
  }
       
function excluirConversaDoHistorico(conversa) {
    conversas = conversas.filter((c) => c !== conversa);
    localStorage.setItem('conversas', JSON.stringify(conversas));
    exibirHistorico();
}
    
function exibirHistorico() {
    var historicoSidebar = document.getElementById('historico');
    historicoSidebar.innerHTML = '';
   
    for (const conversa of conversas) {
      var historicoItem = document.createElement('div');
      historicoItem.className = 'historico-item';
   
      var titulo = document.createElement('div');
      titulo.className = 'historico-titulo';
   
      var excluirConversa = document.createElement('span');
      excluirConversa.className = 'excluir-conversa-btn';
      excluirConversa.innerHTML = '<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>';
   
      titulo.innerHTML = conversa.titulo;
      titulo.appendChild(excluirConversa);
   
      excluirConversa.addEventListener('click', function (event) {
        event.stopPropagation();
        excluirConversaDoHistorico(conversa);
      });
   
      historicoItem.appendChild(titulo);
      historicoSidebar.appendChild(historicoItem);
   
      historicoItem.addEventListener('click', function () {
        exibirConversa(conversa.mensagens);
      });
    }
  }  
   
function exibirConversa(mensagens) {
    var historyBox = document.getElementById('history');
    historyBox.innerHTML = '';

    for (const mensagem of mensagens) {
      var boxMessage = document.createElement('div');
      boxMessage.className = mensagem.tipo === 'usuario' ? 'box-my-message' : 'box-response-message';

      var messageElement = document.createElement('p');
      messageElement.className = mensagem.tipo === 'usuario' ? 'my-message' : 'response-message';
      messageElement.innerHTML = mensagem.texto;

      boxMessage.appendChild(messageElement);
      historyBox.appendChild(boxMessage);

      historyBox.scrollTop = historyBox.scrollHeight;
    }
  }
 
function showHistory(message, response) {
    var historyBox = document.getElementById('history');
 
    // My message
    var boxMyMessage = document.createElement('div');
    boxMyMessage.className = 'box-my-message';
 
    var myMessage = document.createElement('p');
    myMessage.className = 'my-message';
    myMessage.innerHTML = message;
    myMessage.id = 'my-message';
 
    boxMyMessage.appendChild(myMessage);
 
    historyBox.appendChild(boxMyMessage);
 
    // Response message
    var boxResponseMessage = document.createElement('div');
    boxResponseMessage.className = 'box-response-message';
 
    var chatResponse = document.createElement('p');
    chatResponse.className = 'response-message';
    chatResponse.id = 'response-message';
 
    boxResponseMessage.appendChild(chatResponse);
 
    historyBox.appendChild(boxResponseMessage);
 
    // Levar scroll para o final
    historyBox.scrollTop = historyBox.scrollHeight;
 
    // Exibir resposta gradualmente
    gradualTextDisplay(response, chatResponse);

    armazenarConversa(message, [{ tipo: 'usuario', texto: message }, { tipo: 'resposta', texto: response }]);
    exibirHistorico();
}
 
 
function gradualTextDisplay(text, element) {
    var index = 0;
    var interval = setInterval(function () {
        element.innerHTML += text[index];
        index++;
        if (index === text.length) {
            clearInterval(interval);
        }
    }, 50); // Ajuste o intervalo conforme necessário (menor para um efeito mais rápido)
}
 
function expandirContrair() {
    var sidebar = document.getElementById("sidebar");
    var icone = document.getElementById("expandir-contrair");
    var footer = document.getElementById("footer");
    var history = document.getElementById("history");
    //var myMessage = document.getElementById("my-message");
    var responseMessage = document.getElementById("response-message");
    var boxQuestions = document.getElementById("box-questions");
    var novaDuvida = document.getElementById("nova-duvida");
    var historico = document.getElementById("historico")

    if (window.innerWidth <= 600) {
      if (sidebar.style.width === "12vw") {
        novaDuvida.style.display = "block";
        novaDuvida.style.width = "40vw";
        sidebar.style.width = "60vw";
        icone.style.width = "12%";
        historico.style.display = "block";
        history.style.marginLeft = "8vw";
            
      } else {
        novaDuvida.style.display = "none";
        sidebar.style.width = "12vw";
        icone.style.width = "100%";
        historico.style.display = "none";
        history.style.marginLeft = "8vw";
  
      }
    } else {
        if (sidebar.style.width === "6vw") {
          novaDuvida.style.display = "block";
          sidebar.style.width = "20vw";
          icone.style.width = "12%";
          footer.style.marginLeft = "15vw";
          historico.style.display = "block";
          responseMessage.style.marginLeft = '15vw';
          boxQuestions.style.backgroundPosition = '57%';


        } else {
          novaDuvida.style.display = "none";
          sidebar.style.width = "6vw";
          icone.style.width = "100%";
          footer.style.marginLeft = "0";
          historico.style.display = "none";
          responseMessage.style.marginLeft = '0';
          boxQuestions.style.backgroundPosition = 'center';
        
        }
      }
}
 
function iniciarNovaConversa() {
    var historyBox = document.getElementById('history');
    historyBox.innerHTML = '';
}
 
  var novaDuvidaButton = document.querySelector('.nova-duvida');
  novaDuvidaButton.addEventListener('click', iniciarNovaConversa);