// HEADER 

const header = document.querySelector('.site-header');

const onScroll = () => {
  if (window.scrollY > 8)
    header.classList.add('is-scrolled'); 
  else
    header.classList.remove('is-scrolled'); 
};

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });


// MENU BURGER 

const burger = document.querySelector('.burger');

burger?.addEventListener('click', () => {
  const expanded = burger.getAttribute('aria-expanded') === 'true';
  burger.setAttribute('aria-expanded', String(!expanded));
});

// ANIMATION DES BARRES DE COMPÉTENCES 

const bars = document.querySelectorAll('#skills .bar-fill');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target; 
      const target = el.getAttribute('data-target'); 
      el.style.width = `${target}%`;
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 }); 

bars.forEach(bar => observer.observe(bar));


// FORMULAIRE DE CONTACT 

(() => {
  const form = document.getElementById('contactForm'); 
  const feedback = form.querySelector('.form__feedback'); 
  const btn = form.querySelector('button[type="submit"]'); 

  const FORM_ENDPOINT = "https://formspree.io/f/mgvpglnv";  // Adresse de ton endpoint Formspree (pour recevoir les messages)

  const SUCCESS_MSG = "Merci pour votre message, je m’engage à vous répondre dans les 48 heures. — Morgane Gillard";

 
  function isValid() {
    return (
      form.name.value.trim() && 
      /^\S+@\S+\.\S+$/.test(form.email.value.trim()) && 
      form.subject.value.trim() && 
      form.message.value.trim() 
    );
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    if (!isValid()) {
      feedback.textContent = "Merci de compléter les champs requis."; 
      feedback.className = "form__feedback form__feedback--error"; 
      feedback.offsetHeight; 
      feedback.classList.add("is-visible"); 
      return; 
    }

    btn.disabled = true;
    feedback.textContent = "Envoi en cours..."; 
    feedback.className = "form__feedback form__feedback--loading";
    feedback.offsetHeight;
    feedback.classList.add("is-visible");

   
    const payload = {
      _subject: form.querySelector('input[name="_subject"]')?.value || "Nouveau message",
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload) 
      });

    
      if (!res.ok) throw new Error("send_failed");

    
      feedback.textContent = SUCCESS_MSG; 
      feedback.className = "form__feedback form__feedback--success";
      feedback.offsetHeight;
      feedback.classList.add("is-visible");
      form.reset(); 
    } catch (err) {
 
      console.error(err);
      feedback.textContent = "Oups… l’envoi a échoué. Réessaie ou contacte-moi par email.";
      feedback.className = "form__feedback form__feedback--error";
      feedback.offsetHeight;
      feedback.classList.add("is-visible");
    } finally {
      btn.disabled = false;
    }
  });
})();
