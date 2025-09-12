# Media Gallery Architecture - OneDrive Integration

## Struttura dati per la galleria multimediale

```javascript
// Struttura dati per la galleria
const mediaGallery = {
  // Configurazione OneDrive
  config: {
    clientId: 'YOUR_ONEDRIVE_APP_ID',
    redirectUri: 'https://favaalessandro.github.io/Landing-Page-Alessandro-Fava/',
    scope: 'files.read files.read.all'
  },

  // Categorie di contenuti
  categories: [
    {
      id: 'presentations',
      name: 'Presentazioni Executive',
      icon: '📊',
      color: 'primary',
      items: []
    },
    {
      id: 'case-studies', 
      name: 'Case Studies',
      icon: '📄',
      color: 'secondary',
      items: []
    },
    {
      id: 'reports',
      name: 'Report & Analisi',
      icon: '📈',
      color: 'accent',
      items: []
    },
    {
      id: 'media',
      name: 'Media & Video',
      icon: '🎬',
      color: 'info',
      items: []
    },
    {
      id: 'templates',
      name: 'Template',
      icon: '📝',
      color: 'neutral',
      items: []
    }
  ],

  // Struttura singolo file
  fileStructure: {
    id: 'onedrive-file-id',
    name: 'Nome Documento',
    type: 'pptx', // pdf, docx, xlsx, mp4
    size: '2.5 MB',
    thumbnail: 'url-thumbnail',
    embedUrl: 'onedrive-embed-url',
    downloadUrl: 'onedrive-download-url',
    lastModified: '2024-01-15',
    description: 'Breve descrizione',
    tags: ['strategy', 'digital-transformation']
  }
};
```

## Integrazione nella homepage

### 1. Posizionamento
- Nuova sezione dopo "Il Mio Percorso"
- Prima di "Come Ti Aiuto"
- Titolo sezione: "Risorse & Approfondimenti"

### 2. Layout UI
```
+----------------------------------------------------------+
|                   Risorse & Approfondimenti              |
+----------------------------------------------------------+
|  [<]  📊 Presentazioni | 📄 Case Studies | 📈 Report [>] |
+----------------------------------------------------------+
|  +--------+  +--------+  +--------+  +--------+          |
|  | File 1 |  | File 2 |  | File 3 |  | File 4 |  scroll→ |
|  | thumb  |  | thumb  |  | thumb  |  | thumb  |          |
|  | name   |  | name   |  | name   |  | name   |          |
|  +--------+  +--------+  +--------+  +--------+          |
+----------------------------------------------------------+
```

### 3. Componenti necessari

#### Dipendenze esterne
- **Swiper.js v11** - Carousel touch-friendly
- **OneDrive SDK** - Autenticazione e API
- **PDF.js** - Fallback per PDF viewer

#### Custom components
```javascript
// Gallery manager
class MediaGalleryManager {
  constructor() {
    this.oneDriveClient = null;
    this.currentCategory = 'all';
    this.files = [];
  }
  
  async authenticate() {
    // OneDrive OAuth flow
  }
  
  async loadFiles(category) {
    // Fetch files from OneDrive folder
  }
  
  openPreview(fileId) {
    // Open modal with embedded viewer
  }
}

// Modal system
class MediaModal {
  constructor() {
    this.currentFile = null;
  }
  
  show(file) {
    // Display modal with OneDrive embed
  }
  
  generateEmbedUrl(file) {
    // Create OneDrive embed URL based on file type
  }
}
```

### 4. Flusso implementazione

1. **Setup iniziale**
   - Registrare app su Azure AD per OneDrive API
   - Ottenere Client ID e configurare redirect URI
   
2. **Integrazione HTML**
   ```html
   <section id="media-gallery" class="section">
     <div class="container">
       <h2 class="section-title">Risorse & Approfondimenti</h2>
       <div class="gallery-carousel">
         <!-- Swiper container -->
       </div>
     </div>
   </section>
   ```

3. **JavaScript integration**
   ```javascript
   // In script.js o nuovo file media-gallery.js
   document.addEventListener('DOMContentLoaded', () => {
     if (document.getElementById('media-gallery')) {
       const gallery = new MediaGalleryManager();
       gallery.init();
     }
   });
   ```

4. **Styling**
   - Estendere style.css con classi gallery
   - Responsive design mobile-first
   - Animazioni hover e transizioni

### 5. Modal Preview System

```javascript
// Struttura modal
const modalTemplate = {
  pdf: {
    viewer: 'pdf.js',
    controls: ['download', 'print', 'zoom']
  },
  office: {
    viewer: 'onedrive-embed',
    controls: ['download', 'open-in-app']
  },
  media: {
    viewer: 'native-html5',
    controls: ['play', 'fullscreen', 'download']
  }
};
```

### 6. OneDrive API Integration

```javascript
// File operations
const oneDriveOps = {
  // Get folder contents
  async getFolderItems(folderId) {
    return await client
      .api(`/me/drive/items/${folderId}/children`)
      .get();
  },
  
  // Get embed link
  async getEmbedLink(fileId) {
    return await client
      .api(`/me/drive/items/${fileId}/createLink`)
      .post({ type: 'embed' });
  },
  
  // Get thumbnail
  async getThumbnail(fileId) {
    return await client
      .api(`/me/drive/items/${fileId}/thumbnails`)
      .get();
  }
};
```

### 7. Security & Performance

- **Security**
  - Token refresh automatico
  - Scope limitati (solo lettura)
  - No storage di credenziali
  
- **Performance**
  - Lazy loading dei thumbnail
  - Cache delle anteprime
  - Preload on hover
  - CDN per librerie esterne

### 8. Fallback Strategy

Se OneDrive non disponibile:
1. Link diretti a file statici
2. Preview con iframe generico
3. Download diretto

### 9. Future Enhancements

- Search/filter functionality
- Favorites system
- View analytics
- Share functionality
- Multi-language support

## Note implementative

- OneDrive Personal ha limiti API (controllare quota)
- Embed non disponibile per tutti i formati
- Considerare hosting alternativo per file pesanti
- Test cross-browser per embed compatibility