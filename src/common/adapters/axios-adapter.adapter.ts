import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      throw new Error(`Something is wrong please check logs`);
    }
  }
}
