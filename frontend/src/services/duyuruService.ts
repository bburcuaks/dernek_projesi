import api from './api';

const BASE_URL = 'http://localhost:8080';

export interface Duyuru {
  id: number;
  konu: string;
  icerik: string;
  gecerlilikTarihi?: string;
  resimYolu?: string;
}

export interface DuyuruRequestDto {
  konu: string;
  icerik: string;
  gecerlilikTarihi?: string;
  resimYolu?: string;
}

export const duyuruService = {
  getDuyurular: async (): Promise<Duyuru[]> => {
    const response = await api.get<Duyuru[]>('/duyurular');
    return response.data;
  },

  createDuyuru: async (data: DuyuruRequestDto): Promise<Duyuru> => {
    const response = await api.post<Duyuru>('/duyurular', data);
    return response.data;
  },

  updateDuyuru: async (id: number, data: DuyuruRequestDto): Promise<Duyuru> => {
    const response = await api.put<Duyuru>(`/duyurular/${id}`, data);
    return response.data;
  },

  deleteDuyuru: async (id: number): Promise<void> => {
    await api.delete(`/duyurular/${id}`);
  }
};