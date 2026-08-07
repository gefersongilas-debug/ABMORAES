"use client";

import { FormEvent, useEffect, useState } from "react";

const WhatsApp = "https://wa.me/5511995407662?text=Olá!%20Quero%20falar%20com%20um%20especialista%20da%20AB%20Moraes.";
const FORM_WEBHOOK = "https://hook.us1.make.celonis.com/z9uzgc97xf5r92kfxmjh8as8o69gebl4";
const TRACKING_FIELDS = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "gclid"] as const;

type TrackingField = (typeof TRACKING_FIELDS)[number];
type TrackingData = Record<TrackingField, string>;
type DataLayerEvent = { event: string };

const emptyTrackingData: TrackingData = {
  utm_source: "",
  utm_campaign: "",
  utm_medium: "",
  utm_content: "",
  utm_term: "",
  gclid: "",
};

function Arrow() { return <span aria-hidden="true">→</span>; }

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData>(emptyTrackingData);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const capturedTrackingData = { ...emptyTrackingData };

    TRACKING_FIELDS.forEach((field) => {
      capturedTrackingData[field] = urlParams.get(field) ?? "";
    });

    setTrackingData(capturedTrackingData);

    document.documentElement.classList.add("reveal-ready");
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  function trackFloatingWhatsAppClick() {
    const windowWithDataLayer = window as typeof window & { dataLayer?: DataLayerEvent[] };
    windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || [];
    windowWithDataLayer.dataLayer.push({ event: "wpp.flutuante" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const data = new FormData(event.currentTarget);
    const name = String(data.get("nome") ?? "");
    const phone = String(data.get("whatsapp") ?? "");
    const interest = String(data.get("interesse") ?? "");
    const tracking = Object.fromEntries(
      TRACKING_FIELDS.map((field) => [field, String(data.get(field) ?? "")]),
    ) as TrackingData;
    const message = `Olá! Meu nome é ${name}. Meu WhatsApp é ${phone} e procuro: ${interest}. Vim pela landing page da AB Moraes.`;

    setIsSubmitting(true);
    try {
      await fetch(FORM_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          whatsapp: phone,
          interesse: interest,
          origem: "Landing page AB Moraes",
          pagina: window.location.href,
          enviadoEm: new Date().toISOString(),
          ...tracking,
        }),
        keepalive: true,
      });
    } catch {
      // O atendimento via WhatsApp continua disponível mesmo se o webhook falhar.
    }

    window.location.href = `https://wa.me/5511995407662?text=${encodeURIComponent(message)}`;
  }

  return (
    <main>
      <div className="topbar">Atendimento especializado para todo o Brasil <a href={WhatsApp} target="_blank">Fale conosco</a></div>
      <header className="header container">
        <img src="/assets/logo.webp" alt="AB Moraes" className="logo" />
        <a href={WhatsApp} target="_blank" className="header-contact">WhatsApp <strong>(11) 99540-7662</strong></a>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AB MORAES · SOLUÇÕES PROFISSIONAIS</p>
            <h1>Equipamentos e peças para quem precisa <em>trabalhar sem parar</em></h1>
            <p className="hero-lead">A solução certa para o seu equipamento de hidrojateamento, com suporte técnico de quem entende do assunto.</p>
            <a href="#contato" className="button button-primary">Falar com um especialista <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="benefits container" data-reveal>
        <article><span className="benefit-icon">⚙</span><div><h2>Equipamentos profissionais</h2><p>Força e autonomia para operar.</p></div></article>
        <article><span className="benefit-icon">✦</span><div><h2>Peça certa, sem erro</h2><p>Orientação antes da compra.</p></div></article>
        <article><span className="benefit-icon">⌁</span><div><h2>Atendimento rápido</h2><p>Suporte técnico especializado.</p></div></article>
      </section>

      <section className="solutions section container" data-reveal>
        <p className="eyebrow">SOLUÇÕES PARA O SEU DIA A DIA</p>
        <h2 className="section-title">O que você precisa para manter sua operação em movimento</h2>
        <div className="solution-grid">
          <article className="solution-card dark-card">
            <div><span className="card-number">01</span><h3>Mini hidrojatos completos</h3><p>Equipamentos prontos para desentupimento, limpeza técnica e hidrojateamento profissional.</p><ul><li>Mini Hidro Jato 16,5 HP</li><li>Mini Hidro Jato 25 HP</li><li>Mini Hidro Jato 35 HP</li></ul><a href="#contato">Quero um mini hidrojato <Arrow /></a></div>
            <div className="product-stage" aria-label="Componentes profissionais AB Moraes">
              <img className="stage-mini-hidrojato" src="/assets/foto-v2.png" alt="Mini Hidro Jato profissional AB Moraes" />
            </div>
          </article>
          <article className="solution-card light-card">
            <div><span className="card-number">02</span><h3>Peças de reposição para hidrojato</h3><p>Sua máquina parou? Conte com nosso suporte para identificar e comprar a peça certa.</p><a href="#contato">Encontrar minha peça <Arrow /></a></div>
            <div className="parts" aria-label="Peças de reposição para hidrojato">
              <img src="/assets/produto-bico-desobstrucao-recortado.png" alt="Bico de hidrojato para desobstrução AB Moraes"/>
              <img src="/assets/produto-bico-latao-recortado.png" alt="Bico de hidrojato em latão AB Moraes"/>
              <img src="/assets/produto-mangueira.png" alt="Mangueira de reposição AB Moraes"/>
              <img src="/assets/produto-manometro-recortado.png" alt="Manômetro para hidrojato AB Moraes"/>
              <img src="/assets/produto-registro-3-vias-recortado.png" alt="Registro 3 vias para hidrojato AB Moraes"/>
              <img src="/assets/produto-esguicho-regulavel.png" alt="Esguicho regulável para lavagem AB Moraes"/>
            </div>
          </article>
        </div>
      </section>

      <section className="why section" data-reveal>
        <div className="container why-grid">
          <div><p className="eyebrow">POR QUE A AB MORAES?</p><h2 className="section-title">Você não compra só um produto. Compra confiança para seguir trabalhando.</h2><a className="button button-outline" href={WhatsApp} target="_blank">Falar no WhatsApp <Arrow /></a></div>
          <div className="reasons"><div><b>01</b><p>Equipamentos selecionados para uso profissional.</p></div><div><b>02</b><p>Suporte de quem conhece hidrojateamento.</p></div><div><b>03</b><p>Atendimento ágil e comprometido.</p></div><div><b>04</b><p>Envio para todo o Brasil.</p></div></div>
        </div>
      </section>

      <section className="contact section" id="contato" data-reveal>
        <div className="container contact-grid">
          <div><p className="eyebrow">VAMOS ENCONTRAR A MELHOR SOLUÇÃO</p><h2 className="section-title">Fale com um especialista</h2><p>Conte o que você precisa. Nossa equipe entra em contato para ajudar na escolha do equipamento ou peça ideal.</p><a className="whatsapp-link" href={WhatsApp} target="_blank">Também atendemos pelo WhatsApp <Arrow /></a></div>
          <form onSubmit={submit} className="form">
            <label>Nome<input required name="nome" placeholder="Como podemos te chamar?" /></label>
            <label>WhatsApp<input required name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} placeholder="DDD + número" onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 11); }} /></label>
            <label>O que você procura?<select name="interesse" defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Mini hidrojato completo</option><option>Peça de reposição</option><option>Quero tirar uma dúvida</option></select></label>
            {TRACKING_FIELDS.map((field) => (
              <input key={field} type="hidden" name={field} value={trackingData[field]} readOnly />
            ))}
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : <>Quero falar com um especialista <Arrow /></>}
            </button>
          </form>
        </div>
      </section>
      <footer><div className="container"><img src="/assets/logo.webp" alt="AB Moraes" className="footer-logo"/><span>© {new Date().getFullYear()} AB Moraes Indústria de Equipamentos LTDA</span><a href="https://abmoraes.com.br/" target="_blank">abmoraes.com.br</a></div></footer>
      <a className="floating-whatsapp" href={WhatsApp} target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp" data-track="wpp-flutuante" onClick={trackFloatingWhatsAppClick}>
        <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2a12.5 12.5 0 0 0-10.7 19l-1.7 6.6 6.8-1.8A12.5 12.5 0 1 0 16 3.2Zm0 22.7c-1.9 0-3.7-.5-5.2-1.4l-.5-.3-4 1 1-3.9-.3-.5A10.2 10.2 0 1 1 16 25.9Zm5.6-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1a8.3 8.3 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5 0-.2-.3-.3-.6-.5Z" fill="currentColor"/></svg>
      </a>
    </main>
  );
}
