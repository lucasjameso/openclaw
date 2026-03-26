const PREVIEW_PREFIX = 'preview:';

function filenameFromPath(filePath) {
  const normalized = String(filePath || '').split('/').filter(Boolean).pop() || 'preview.bin';
  return normalized.replace(/"/g, '');
}

function corsHeaders(extraHeaders = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...extraHeaders,
  };
}

function freshHeaders(extraHeaders = {}) {
  return corsHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
    Pragma: 'no-cache',
    Expires: '0',
    ...extraHeaders,
  });
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: freshHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    }),
  });
}

function decodeBase64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export async function handlePreviewRequest(env, encodedPath) {
  const decodedPath = decodeURIComponent(encodedPath || '').replace(/^\/+/, '');
  if (!decodedPath) {
    return jsonResponse({ error: 'Preview path is required' }, 400);
  }

  const raw = await env.STATE.get(`${PREVIEW_PREFIX}${decodedPath}`);
  if (!raw) {
    return jsonResponse({ error: 'Preview not available' }, 404);
  }

  let preview;
  try {
    preview = JSON.parse(raw);
  } catch (error) {
    return jsonResponse({ error: 'Preview payload is corrupted' }, 500);
  }

  if (!preview || typeof preview.mime !== 'string' || typeof preview.data !== 'string') {
    return jsonResponse({ error: 'Preview payload is invalid' }, 500);
  }

  return new Response(decodeBase64ToUint8Array(preview.data), {
    status: 200,
    headers: freshHeaders({
      'Content-Type': preview.mime,
      'Content-Disposition': `inline; filename="${filenameFromPath(decodedPath)}"`,
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
    }),
  });
}

export async function handlePreviewUpload(request, env, encodedPath) {
  const authorization = request.headers.get('Authorization') || '';
  if (authorization !== `Bearer ${env.API_TOKEN}`) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const decodedPath = decodeURIComponent(encodedPath || '').replace(/^\/+/, '');
  if (!decodedPath) {
    return jsonResponse({ error: 'Preview path is required' }, 400);
  }

  const mime = request.headers.get('X-Preview-Mime');
  if (!mime) {
    return jsonResponse({ error: 'X-Preview-Mime header is required' }, 400);
  }

  const hash = request.headers.get('X-Preview-Hash') || null;
  const dimensions = request.headers.get('X-Preview-Dimensions') || null;
  const arrayBuffer = await request.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (!bytes.byteLength) {
    return jsonResponse({ error: 'Preview body is empty' }, 400);
  }

  let binary = '';
  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  await env.STATE.put(`${PREVIEW_PREFIX}${decodedPath}`, JSON.stringify({
    mime,
    data: btoa(binary),
    hash,
    dimensions,
    stored_at: new Date().toISOString(),
  }));

  return jsonResponse({
    status: 'ok',
    path: decodedPath,
    size: bytes.byteLength,
  });
}
