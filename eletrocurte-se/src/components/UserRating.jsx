import React, { useState, useRef, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

// Componente para o card de avaliação
function AvaliacaoCard({ produtosAguardando, produtosParaAvaliar, onAvaliar }) {
  const [open, setOpen] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [produtoIdx, setProdutoIdx] = useState(0); // índice do produto selecionado
  const iframeRef = useRef(null);

  const handleAvaliarClick = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNota(0);
    setComentario('');
    setProdutoIdx(0);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onAvaliar(nota, comentario, produtoIdx);
    handleClose();
  };

  useEffect(() => {
    if (open && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.body.innerHTML = '';
        const style = doc.createElement('style');
        style.textContent = `
          body { margin:0; font-family:sans-serif; background:#fff; }
          .avaliacao-frame { display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; padding:24px; border-radius:12px; box-shadow:0 4px 24px #0002; background:#fff; }
          .avaliacao-frame textarea { flex:1 1 auto; width:100%; margin-top:10px; resize:vertical; border-radius:6px; border:1px solid #ccc; padding:8px; min-height:120px; max-height:300px; font-size:1em; }
          .avaliacao-frame button { margin-right:8px; border:none; background:#1976d2; color:#fff; padding:8px 16px; border-radius:6px; cursor:pointer; transition:background .2s; }
          .avaliacao-frame button[type=button] { background:#aaa; }
          .avaliacao-frame button:hover { background:#125ea2; }
          .avaliacao-frame .botoes { margin-top:10px; display:flex; gap:8px; }
          .produto-select { margin-bottom:12px; }
          .produto-select img { width:48px; height:48px; object-fit:cover; border-radius:8px; margin-right:8px; vertical-align:middle; }
          .star { font-size:1.5em; cursor:pointer; color:#ffc107; transition:color .2s; }
          .star.inactive { color:#ccc; }
        `;
        doc.head.appendChild(style);
        const form = doc.createElement('form');
        form.className = 'avaliacao-frame';
        form.style.height = '100%';
        // Seletor de produto
        let selectHtml = `<div class='produto-select'><label for='produto'>Produto: </label><select id='produto'>`;
        produtosParaAvaliar.forEach((p, idx) => {
          selectHtml += `<option value='${idx}' ${idx === produtoIdx ? 'selected' : ''}>${p.nome}</option>`;
        });
        selectHtml += `</select> <img id='produto-img' src='${produtosParaAvaliar[produtoIdx].img}' alt='' /></div>`;
        form.innerHTML = `
          ${selectHtml}
          <div style='display:flex;align-items:center;gap:8px;'>
            <span>Avaliação:</span>
            <span id='rating'></span>
          </div>
          <textarea id='comentario' placeholder='Deixe seu comentário...' rows='6' required></textarea>
          <div class='botoes'>
            <button type='submit' id='enviar'>Enviar</button>
            <button type='button' id='cancelar'>Cancelar</button>
          </div>
        `;
        doc.body.appendChild(form);
        // Produto select
        const select = doc.getElementById('produto');
        const produtoImg = doc.getElementById('produto-img');
        select.onchange = (e) => {
          setProdutoIdx(Number(e.target.value));
        };
        produtoImg.src = produtosParaAvaliar[produtoIdx].img;
        // Rating stars (semestre estrela)
        const ratingSpan = doc.getElementById('rating');
        ratingSpan.style.display = 'flex';
        ratingSpan.style.alignItems = 'center';
        ratingSpan.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
          const star = doc.createElement('span');
          star.className = 'star';
          star.innerHTML = (nota >= i) ? '★' : '☆';
          // Efeito hover: preenche até a estrela atual
          star.onmousemove = () => {
            Array.from(ratingSpan.children).forEach((s, idx) => {
              s.innerHTML = (idx < i) ? '★' : '☆';
            });
          };
          // Ao sair do hover, volta ao valor selecionado
          star.onmouseleave = () => {
            Array.from(ratingSpan.children).forEach((s, idx) => {
              s.innerHTML = (nota >= idx + 1) ? '★' : '☆';
            });
          };
          // Seleciona a nota
          star.onclick = () => {
            setNota(i);
          };
          ratingSpan.appendChild(star);
        }
        // Atualiza estrelas ao mudar nota
        const updateStars = () => {
          Array.from(ratingSpan.children).forEach((star, idx) => {
            star.innerHTML = (nota >= idx + 1) ? '★' : '☆';
          });
        };
        updateStars();
        // Comentário
        const textarea = doc.getElementById('comentario');
        // Corrige: captura o valor do textarea no submit e envia corretamente
        // Cancelar
        doc.getElementById('cancelar').onclick = (e) => {
          e.preventDefault();
          handleClose();
        };
        // Submit
        form.onsubmit = (e) => {
          e.preventDefault();
          // Mensagem de erro customizada
          let msgErro = doc.getElementById('msg-erro');
          if (!msgErro) {
            msgErro = doc.createElement('div');
            msgErro.id = 'msg-erro';
            msgErro.style.cssText = 'color:#b71c1c;background:#fff3f3;border:1px solid #ffcdd2;padding:8px 12px;border-radius:6px;margin-bottom:10px;font-size:15px;display:none;align-items:center;gap:8px;';
            form.insertBefore(msgErro, form.firstChild);
          }
          msgErro.style.display = 'none';
          const comentarioAtual = doc.getElementById('comentario').value;
          if (nota < 1) {
            msgErro.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#e53935"></i>Por favor, selecione uma nota de estrelas para enviar.';
            msgErro.style.display = 'flex';
            return;
          }
          if (comentarioAtual.trim() === '') {
            msgErro.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#e53935"></i>Por favor, escreva um comentário antes de enviar.';
            msgErro.style.display = 'flex';
            return;
          }
          onAvaliar(nota, comentarioAtual, produtoIdx);
          handleClose();
        };
      }
    }
    // eslint-disable-next-line
  }, [open, nota, comentario, produtoIdx, produtosParaAvaliar]);

  useEffect(() => {
    if (open) {
      // Impede scroll da página principal
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <section className="avaliacao">
      <button onClick={handleAvaliarClick}>
        <i className="fas fa-star"></i> Avaliar
      </button>
      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <iframe
            ref={iframeRef}
            title="Avaliação"
            style={{ width: 420, height: 370, border: 'none', borderRadius: 16, boxShadow: '0 8px 32px #0003', background: '#fff' }}
          />
        </div>
      )}
    </section>
  );
}

const UserRating = ({ produtosAguardando = 1, imagem = "/imagens/raquete_elétrica2.jpeg", produtosParaAvaliar = [], onAvaliar = () => {} }) => {
  return (
    <div>
      <AvaliacaoCard
        produtosAguardando={produtosAguardando}
        produtosParaAvaliar={produtosParaAvaliar}
        onAvaliar={onAvaliar}
      />
    </div>
  );
}

export default UserRating;