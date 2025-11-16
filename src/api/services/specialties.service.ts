import axios from "axios";

export interface Specialty {
  id: string;
  name: string;
  description?: string;
  consultationDuration: number;
  basePrice?: number;
  doctorsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSpecialtyDto {
  name: string;
  description?: string;
  consultationDuration?: number;
  basePrice?: number;
}

class SpecialtiesService {
  async create(data: CreateSpecialtyDto): Promise<Specialty> {
    const response = await axios.post('/specialties', data);
    return response.data;
  }

  async getAll(includeInactive: boolean = true): Promise<Specialty[]> {
    const response = await axios.get('/specialties', {
      params: { includeInactive }
    });
    return response.data;
  }

  async getById(id: string): Promise<Specialty> {
    const response = await axios.get(`/specialties/${id}`);
    return response.data;
  }

  async getByName(name: string): Promise<Specialty> {
    const response = await axios.get(`/specialties/name/${name}`);
    return response.data;
  }

  async search(searchTerm: string): Promise<Specialty[]> {
    const response = await axios.get('/specialties/search/query', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  async getWithAvailableDoctors(): Promise<Specialty[]> {
    const response = await axios.get('/specialties/available/list');
    return response.data;
  }

  async getAllSorted(
    orderBy: 'name' | 'basePrice' | 'consultationDuration' = 'name',
    order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<Specialty[]> {
    const response = await axios.get('/specialties/sorted/list', {
      params: { orderBy, order }
    });
    return response.data;
  }

  async getByPriceRange(minPrice: number, maxPrice: number): Promise<Specialty[]> {
    const response = await axios.get('/specialties/price-range/filter', {
      params: { minPrice, maxPrice }
    });
    return response.data;
  }

  async getMostPopular(limit: number = 5): Promise<Specialty[]> {
    const response = await axios.get('/specialties/popular/list', {
      params: { limit }
    });
    return response.data;
  }

  async update(id: string, data: Partial<CreateSpecialtyDto>): Promise<Specialty> {
    const response = await axios.patch(`/specialties/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/specialties/${id}`);
    return response.data;
  }

  async exists(name: string): Promise<{ name: string; exists: boolean }> {
    const response = await axios.get(`/specialties/exists/${name}`);
    return response.data;
  }

  async count(onlyWithDoctors: boolean = false): Promise<{ total: number; onlyWithDoctors: boolean }> {
    const response = await axios.get('/specialties/stats/count', {
      params: { onlyWithDoctors }
    });
    return response.data;
  }

  async countDoctors(
    id: string,
    onlyAvailable: boolean = true
  ): Promise<{ specialtyId: string; count: number; onlyAvailable: boolean }> {
    const response = await axios.get(`/specialties/${id}/doctors/count`, {
      params: { onlyAvailable }
    });
    return response.data;
  }

  async getStatistics(id: string): Promise<any> {
    const response = await axios.get(`/specialties/${id}/statistics`);
    return response.data;
  }
}

export const specialtiesService = new SpecialtiesService();