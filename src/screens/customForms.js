import ClienteForm from '../forms/ClienteForm';
import TracoForm from '../forms/TracoForm';
import CarregamentoForm from '../forms/CarregamentoForm';
import NfForm from '../forms/NfForm';
import CotacaoForm from '../forms/CotacaoForm';

const REGISTRY = {
  cliente: ClienteForm,
  traco: TracoForm,
  carregamento: CarregamentoForm,
  nf: NfForm,
  cotacao: CotacaoForm,
};

export function getCustomForm(key) {
  return REGISTRY[key];
}
