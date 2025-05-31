// -----------------------------------------------------------------------------
// Enderecos.jsx
// Componente de gerenciamento de endereços de entrega do usuário.
// Permite visualizar, selecionar, adicionar e remover endereços, com persistência
// em localStorage. Utiliza Material-UI para UI e diálogos. Integrado ao ModalEndereco
// para cadastro de novos endereços.
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalEndereco from './ModalEndereco';

export default function Enderecos({ onVoltar }) {
  // Lista de endereços do usuário, persistida em localStorage.
  const [enderecos, setEnderecos] = useState(() => {
    // Busca endereços salvos ou inicializa com exemplos.
    const armazenados = localStorage.getItem('enderecos');
    return armazenados ? JSON.parse(armazenados) : [
      {
        id: 'endereco1',
        texto: 'Rua das Flores, 123 - Centro, São Paulo/SP'
      },
      {
        id: 'endereco2',
        texto: 'Av. Brasil, 456 - Jardim, Rio de Janeiro/RJ'
      }
    ];
  });

  // ID do endereço atualmente selecionado para entrega.
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(
    localStorage.getItem('enderecoSelecionado') || 'endereco1'
  );

  // Controle de exibição do modal de cadastro de endereço.
  const [modalAberto, setModalAberto] = useState(false);
  // Controle do diálogo de confirmação de remoção de endereço.
  const [dialogRemover, setDialogRemover] = useState({ open: false, id: null });

  // Atualiza localStorage sempre que endereços mudam.
  useEffect(() => {
    localStorage.setItem('enderecos', JSON.stringify(enderecos));
  }, [enderecos]);

  // Atualiza localStorage sempre que o endereço selecionado muda.
  useEffect(() => {
    localStorage.setItem('enderecoSelecionado', enderecoSelecionado);
  }, [enderecoSelecionado]);

  // Adiciona um novo endereço à lista e o seleciona.
  const adicionarEndereco = (enderecoCompleto) => {
    // Formata o endereço caso seja objeto (retorno do ModalEndereco).
    const texto = typeof enderecoCompleto === 'object' && enderecoCompleto !== null
      ? `${enderecoCompleto.logradouro || ''}, ${enderecoCompleto.numero || ''} ${enderecoCompleto.complemento ? '- ' + enderecoCompleto.complemento : ''} - ${enderecoCompleto.bairro || ''}, ${enderecoCompleto.localidade || ''}/${enderecoCompleto.uf || ''}`.replace(/\s+/g, ' ').trim()
      : enderecoCompleto;
    const novo = { id: `endereco${Date.now()}`, texto };
    setEnderecos([...enderecos, novo]);
    setEnderecoSelecionado(novo.id);
  };

  // Remove endereço pelo id e ajusta seleção se necessário.
  const removerEndereco = (id) => {
    const filtrados = enderecos.filter(e => e.id !== id);
    setEnderecos(filtrados);
    if (id === enderecoSelecionado && filtrados.length > 0) {
      setEnderecoSelecionado(filtrados[0].id);
    } else if (filtrados.length === 0) {
      setEnderecoSelecionado('');
    }
  };

  // Abre diálogo de confirmação para remover endereço.
  const handleRemoverClick = (id) => {
    setDialogRemover({ open: true, id });
  };

  // Confirma remoção do endereço selecionado no diálogo.
  const confirmarRemover = () => {
    removerEndereco(dialogRemover.id);
    setDialogRemover({ open: false, id: null });
  };

  // Cancela diálogo de remoção.
  const cancelarRemover = () => {
    setDialogRemover({ open: false, id: null });
  };

  return (
    <div className="editarperfil-card-form">
      {/* Título da seção */}
      <Typography variant="h5" gutterBottom>Endereços de Entrega</Typography>
      {/* Formulário de seleção de endereço usando Material-UI */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Escolha o endereço para entrega</FormLabel>
        <RadioGroup
          value={enderecoSelecionado}
          onChange={(e) => setEnderecoSelecionado(e.target.value)}
        >
          {/* Lista de endereços com opção de remoção */}
          {enderecos.map((endereco) => (
            <div key={endereco.id} style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value={endereco.id}
                control={<Radio />}
                label={endereco.texto}
              />
              {/* Botão para remover endereço, com ícone de lixeira */}
              <IconButton onClick={() => handleRemoverClick(endereco.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          ))}
        </RadioGroup>
      </FormControl>

      {/* Botão para abrir modal de cadastro de novo endereço */}
      <Button variant="outlined" sx={{ mt: 3, width: '100%' }} onClick={() => setModalAberto(true)}>
        Cadastrar Novo Endereço
      </Button>

      {/* Modal para cadastro de novo endereço */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
        <DialogTitle>Novo Endereço</DialogTitle>
        <DialogContent>
          {/* Componente ModalEndereco para formulário de cadastro */}
          <ModalEndereco onSalvar={(endereco) => {
            adicionarEndereco(endereco);
            setModalAberto(false);
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para remoção de endereço */}
      <Dialog open={dialogRemover.open} onClose={cancelarRemover}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja remover o local cadastrado?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarRemover} color="inherit">Cancelar</Button>
          <Button onClick={confirmarRemover} color="error" variant="contained">Remover</Button>
        </DialogActions>
      </Dialog>

      {/* Botão para confirmar seleção e voltar ao perfil */}
      <div style={{ marginTop: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onVoltar}
          sx={{ width: '100%' }}
        >
          Confirmar e Voltar ao Perfil
        </Button>
      </div>
    </div>
  );
}