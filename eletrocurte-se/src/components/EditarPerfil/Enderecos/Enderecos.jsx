// -----------------------------------------------------------------------------
// Enderecos.jsx
// User delivery address management component.
// Allows viewing, selecting, adding, and removing addresses, with persistence
// in localStorage. Uses Material-UI for UI and dialogs. Integrated with ModalEndereco
// for registering new addresses.
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
  DialogActions,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalEndereco from './ModalEndereco';
import Alert from '@mui/material/Alert';

export default function Enderecos({ onVoltar }) {
  // List of user addresses, persisted in localStorage.
  const [enderecos, setEnderecos] = useState(() => {
    // Fetches saved addresses or initializes with examples.
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

  // ID of the currently selected delivery address.
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(
    localStorage.getItem('enderecoSelecionado') || 'endereco1'
  );

  // Controls display of the address registration modal.
  const [modalAberto, setModalAberto] = useState(false);
  // Controls the address removal confirmation dialog.
  const [dialogRemover, setDialogRemover] = useState({ open: false, id: null });
  // State for confirmation message when changing address
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Updates localStorage and backend whenever addresses change.
  useEffect(() => {
    localStorage.setItem('enderecos', JSON.stringify(enderecos));
    // Updates backend
    const userId = localStorage.getItem('userId');
    fetch(`${process.env.REACT_APP_API_URL}/usuarios/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enderecos })
    });
  }, [enderecos]);

  // Updates localStorage and backend whenever the selected address changes.
  useEffect(() => {
    localStorage.setItem('enderecoSelecionado', enderecoSelecionado);
    // Updates backend
    const userId = localStorage.getItem('userId');
    fetch(`${process.env.REACT_APP_API_URL}/usuarios/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enderecoSelecionado })
    });
  }, [enderecoSelecionado]);

  // When changing the selected address, shows confirmation message
  const handleChangeEndereco = (e) => {
    setEnderecoSelecionado(e.target.value);
    setSnackbar({ open: true, message: 'Local de entrega alterado com sucesso!' });
  };

  // Adds a new address to the list and selects it.
  const adicionarEndereco = (enderecoCompleto) => {
    // Formats the address if it's an object (ModalEndereco return).
    const texto = typeof enderecoCompleto === 'object' && enderecoCompleto !== null
      ? `${enderecoCompleto.logradouro || ''}, ${enderecoCompleto.numero || ''} ${enderecoCompleto.complemento ? '- ' + enderecoCompleto.complemento : ''} - ${enderecoCompleto.bairro || ''}, ${enderecoCompleto.localidade || ''}/${enderecoCompleto.uf || ''}`.replace(/\s+/g, ' ').trim()
      : enderecoCompleto;
    const novo = { id: `endereco${Date.now()}`, texto };
    setEnderecos([...enderecos, novo]);
    setEnderecoSelecionado(novo.id);
  };

  // Removes address by id and adjusts selection if necessary.
  const removerEndereco = (id) => {
    const filtrados = enderecos.filter(e => e.id !== id);
    setEnderecos(filtrados);
    if (id === enderecoSelecionado && filtrados.length > 0) {
      setEnderecoSelecionado(filtrados[0].id);
    } else if (filtrados.length === 0) {
      setEnderecoSelecionado('');
    }
  };

  // Opens confirmation dialog to remove address.
  const handleRemoverClick = (id) => {
    setDialogRemover({ open: true, id });
  };

  // Confirms removal of the selected address in the dialog.
  const confirmarRemover = () => {
    removerEndereco(dialogRemover.id);
    setDialogRemover({ open: false, id: null });
  };

  // Cancels removal dialog.
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
          onChange={handleChangeEndereco}
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

      {/* Snackbar de confirmação ao trocar endereço */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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