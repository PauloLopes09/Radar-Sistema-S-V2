
import { Institution } from './types';

export const INITIAL_INSTITUTIONS: Institution[] = [
  // Nordeste (Original)
  { id: '1', name: 'SENAI', state: 'Rio Grande do Norte', initials: 'SENAI RN', url: 'https://www.fiern.org.br/processos-de-selecao/', status: 'online' },
  { id: '2', name: 'SENAC', state: 'Rio Grande do Norte', initials: 'SENAC RN', url: 'https://www2.rn.senac.br/licitacao', status: 'online' },
  { id: '4', name: 'SEBRAE', state: 'Rio Grande do Norte', initials: 'SEBRAE RN', url: 'https://sebrae.com.br/sites/PortalSebrae/ufs/rn/sebraeaz/licitacoes-e-pregao', status: 'online' },
  { id: '8', name: 'SENAI', state: 'Paraíba', initials: 'SENAI PB', url: 'https://licitacoes.fiepb.org.br/', status: 'online' },
  { id: '11', name: 'SEBRAE', state: 'Paraíba', initials: 'SEBRAE PB', url: 'https://www.scf3.sebrae.com.br/PortalCf/Licitacoes', status: 'online' },
  { id: '14', name: 'SENAI', state: 'Ceará', initials: 'SENAI CE', url: 'https://licitacoes.sfiec.org.br/', status: 'online' },
  { id: '16', name: 'SEBRAE', state: 'Ceará', initials: 'SEBRAE CE', url: 'https://www.scf3.sebrae.com.br/PortalCf/Licitacoes', status: 'online' },
  
  // Sudeste
  { id: '18', name: 'SENAI', state: 'São Paulo', initials: 'SENAI SP', url: 'https://sp.senai.br/licitacoes', status: 'online' },
  { id: '19', name: 'SESI', state: 'São Paulo', initials: 'SESI SP', url: 'https://www.sesisp.org.br/licitacoes', status: 'online' },
  { id: '20', name: 'SENAC', state: 'Rio de Janeiro', initials: 'SENAC RJ', url: 'https://www.rj.senac.br/licitacoes', status: 'online' },
  { id: '21', name: 'FIEMG', state: 'Minas Gerais', initials: 'FIEMG/SENAI MG', url: 'https://www.fiemg.com.br/licitacoes/', status: 'online' },
  
  // Sul
  { id: '22', name: 'SENAI', state: 'Paraná', initials: 'SENAI PR', url: 'https://www.sistemafiep.org.br/licitacoes/', status: 'online' },
  { id: '23', name: 'SESC', state: 'Rio Grande do Sul', initials: 'SESC RS', url: 'https://www.sesc-rs.com.br/licitacoes/', status: 'online' },
  
  // Centro-Oeste
  { id: '24', name: 'SEBRAE', state: 'Distrito Federal', initials: 'SEBRAE DF', url: 'https://www.sebrae.com.br/sites/PortalSebrae/ufs/df/licitacoes', status: 'online' },
  
  // Norte
  { id: '25', name: 'SENAI', state: 'Amazonas', initials: 'SENAI AM', url: 'https://www.fieam.org.br/senai/licitacoes/', status: 'online' },
];

export const STATES = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

export const INSTITUTION_TYPES = ['SENAI', 'SENAC', 'SESC', 'SESI', 'SEBRAE', 'SENAR', 'SEST', 'SESCOOP'];
