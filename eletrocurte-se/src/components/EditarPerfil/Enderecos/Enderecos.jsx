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
  const [enderecos, setEnderecos] = useState(() => {
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

  const [enderecoSelecionado, setEnderecoSelecionado] = useState(
    localStorage.getItem('enderecoSelecionado') || 'endereco1'
  );

  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    localStorage.setItem('enderecos', JSON.stringify(enderecos));
  }, [enderecos]);

  useEffect(() => {
    localStorage.setItem('enderecoSelecionado', enderecoSelecionado);
  }, [enderecoSelecionado]);

  const adicionarEndereco = (enderecoCompleto) => {
    const novo = { id: `endereco${Date.now()}`, texto: enderecoCompleto };
    setEnderecos([...enderecos, novo]);
    setEnderecoSelecionado(novo.id);
  };

  const removerEndereco = (id) => {
    const filtrados = enderecos.filter(e => e.id !== id);
    setEnderecos(filtrados);
    if (id === enderecoSelecionado && filtrados.length > 0) {
      setEnderecoSelecionado(filtrados[0].id);
    } else if (filtrados.length === 0) {
      setEnderecoSelecionado('');
    }
  };

  return (
    <div className="editarperfil-card-form">
      <Typography variant="h5" gutterBottom>Endereços de Entrega</Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Escolha o endereço para entrega</FormLabel>
        <RadioGroup
          value={enderecoSelecionado}
          onChange={(e) => setEnderecoSelecionado(e.target.value)}
        >
          {enderecos.map((endereco) => (
            <div key={endereco.id} style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value={endereco.id}
                control={<Radio />}
                label={endereco.texto}
              />
              <IconButton onClick={() => removerEndereco(endereco.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </RadioGroup>
      </FormControl>

      <Button variant="outlined" sx={{ mt: 3 }} onClick={() => setModalAberto(true)}>
        Cadastrar Novo Endereço
      </Button>

      <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
        <DialogTitle>Novo Endereço</DialogTitle>
        <DialogContent>
          <ModalEndereco onSalvar={(endereco) => {
            adicionarEndereco(endereco);
            setModalAberto(false);
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <div style={{ marginTop: '1rem' }}>
        <Button variant="contained" color="primary" onClick={onVoltar}>
          Confirmar e Voltar ao Perfil
        </Button>
      </div>
    </div>
  );
}