import { useEffect, useState } from 'react';

/**
 * Fetches optional field-order.json (object name -> array of field names in display order).
 * Used to display record-show fields in schema order when the file is provided (e.g. from
 * twenty-workspace-automation config/field-order-by-object.json copied to public/field-order.json).
 */
let fieldOrderCache: Record<string, string[]> | null | undefined = undefined;
let fieldOrderPromise: Promise<Record<string, string[]> | null> | null = null;

function fetchFieldOrder(): Promise<Record<string, string[]> | null> {
  if (fieldOrderCache !== undefined) {
    return Promise.resolve(fieldOrderCache);
  }
  if (fieldOrderPromise) {
    return fieldOrderPromise;
  }
  const url =
    (typeof import.meta !== 'undefined' &&
      (import.meta as unknown as { env?: { VITE_FIELD_ORDER_URL?: string } })
        ?.env?.VITE_FIELD_ORDER_URL) ||
    '/field-order.json';
    const debug =
    typeof import.meta !== 'undefined' &&
    (import.meta as unknown as { env?: { VITE_DEBUG_FIELD_ORDER?: string } })?.env
      ?.VITE_DEBUG_FIELD_ORDER === 'true';
  const promise = fetch(url)
    .then((res) => {
      if (debug) {
        console.log(
          '[field-order] fetch',
          url,
          res.ok ? 'OK' : `HTTP ${res.status}`,
        );
      }
      return res.ok ? res.json() : null;
    })
    .catch((err) => {
      if (debug) console.warn('[field-order] fetch failed', err);
      return null;
    })
    .then((data): Record<string, string[]> | null => {
      const result =
        data && typeof data === 'object' ? (data as Record<string, string[]>) : null;
      fieldOrderCache = result;
      if (debug) {
        const keys = result ? Object.keys(result) : [];
        console.log('[field-order] loaded', result ? keys.length : 0, 'objects:', keys.slice(0, 5).join(', '), keys.length > 5 ? '...' : '');
      }
      return result;
    });
  fieldOrderPromise = promise;
  return promise;
}

export function useFieldOrderByObject(): Record<string, string[]> | null {
  const [fieldOrderByObject, setFieldOrderByObject] = useState<
    Record<string, string[]> | null
  >(fieldOrderCache ?? null);

  useEffect(() => {
    if (fieldOrderCache !== undefined) {
      setFieldOrderByObject(fieldOrderCache);
      return;
    }
    fetchFieldOrder().then(setFieldOrderByObject);
  }, []);

  return fieldOrderByObject;
}
