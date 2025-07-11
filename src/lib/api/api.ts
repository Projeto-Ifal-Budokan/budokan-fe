import { handleNotAccessPage, handleUnauthorized } from '@/app/actions/auth';
import { getAuthHeaders } from '@/utils/cookie-utils';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { toast } from 'sonner';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

const DEBUG = process.env.NODE_ENV === 'development';

// Default timeout in milliseconds
const DEFAULT_TIMEOUT = 10000;

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: Response,
    public data?: unknown // Add data property to store response data
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'signal'> {
  timeout?: number;
  throwOnHttpError?: boolean; // New option to control error throwing
}

export interface ApiResponse<T> {
  data: T;
  response: Response;
  status: number;
  ok: boolean;
}

export interface ApiPaginatedResponse<T> {
  items: T;
  count: number;
  page: number;
  page_size: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const {
    timeout = DEFAULT_TIMEOUT,
    throwOnHttpError = true, // Default to true for backward compatibility
    ...requestOptions
  } = options;

  if (DEBUG) {
    console.log('🚀 API Request:', {
      url,
      method: requestOptions.method || 'GET',
      headers: requestOptions.headers,
      body: requestOptions.body,
    });
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const config: RequestInit = {
    headers: {
      // Only set Content-Type to JSON if body is not FormData
      ...(!(options.body instanceof FormData) && {
        'Content-Type': 'application/json',
      }),
      ...requestOptions.headers,
      Cookie: await getAuthHeaders(),
    },
    credentials: 'include',
    signal: controller.signal,
    ...requestOptions,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Debug logging for response
    if (DEBUG) {
      console.log('📥 API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }

    // Parse response data regardless of status
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    let data: T;
    if (contentLength === '0' || response.status === 204) {
      data = null as T;
    } else if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.clone().json(); // Use clone() to allow re-reading
      } catch (parseError) {
        if (DEBUG) console.warn('Failed to parse JSON response:', parseError);
        data = (await response.text()) as T;
      }
    } else {
      data = (await response.text()) as T;
    }

    const apiResponse: ApiResponse<T> = {
      data,
      response,
      status: response.status,
      ok: response.ok,
    };

    if (!response.ok) {
      // Extract error message
      let errorMessage = `HTTP ${response.status}`;

      if (data && typeof data === 'object') {
        const errorData = data as { message?: string; error?: string };
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else if (typeof data === 'string') {
        errorMessage = data || errorMessage;
      }

      toast.error(errorMessage);
      if (DEBUG) {
        console.error('API Error:', {
          url,
          status: response.status,
          errorMessage,
          data,
        });
      }

      // If throwOnHttpError is false, return the response even for errors
      if (!throwOnHttpError) {
        if (DEBUG) console.log('🔄 Returning error response without throwing');
        return apiResponse;
      }

      // Create error with data attached
      const apiError = new ApiError(
        response.status,
        errorMessage,
        response,
        data
      );

      // Specific error handling
      if (response.status === 401) {
        // Call the server action to handle unauthorized access
        await handleUnauthorized();

        throw new ApiError(
          401,
          errorMessage || 'Authentication required',
          response,
          data
        );
      }
      if (response.status === 403) {
        await handleNotAccessPage();
        throw new ApiError(
          403,
          errorMessage || 'Access forbidden',
          response,
          data
        );
      }
      if (response.status === 404) {
        throw new ApiError(
          404,
          errorMessage || 'Resource not found',
          response,
          data
        );
      }
      if (response.status >= 500) {
        throw new ApiError(
          response.status,
          errorMessage || 'Server error',
          response,
          data
        );
      }

      throw apiError;
    }

    if (DEBUG) {
      console.log('✅ API Success:', {
        url,
        data,
      });
    }

    return apiResponse;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    // Handle AbortError (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      if (DEBUG) console.error('⏰ Request timeout:', url);
      throw new ApiError(408, 'Request timeout');
    }

    // Handle CORS and network errors
    if (DEBUG) {
      console.error('🌐 Network/CORS Error:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
      });
    }

    throw new ApiError(0, 'Network error or CORS issue');
  }
}

// Helper methods for different HTTP verbs with both throwing and non-throwing variants
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
