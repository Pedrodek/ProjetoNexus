$(document).ready(function () {
  $('a[href^="#"]').on('click', function (event) {
      event.preventDefault();

      var target = this.hash;
      var $target = $(target);

      // Calcular a distância até o alvo
      var targetOffset = $target.offset().top;

      // Tempo de animação ajustável (milissegundos)
      var animationTime = 10;

      // Rolar suavemente até o alvo
      $('html, body').animate({
          'scrollTop': targetOffset
      }, animationTime, 'swing');
  });
});

const header = document.getElementById('header');
const nome = document.getElementById('nome');
const linksDoHeader = header.querySelectorAll('nav a');
const inicio = document.getElementById('inicio');
const Chatbot = document.getElementById('Chatbot');
const Funcionalidades = document.getElementById('Funcionalidades');

function alterarCorTextoHeader() {
const posicaoRolagem = window.scrollY;

if (posicaoRolagem > inicio.offsetTop + 700 && posicaoRolagem < Funcionalidades.offsetTop - 45) {
  nome.style.color = 'black';
  linksDoHeader.forEach(link => (link.style.color = 'black'));
}
else {
  nome.style.color = 'white'
  linksDoHeader.forEach(link => (link.style.color = 'white'));
}
}

window.addEventListener('scroll', alterarCorTextoHeader);

document.getElementById('entrarChat').addEventListener('click', function() {
  window.location.href = 'Chatbot V2/index.html';
});

