
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
  /* Hub 2 / Hub 3 article indexes: paginate in fixed groups of 10.
     Keep the existing page markup/content intact; only the article-list interaction changes. */
  const pathParts=window.location.pathname.split('/').filter(Boolean);
  const isHubIndex=pathParts.length>=3 && pathParts[pathParts.length-1]==='index.html';
  if(isHubIndex){
    document.querySelectorAll('.lang-content[data-content]').forEach(pane=>{
      const grid=pane.querySelector('.article-grid');
      const template=pane.querySelector('script[type="application/json"]');
      const legacyBtn=pane.querySelector('.load-more');
      if(!grid || !template || !legacyBtn) return;

      let items=[];
      try{ items=JSON.parse(template.textContent||'[]'); }catch(e){ items=[]; }
      const firstPage=[...grid.querySelectorAll(':scope > .card')].map(card=>card.outerHTML);
      const allItems=firstPage.concat(items);
      const step=10;
      let page=1;
      const totalPages=Math.max(1,Math.ceil(allItems.length/step));

      const wrap=legacyBtn.parentElement;
      if(totalPages===1){ wrap.remove(); return; }
      wrap.innerHTML='';

      const prev=document.createElement('button');
      prev.type='button';
      prev.className='load-more';
      prev.setAttribute('data-pagination','prev');

      const next=document.createElement('button');
      next.type='button';
      next.className='load-more';
      next.setAttribute('data-pagination','next');

      const status=document.createElement('span');
      status.className='pagination-status';
      status.setAttribute('aria-live','polite');

      wrap.classList.add('pagination-wrap');
      wrap.appendChild(prev);
      wrap.appendChild(status);
      wrap.appendChild(next);

      function render(){
        const start=(page-1)*step;
        const current=allItems.slice(start,start+step);
        grid.innerHTML=current.join('');

        const vi=pane.dataset.content==='vi';
        prev.textContent=vi?'← 10 bài trước':'← 10 previous';
        next.textContent=vi?'Đọc thêm 10 bài →':'Read 10 more →';
        prev.disabled=page<=1;
        next.disabled=page>=totalPages;
        prev.style.display=totalPages>1?'':'none';
        next.style.display=totalPages>1?'':'none';
        status.textContent=totalPages>1
          ? (vi?`Trang ${page} / ${totalPages}`:`Page ${page} / ${totalPages}`)
          : '';
      }

      prev.addEventListener('click',()=>{
        if(page>1){ page--; render(); grid.scrollIntoView({behavior:'smooth',block:'start'}); }
      });
      next.addEventListener('click',()=>{
        if(page<totalPages){ page++; render(); grid.scrollIntoView({behavior:'smooth',block:'start'}); }
      });

      render();
    });
  }
})();
