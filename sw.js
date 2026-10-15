/* JINOKA: guarda a casca da aplicação; os dados vêm sempre da internet. */
var C='jinoka-v4';
var FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./logo.png','./caixa.html','./manifest-caixa.json'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return; /* Supabase e CDN passam direto */
  e.respondWith(
    fetch(r).then(function(res){
      var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp);});return res;
    }).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./index.html');});})
  );
});
