// Theme toggle & active nav
(function(){
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved){ root.setAttribute('data-theme', saved); }
  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // mark active nav
  const page = document.body.dataset.page;
  document.querySelectorAll('.site-nav a').forEach(a => {
    if(a.dataset.active === page){ a.classList.add('active'); }
  });

  // footer
  const year = new Date().getFullYear();
  document.getElementById('year')?.append(year);

  // load site meta
  fetch('data/site.json')
    .then(r => r.json())
    .then(site => {
      document.getElementById('author')?.append(site.author);
      document.getElementById('author-name')?.replaceChildren(site.author);
      document.getElementById('site-title')?.replaceChildren(site.title);
      document.getElementById('home-bio')?.replaceChildren(site.bio);
      document.getElementById('tagline')?.replaceChildren(site.tagline);

      // meta
      const metaAuthor = document.getElementById('meta-author');
      if(metaAuthor) metaAuthor.setAttribute('content', site.author);
      const ogTitle = document.getElementById('og-title');
      if(ogTitle) ogTitle.setAttribute('content', site.title);
      const ogDesc = document.getElementById('og-description');
      if(ogDesc) ogDesc.setAttribute('content', site.bio);
      const ogImage = document.getElementById('og-image');
      if(ogImage) ogImage.setAttribute('content', site.profile_image);

      // social
      const ul = document.getElementById('socialLinks');
      if(ul){
        site.social.forEach(s => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = s.url; a.textContent = s.label; a.target = "_blank"; a.rel = "noopener";
          li.append(a); ul.append(li);
        });
      }

      // CV
      const cvLink = document.getElementById('cvLink');
      if(cvLink && site.cv_url){ cvLink.href = site.cv_url; }
    })
    .catch(err => console.warn('site.json missing or not served over HTTP(s)', err));
})();

// Inject Google Analytics 4 dynamically if ID provided
if (siteData.googleAnalyticsId && siteData.googleAnalyticsId !== "G-XXXXXXXXXX") {
  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${siteData.googleAnalyticsId}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', siteData.googleAnalyticsId);
}
