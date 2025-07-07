// Exports centralizados de todos los repositories
import { CiudadanoRepository } from './ciudadanoRepository.js';
import { AutoridadRepository } from './autoridadRepository.js';
import { VotacionRepository } from './votacionRepository.js';
import { PoliticoRepository } from './politicoRepository.js';
import { DepartamentoRepository } from './departamentoRepository.js';

// Crear instancias de los repositories para usar directamente
export const ciudadanoRepository = new CiudadanoRepository();
export const autoridadRepository = new AutoridadRepository();
export const votacionRepository = new VotacionRepository();
export const politicoRepository = new PoliticoRepository();
export const departamentoRepository = new DepartamentoRepository(); 