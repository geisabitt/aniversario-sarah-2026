"use client";

import { useEffect, useState } from "react";
import {
  Gift,
  Heart,
  Sparkles,
  Download,
  CheckCircle2,
  X,
} from "lucide-react";
import { convite } from "../config/convite";

const API = "/api/presentes";

type Item = {
  id: number;
  item: string;
  status: string;
  nome?: string;
  imagem?: string;
  descricao?: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);
  const [nome, setNome] = useState("");
  const [reservando, setReservando] = useState(false);
  const [escolhido, setEscolhido] = useState("");
  const [nomeConfirmado, setNomeConfirmado] = useState("");
  const [modalSucesso, setModalSucesso] = useState(false);

  async function carregar() {
    try {
      setErro("");
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error("Não foi possível carregar a lista.");
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("A lista retornou um formato inválido.");
      setItems(data);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar a lista agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirReserva(item: Item) {
    setNome("");
    setErro("");
    setItemSelecionado(item);
  }

  async function confirmarReserva() {
    if (!itemSelecionado || reservando) return;
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      setErro("Digite seu nome para confirmar a escolha ❤️");
      return;
    }

    try {
      setReservando(true);
      setErro("");

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemSelecionado.id, nome: nomeLimpo }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || data?.erro || data?.error || data?.sucesso === false || data?.success === false) {
        throw new Error(data?.erro || data?.error || data?.mensagem || "Não foi possível confirmar a escolha.");
      }

      if (data?.success !== true && data?.sucesso !== true) throw new Error("Não foi possível confirmar a reserva.");
      setEscolhido(itemSelecionado.item);
      setNomeConfirmado(nomeLimpo);
      setItemSelecionado(null);
      setNome("");
      setModalSucesso(true);
      await carregar();
    } catch (e) {
      console.error(e);
      setErro(e instanceof Error ? e.message : "Não foi possível confirmar a escolha. Tente novamente.");
    } finally {
      setReservando(false);
    }
  }

  async function baixarConvite() {
    const lembrete = document.getElementById("lembrete-card");
    if (!lembrete) return;

   const { default: html2canvas } = await import("html2canvas");

    const canvas = await html2canvas(lembrete, {
      background: "#fff8f0",
      scale: 2.5,
      useCORS: true,
      logging: false,
    } as Parameters<typeof html2canvas>[1]);

    const link = document.createElement("a");
    link.download = `lembrete-${convite.evento.titulo.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <>
    <div className="petalas" aria-hidden="true">{Array.from({length:18},(_,i)=><span key={i} className="petala" style={{"--x":`${(i*37)%100}%`,"--size":`${13+(i%4)*5}px`,"--dur":`${9+i%8}s`,"--delay":`${-i*1.7}s`} as React.CSSProperties}>{i%3===0?"🌸":"🌷"}</span>)}</div>
    <div className="pagina">
      <header className="hero">
        <div className="heroFlores" aria-hidden="true"><span>🌸</span><span>🌸</span><span>🌸</span><span>🌸</span></div>
        <div className="heroTexto">
          <span className="heroLegenda">UM JARDIM PARA CELEBRAR</span>
          <h1>{convite.evento.titulo}</h1>
          <div className="linha" />
          <h2>{convite.evento.subtitulo}</h2>
          <span className="heroFlorFinal" aria-hidden="true">✿</span>
        </div>
      </header>

      <section className="mensagem">
        {convite.mensagem.map((texto, index) => <p key={index}>{texto}</p>)}
        <p>📅 <strong>{convite.evento.data}</strong><br />🕗 <strong>{convite.evento.horario}</strong></p>
        <p>📍 <strong>{convite.evento.endereco}</strong></p>
        {convite.lista.ativa && <p>🎁 {convite.lista.instrucao}</p>}
      </section>

      {convite.lista.ativa && (
        <>
          <h2 className="titulo"><Sparkles />{convite.lista.titulo}<Sparkles /></h2>

          {loading ? (
            <p className="statusLista">{convite.lista.carregando}</p>
          ) : erro && items.length === 0 ? (
            <div className="erroBox"><p>{erro}</p><button onClick={carregar}>Tentar novamente</button></div>
          ) : (
            <div className="grid">
              {items.map((item) => (
                <div className="card" key={item.id}>
                  {item.imagem ? (
                    <img className="itemImagem" src={item.imagem} alt={item.item} />
                  ) : (
                    <div className="semImagem" aria-hidden="true"><Gift /></div>
                  )}
                  <div className="cardConteudo">
                    <h3>{item.item}</h3>
                    {item.descricao && <p className="descricaoItem">{item.descricao}</p>}
                  </div>

                  {item.status === "Disponível" ? (
                    <button onClick={() => abrirReserva(item)}>{convite.lista.botao}</button>
                  ) : (
                    <div className="escolhido">
                      <CheckCircle2 />
                      <span>{convite.lista.reservado}{convite.lista.mostrarNomeReservado && item.nome ? ` por ${item.nome}` : ""}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {itemSelecionado && (
        <div className="overlay">
          <div className="modal modalReserva">
            <button className="close" onClick={() => { setItemSelecionado(null); setErro(""); }} aria-label="Fechar"><X /></button>
            <Gift className="heart" />
            <h1>Confirmar escolha</h1>
            <p>Você escolheu:</p>
            <div className="presente">{itemSelecionado.item}</div>
            <label className="campoNome">
              <span>Qual é o seu nome?</span>
              <input autoFocus placeholder="Digite seu nome" value={nome} onChange={(e) => setNome(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") confirmarReserva(); }} />
            </label>
            {erro && <p className="erroMensagem">{erro}</p>}
            <button className="botaoConfirmar" disabled={reservando} onClick={confirmarReserva}>{reservando ? "Confirmando..." : "Confirmar escolha"}</button>
          </div>
        </div>
      )}

      {modalSucesso && (
        <div className="overlay">
          <div className="modal modalSucesso">
            <button className="close" onClick={() => setModalSucesso(false)} aria-label="Fechar"><X /></button>

            <div className="lembreteCard" id="lembrete-card">
              <Heart className="heart" />
              <h1>{convite.evento.emoji} {convite.evento.titulo} {convite.evento.emoji}</h1>
              <p>Obrigada, <strong>{nomeConfirmado}</strong>! Você escolheu:</p>
              <div className="presente"><Gift />{escolhido}</div>
              <p>Obrigada por participar desse momento tão especial! 💗</p>
              <strong>Nos vemos na comemoração!</strong>
              <div className="endereco">
                <p><strong>Local:</strong></p>
                <p>📍 {convite.evento.endereco}</p>
                <p>📅 {convite.evento.data}</p>
                <p>🕗 {convite.evento.horario}</p>
                <p>{convite.lista.lembrete}</p>
              </div>
              <div className="marca">Tecnologia<br /><b>bittup.com.br</b></div>
            </div>

            <button className="download" onClick={baixarConvite}><Download />Salvar lembrete</button>
          </div>
        </div>
      )}

      <footer>
        <h2>{convite.rodape.titulo}</h2>
        <p>{convite.rodape.texto}</p>
        <b>📅 {convite.evento.data} • 🕗 {convite.evento.horario}</b>
        <br /><br />
        <a href={convite.rodape.marcaUrl} target="_blank" rel="noreferrer">{convite.rodape.marca}</a>
      </footer>
    </div>
    </>
  );
}
