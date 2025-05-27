/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpFetch {
  private static baseUrl: string = 'http://192.168.18.47:3333'

  public static async get<T = any>(
    url: string,
    options?: Partial<RequestInit>,
  ): Promise<T | string | void> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get data`)
    }

    return this.parseResponse<T>(response)
  }

  public static async post<C extends object = any, T = any>(
    url: string,
    body: C,
    options?: Partial<RequestInit>,
  ): Promise<T | string | void> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Failed to post data`)
    }

    return this.parseResponse<T>(response)
  }

  private static async parseResponse<T>(
    response: Response,
  ): Promise<T | string | void> {
    const contentLength = response.headers.get('content-length')
    if (
      response.status === 204 ||
      !contentLength ||
      parseInt(contentLength, 10) === 0
    ) {
      return
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json() as Promise<T>
    }

    return response.text()
  }
}
