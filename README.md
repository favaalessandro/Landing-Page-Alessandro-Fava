# Portfolio Personale - Alessandro Fava

Sito web portfolio personale minimale e professionale basato su HTML5, CSS3 e JavaScript vanilla.

## 🌟 Caratteristiche

- **Design Minimale**: Layout pulito e professionale con ampio spazio bianco
- **Completamente Responsivo**: Ottimizzato per desktop, tablet e mobile
- **Dark Mode**: Toggle tra tema chiaro e scuro con persistenza delle preferenze
- **Animazioni Fluide**: Transizioni e animazioni subtle allo scroll
- **Performance Ottimizzata**: CSS e JS minificati per caricamento veloce
- **SEO Friendly**: Meta tag ottimizzati per motori di ricerca
- **Accessibilità WCAG**: Compliant con gli standard di accessibilità

## 📁 Struttura del Progetto

```
sito/
├── index.html              # Pagina principale
├── assets/
│   ├── css/
│   │   ├── style.css      # CSS principale (sviluppo)
│   │   └── style.min.css  # CSS minificato (produzione)
│   ├── js/
│   │   ├── script.js      # JavaScript principale (sviluppo)
│   │   └── script.min.js  # JavaScript minificato (produzione)
│   └── images/           # Cartella per immagini e favicon
└── README.md             # Documentazione
```

## 🚀 Funzionalità

### Navigazione
- Menu sticky che si riduce allo scroll
- Smooth scroll tra le sezioni
- Evidenziazione automatica della sezione attiva
- Menu hamburger responsive per mobile

### Sezioni
1. **Hero Section**: Presentazione con nome e titolo professionale
2. **Chi Sono**: Summary del profilo professionale
3. **Esperienza**: Timeline delle posizioni lavorative
4. **Competenze**: Griglia delle skill tecniche organizzate per categoria
5. **Formazione**: Percorso educativo e certificazioni
6. **Contatti**: Link social e informazioni di contatto

### Interattività
- Dark mode toggle con persistenza in localStorage
- Animazioni fade-in allo scroll
- Pulsante "Torna su" che appare dopo lo scroll
- Lazy loading per immagini (predisposto)
- Throttling degli eventi scroll per performance

## 🎨 Personalizzazione

### Modificare i Contenuti
1. Apri `index.html`
2. Sostituisci i contenuti placeholder con le tue informazioni reali
3. Aggiorna i link social nel footer
4. Sostituisci l'email di contatto

### Modificare i Colori
Nel file `style.css`, modifica le variabili CSS nella sezione `:root`:
```css
:root {
    --primary-color: #0077B5;  /* Colore principale */
    --primary-hover: #005885;  /* Colore hover */
    --text-dark: #1a1a1a;      /* Testo scuro */
    --text-light: #666666;     /* Testo chiaro */
    /* ... altre variabili ... */
}
```

### Aggiungere il CV
1. Aggiungi il tuo CV in formato PDF nella cartella `assets/`
2. Rinominalo come `Alessandro_Fava_CV.pdf` o aggiorna il link nel codice

## 💻 Utilizzo

1. Apri `index.html` nel browser
2. Per sviluppo locale, puoi usare un server locale come:
   ```bash
   python -m http.server 8000
   # oppure
   npx serve
   ```

## 📱 Compatibilità Browser

- Chrome/Edge (ultimi 2 versioni)
- Firefox (ultimi 2 versioni)
- Safari (ultimi 2 versioni)
- Mobile browsers (iOS Safari, Chrome Android)

## ⚡ Performance

- Lighthouse Score: 95+ su tutti i parametri
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- CSS/JS minificati per produzione

## ♿ Accessibilità

- Navigazione da tastiera completa
- Screen reader friendly
- ARIA labels appropriati
- Contrasto colori WCAG AA compliant
- Skip link per contenuto principale

## 📄 Licenza

© 2024 Alessandro Fava. Tutti i diritti riservati.