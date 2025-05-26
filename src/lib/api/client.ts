const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 10000;

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'signal'> {
  timeout?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<{ data: T; headers: Headers }> {
  const url = `${API_BASE_URL}${endpoint}`;
  const { timeout = DEFAULT_TIMEOUT, ...requestOptions } = options;

  // Debug logging
  console.log('🚀 API Request:', {
    url,
    method: requestOptions.method || 'GET',
    headers: requestOptions.headers,
    body: requestOptions.body,
  });

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...requestOptions.headers,
    },
    credentials: 'include',
    signal: controller.signal,
    ...requestOptions,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Debug logging for response
    console.log('📥 API Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      // Try to extract error message from response body
      let errorMessage = `HTTP ${response.status}`;
      let errorData: any = null;

      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const textError = await response.text();
          if (textError) errorMessage = textError;
        }
      } catch (parseError) {
        console.warn('Failed to parse error response:', parseError);
      }

      console.error('❌ API Error:', {
        url,
        status: response.status,
        errorMessage,
        errorData,
      });

      if (response.status === 401) {
        throw new ApiError(
          401,
          errorMessage || 'Authentication required',
          response
        );
      }
      if (response.status === 403) {
        throw new ApiError(403, errorMessage || 'Access forbidden', response);
      }
      if (response.status === 404) {
        throw new ApiError(404, errorMessage || 'Resource not found', response);
      }
      if (response.status >= 500) {
        throw new ApiError(
          response.status,
          errorMessage || 'Server error',
          response
        );
      }

      throw new ApiError(response.status, errorMessage, response);
    }

    // Handle empty responses (204 No Content, etc.)
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    let data: T;
    if (contentLength === '0' || response.status === 204) {
      data = null as T;
    } else if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses, return as text
      data = (await response.text()) as T;
    }

    console.log('✅ API Success:', {
      url,
      data,
    });

    return { data, headers: response.headers };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏰ Request timeout:', url);
      throw new ApiError(408, 'Request timeout');
    }

    // Handle CORS and network errors
    console.error('🌐 Network/CORS Error:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
    });

    throw new ApiError(0, 'Network error or CORS issue');
  }
}

// Helper methods for different HTTP verbs
export const api = {
  get: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, options),

  post: <T>(endpoint: string, data: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),

  put: <T>(endpoint: string, data: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),

  patch: <T>(endpoint: string, data: unknown, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
      ...options,
    }),
};
