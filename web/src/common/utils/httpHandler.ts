import services from '@/common/constants/services';

// type fetchType = 'no-store' | 'force-cache'
type fetchType = 'ssg' | 'ssr' | 'isr';

export const httpHandler = {
  /**
   * fetch get 업무 수행
   * @param path
   * @param pFetchType 'ssg' | 'ssr' | 'isr'
   * @param revalidate number : isr 일시 필수 값
   * @returns Promise<T>
   */
  async get<T>(
    pPath: string,
    pParams?: object,
    pFetchType: fetchType = 'ssg',
    revalidate?: number
  ): Promise<T | null> {
    let fetchType: object = {};
    if (pFetchType === 'ssg') {
      fetchType = { cache: 'no-store' };
    } else if (pFetchType === 'ssr') {
      fetchType = { cache: 'force-cache' };
    } else if (pFetchType === 'isr' && revalidate !== undefined) {
      fetchType = { next: { revalidate: revalidate } };
    }
    // get params
    const params = pParams ? pParams : ({} as any);
    // params query 변환
    let query = Object.keys(params as object)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    try {
      const req = await fetch(
        services.api.host +
          '/' +
          services.api.version +
          '/' +
          pPath +
          '?' +
          query,
        {
          method: services.api.method.get,
          ...fetchType,
        }
      );
      const res = await req.json();
      if (res.code === services.code.success) {
        return res;
      } else {
        console.log(`fail ${pPath} api`);
        return res;
      }
    } catch (error) {
      throw new Error(`error ${pPath} api`);
    }
    return null;
  },

  /**
   * fetch post 업무 수행
   * @param path string
   * @param pReq object
   * @returns Promise<T>
   */
  async post<T>(path: string, pReq: object): Promise<T | null> {
    try {
      const req = await fetch('/' + services.api.version + '/' + path, {
        method: services.api.method.post,
        headers: {
          'Content-Type': services.api.contentType,
        },
        body: JSON.stringify(pReq),
      });
      const res = await req.json();
      if (res.code === services.code.success) {
        return res;
      } else {
        console.log(`fail ${path} api`);
        return res;
      }
    } catch (error) {
      throw new Error(`error ${path} api`);
    }
    return null;
  },
};
