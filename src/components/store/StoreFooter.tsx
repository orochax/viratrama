import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container footer-layout">
        <div>
          <Link href="/" className="brand-mark">
            <span className="brand-symbol" aria-hidden="true">VT</span>
            <span>ViraTrama</span>
          </Link>
          <p>Histórias que começam na caixa e terminam nas suas escolhas.</p>
        </div>
        <div className="footer-links">
          <Link href="/#casos">Missões</Link>
          <Link href="/#como-funciona">Como funciona</Link>
          <Link href="/#duvidas">Dúvidas</Link>
          <Link href="/biblioteca">Biblioteca</Link>
          <Link href="/conta">Minha conta</Link>
          <Link href="/ativar">Ativar caso</Link>
        </div>
        <div className="footer-note">
          <span>ViraTrama / experiências narrativas</span>
          <span>Obra de ficção para entretenimento.</span>
        </div>
      </div>
    </footer>
  );
}
