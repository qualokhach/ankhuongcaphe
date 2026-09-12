
(function(){
  const buttons=[...document.querySelectorAll('[data-lang]')], panes=[...document.querySelectorAll('.lang-content')];
  function setLang(lang){
    panes.forEach(p=>p.classList.toggle('active',p.dataset.content===lang));
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
    document.documentElement.lang=lang; localStorage.setItem('ak-lang',lang);
    document.querySelectorAll('[data-vi][data-en]').forEach(el=>el.textContent=lang==='vi'?el.dataset.vi:el.dataset.en);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  setLang(localStorage.getItem('ak-lang')==='en'?'en':'vi');
  const header=document.getElementById('siteHeader'); let last=window.scrollY;
  window.addEventListener('scroll',()=>{const now=window.scrollY;if(now>last&&now>110)header.classList.add('hide');else if(now<last)header.classList.remove('hide');last=now},{passive:true});
  const toggle=document.querySelector('.mobile-toggle'); if(toggle) toggle.addEventListener('click',()=>document.querySelector('.menu').classList.toggle('mobile-open'));
  document.querySelectorAll('.load-more').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const template=document.getElementById(btn.dataset.template), grid=document.getElementById(btn.dataset.grid);
      let items=JSON.parse(template.textContent), shown=Number(btn.dataset.shown||10), step=10;
      const next=items.slice(shown,shown+step);
      next.forEach(x=>grid.insertAdjacentHTML('beforeend',x));
      shown+=next.length; btn.dataset.shown=shown;
      if(shown>=items.length) btn.remove();
    });
  });
})();
