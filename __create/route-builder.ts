import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Helper function to transform file path to Hono route path
function getHonoPathFromGlob(globPath: string): { name: string; pattern: string }[] {
  const relativePath = globPath.replace('../src/app/api', '');
  const parts = relativePath.split('/').filter(Boolean);
  const routeParts = parts.slice(0, -1); // Remove 'route.js'
  if (routeParts.length === 0) {
    return [{ name: 'root', pattern: '' }];
  }
  const transformedParts = routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? { name: param, pattern: `:${param}{.+}` }
        : { name: param, pattern: `:${param}` };
    }
    return { name: segment, pattern: segment };
  });
  return transformedParts;
}

// Import and register all routes using static glob imports
async function registerRoutes() {
  const modules = import.meta.glob('../src/app/api/**/route.js', { eager: true }) as Record<string, any>;

  // Sort glob paths by length descending to register longer routes first
  const globPaths = Object.keys(modules).sort((a, b) => b.length - a.length);

  // Clear existing routes
  api.routes = [];

  for (const globPath of globPaths) {
    try {
      const route = modules[globPath];
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

      for (const method of methods) {
        if (route[method]) {
          const parts = getHonoPathFromGlob(globPath);
          const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;

          const handler: Handler = async (c) => {
            const params = c.req.param();
            return await route[method](c.req.raw, { params });
          };

          const methodLowercase = method.toLowerCase();
          switch (methodLowercase) {
            case 'get':
              api.get(honoPath, handler);
              break;
            case 'post':
              api.post(honoPath, handler);
              break;
            case 'put':
              api.put(honoPath, handler);
              break;
            case 'delete':
              api.delete(honoPath, handler);
              break;
            case 'patch':
              api.patch(honoPath, handler);
              break;
            default:
              console.warn(`Unsupported method: ${method}`);
              break;
          }
        }
      }
    } catch (error) {
      console.error(`Error registering route ${globPath}:`, error);
    }
  }
}

// Initial route registration
await registerRoutes();

export { api, API_BASENAME };
