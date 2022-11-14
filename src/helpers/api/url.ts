export function url(path: string, query: any = null): string {
   const BASE_URL = process.env.VUE_APP_BASE_URL;
   if (query) {
      return `${BASE_URL + path}${getQueryString(query)}`;
  }
   return BASE_URL + path
 }
 function getQueryString(params: Record<string, any>): string {
  const qs: string[] = [];
  Object.keys(params).forEach(key => {
      const value = params[key];
      if (isDefined(value)) {
          if (Array.isArray(value)) {
              value.forEach(value => {
                  qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
              });
          } else {
              qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
          }
      }
  });
  if (qs.length > 0) {
      return `?${qs.join('&')}`;
  }
  return '';
}

function isDefined<T>(value: T | null | undefined): value is Exclude<T, null | undefined> {
  return value !== undefined && value !== null;
}