const ORIGIN = 'https://guerrerocarlos.w7s.cloud';
const APP = '/cv.carlosguerrero.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const mounted = url.pathname === '/cv' || url.pathname.startsWith('/cv/');
    if (url.hostname === 'cv.carlosguerrero.com') {
      url.hostname = 'carlosguerrero.com';
      url.protocol = 'https:';
      url.port = '';
      url.pathname = '/cv' + (url.pathname === '/' ? '' : url.pathname);
      return Response.redirect(url.href, 301);
    }
    if (url.hostname === 'www.carlosguerrero.com' && mounted) {
      url.hostname = 'carlosguerrero.com';
      url.protocol = 'https:';
      return Response.redirect(url.href, 301);
    }
    if (url.pathname === '/health' || url.pathname === '/cv/health') {
      return Response.json({ branch: env.BRANCH, commitHash: env.COMMIT_HASH, deployedAt: env.DEPLOYED_AT }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (!mounted) return new Response('Not found', { status: 404 });
    if (url.protocol !== 'https:' || url.pathname === '/cv/') {
      url.protocol = 'https:';
      if (url.pathname === '/cv/') url.pathname = '/cv';
      return Response.redirect(url.href, 301);
    }
    const target = new URL(ORIGIN);
    target.pathname = APP + (url.pathname.slice(3) || '/');
    target.search = url.search;
    const upstream = await fetch(new Request(target, request), { redirect: 'manual' });
    const response = new Response(upstream.body, upstream);
    const location = response.headers.get('Location');
    if (location) {
      const resolved = new URL(location, target);
      if (resolved.origin === ORIGIN && (resolved.pathname === APP || resolved.pathname.startsWith(APP + '/'))) {
        resolved.hostname = 'carlosguerrero.com';
        resolved.pathname = '/cv' + resolved.pathname.slice(APP.length);
        response.headers.set('Location', resolved.href);
      }
    }
    return response;
  }
};
