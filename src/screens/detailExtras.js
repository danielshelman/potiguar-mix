import TracoExtra from './detailExtras/TracoExtra';
import ClienteExtra from './detailExtras/ClienteExtra';
import CorpoDeProvaExtra from './detailExtras/CorpoDeProvaExtra';
import CarregamentoExtra from './detailExtras/CarregamentoExtra';
import CotacaoExtra from './detailExtras/CotacaoExtra';
import PedidoCompraExtra from './detailExtras/PedidoCompraExtra';
import ContaPagarExtra from './detailExtras/ContaPagarExtra';
import FrotaExtra from './detailExtras/FrotaExtra';
import OrdemProducaoExtra from './detailExtras/OrdemProducaoExtra';

const REGISTRY = {
  traco: TracoExtra,
  cliente: ClienteExtra,
  'corpo-de-prova': CorpoDeProvaExtra,
  carregamento: CarregamentoExtra,
  cotacao: CotacaoExtra,
  'pedido-compra': PedidoCompraExtra,
  'conta-pagar': ContaPagarExtra,
  frota: FrotaExtra,
  'ordem-producao': OrdemProducaoExtra,
};

export function getDetailExtra(key) {
  return REGISTRY[key];
}
