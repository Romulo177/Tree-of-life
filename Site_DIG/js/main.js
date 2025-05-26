let cardsData = {}; // Armazena os dados do JSON

// Gera o DOM do card e encapsula no .offcanvas
function generateCard(data) {
  // Cria o container offcanvas
  const offcanvas = document.createElement("div");
  offcanvas.classList.add("offcanvas");

  // Cria o card wrapper
  const wrapper = document.createElement("div");
  wrapper.classList.add("card_wrapper");

  // Cria a frente do card
  const front = document.createElement("div");
  front.classList.add(`${data.class}_card`, "card_front");

  // Gera os links associados
  let associatedLinksHTML = '';
  if (data.associated && data.associated_names && data.associated.length === data.associated_names.length) {
    for (let i = 0; i < data.associated.length; i++) {
      associatedLinksHTML += `<a href="#" class="associated_link" data-id="${data.associated[i]}">${data.associated_names[i]}</a> `;
    }
  }

  const frontHTML = `
    <h1>${data.title.toUpperCase()}</h1>
    <button class="flip"><span style="opacity:0;">Flip</span></button>
    <button class="close"><span style="opacity:0;">Close</span></button>
    <p>${data.description}</p>
    <p>Associated cards:</p>
    ${associatedLinksHTML}
    <img class="tag" src="${data.tag}">
  `;

  front.innerHTML = frontHTML;

  // Cria o verso do card
  const back = document.createElement("div");
  back.classList.add(`${data.class}_card`, "card_back", "hidden");
  back.innerHTML = `
    <h1>${data.title.toUpperCase()}</h1>
    <button class="flip"><span style="opacity:0;">Flip</span></button>
    <button class="close"><span style="opacity:0;">Close</span></button>
    <div class="image_wrapper">
      <img src="${data.image.src}" alt="${data.image.alt}" width="${data.image.width}" />
    </div>
    <p>Relevant links:</p>
    <a href="${data.links[0].url}" target="_blank">${data.links[0].label}</a>
    <img class="tag" src="${data.tag}">
  `;

  // Junta tudo
  wrapper.appendChild(front);
  wrapper.appendChild(back);
  offcanvas.appendChild(wrapper);

  // Eventos
  offcanvas.addEventListener("click", (e) => {
    if (e.target.closest(".close")) {
      offcanvas.classList.add("hidden");
      setTimeout(() => offcanvas.remove(), 300);
    }
    if (e.target.closest(".flip")) {
      const children = wrapper.children;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle("hidden");
      }
    }
  });

  return offcanvas;
}


// Carrega e mostra o card pelo id
function loadCardById(id) {
  if (!cardsData[id]) {
    console.log(`Card com id "${id}" não encontrado.`);
    return;
  }

  // Remove offcanvas existente, se houver
  const existing = document.querySelector('.offcanvas');
  if (existing) existing.remove();

  // Cria novo e adiciona ao body
  const card = generateCard(cardsData[id]);
  document.body.appendChild(card);
}

// Carrega o JSON
fetch('data/cards.json')
  .then(response => {
    if (!response.ok) throw new Error('Falha ao carregar JSON');
    return response.json();
  })
  .then(data => {
    cardsData = data;
  })
  .catch(err => {
    console.error('Erro ao carregar JSON:', err);
  });

// Evento para abrir card
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-id]');
  if (el) {
    e.preventDefault();
    const id = el.getAttribute('data-id');
    loadCardById(id);
  }
});
