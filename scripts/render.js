// Page-specific rendering from JSON
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if(page === 'index'){
    Promise.all([
      fetch('data/artifacts.json').then(r => r.json()).catch(()=>[]),
      fetch('data/courses.json').then(r => r.json()).catch(()=>[]),
      fetch('data/site.json').then(r => r.json()).catch(()=>({}))
    ]).then(([artifacts, courses, site]) => {
      const hi = document.getElementById('highlights');
      const ra = document.getElementById('recent-artifacts');
      const rc = document.getElementById('recent-courses');
      if(hi && site.highlights){
        site.highlights.slice(0,5).forEach(h => {
          const li = document.createElement('li'); li.textContent = h; hi.append(li);
        });
      }
      if(ra && Array.isArray(artifacts)){
        artifacts.slice(0,5).forEach(a => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${a.url || '#'}"><strong>${a.title}</strong></a> — <span>${a.tags.join(', ')}</span>`;
          ra.append(li);
        });
      }
      if(rc && Array.isArray(courses)){
        courses.slice(0,5).forEach(c => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${c.code}</strong> ${c.title} — <span>${c.level}</span>`;
          rc.append(li);
        });
      }
    });
  }

  if(page === 'teaching'){
    fetch('data/courses.json').then(r => r.json()).then(courses => {
      const list = document.getElementById('courses');
      const filter = document.getElementById('levelFilter');
      function render(){
        list.replaceChildren();
        const level = filter.value;
        courses
          .filter(c => level === 'all' || c.level === level)
          .forEach(c => {
            const li = document.createElement('li');
            li.className = 'card';
            li.innerHTML = `
              <h3>${c.code} — ${c.title}</h3>
              <p>${c.description}</p>
              <p><small>${c.term} • ${c.level}</small></p>
              ${c.syllabus_url ? `<p><a href="${c.syllabus_url}">Syllabus</a></p>` : ''}
            `;
            list.append(li);
          });
      }
      filter.addEventListener('change', render);
      render();
    }).catch(()=>{});
  }

  if(page === 'portfolio'){
    Promise.all([
      fetch('data/artifacts.json').then(r => r.json()).catch(()=>[])
    ]).then(([artifacts]) => {
      const list = document.getElementById('artifacts');
      const q = document.getElementById('q');
      const tagFilter = document.getElementById('tagFilter');

      const tags = Array.from(new Set(artifacts.flatMap(a => a.tags))).sort();
      tags.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t; tagFilter.append(opt);
      });

      function render(){
        list.replaceChildren();
        const term = q.value.toLowerCase();
        const tag = tagFilter.value;
        artifacts
          .filter(a => (tag === 'all' || a.tags.includes(tag)))
          .filter(a => a.title.toLowerCase().includes(term) || a.description.toLowerCase().includes(term))
          .forEach(a => {
            const li = document.createElement('li'); li.className = 'card';
            li.innerHTML = `
              <article class="artifact">
                <h3><a href="${a.url || '#'}">${a.title}</a></h3>
                <p>${a.description}</p>
                <p><small>${a.course || ''} ${a.term || ''}</small></p>
                <p><small>Tags: ${a.tags.join(', ')}</small></p>
              </article>
            `;
            list.append(li);
          });
      }
      q.addEventListener('input', render);
      tagFilter.addEventListener('change', render);
      render();
    });
  }

  if(page === 'research'){
    fetch('data/publications.json').then(r => r.json()).then(pubs => {
      const ul = document.getElementById('publications');
      pubs.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${p.authors}</strong> (${p.year}). ${p.title}. <em>${p.venue}</em>. ${p.url ? `<a href="${p.url}">Link</a>` : ''}`;
        ul.append(li);
      });
    }).catch(()=>{});
  }

  if(page === 'cv'){
    fetch('data/site.json').then(r => r.json()).then(site => {
      const ul = document.getElementById('cvSummary');
      (site.cv_summary || []).forEach(item => {
        const li = document.createElement('li'); li.textContent = item; ul.append(li);
      });
    }).catch(()=>{});
  }
});
