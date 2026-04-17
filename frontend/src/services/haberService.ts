import api from './api';

export interface Haber {
  id: number;
  konu: string;
  icerik: string;
  resimYolu?: string;
  gecerlilikTarihi?: string;
  haberLinki?: string;
}

export const haberService = {
  // Public
  getHaberler: async (): Promise<Haber[]> => {
    const response = await api.get<Haber[]>('/haberler');
    return response.data;
  },

  // Admin
  createHaber: async (data: Partial<Haber>) => {
    const response = await api.post('/haberler', data);
    return response.data;
  },

  updateHaber: async (id: number, data: Partial<Haber>) => {
    const response = await api.put(`/haberler/${id}`, data);
    return response.data;
  },

  deleteHaber: async (id: number) => {
    const response = await api.delete(`/haberler/${id}`);
    return response.data;
  }
};