import { CRAP, ALL_KNOWN_PARSER_MAP, KnownAssetType } from '@kotorik/crp-parser';

const uploadArea = document.getElementById('uploadArea') as HTMLDivElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const output = document.getElementById('output') as HTMLDivElement;

// Handle click on upload area
uploadArea.addEventListener('click', () => {
  fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    handleFile(target.files[0]);
  }
});

// Handle drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    handleFile(e.dataTransfer.files[0]);
  }
});

async function handleFile(file: File) {
  if (!file.name.endsWith('.crp')) {
    showError('Please select a valid .crp file');
    return;
  }

  output.innerHTML = '<div class="loading"><div class="spinner"></div><p>Parsing file...</p></div>';

  try {
    const arrayBuffer = await file.arrayBuffer();
    const crap = new CRAP(arrayBuffer, ALL_KNOWN_PARSER_MAP, true);

    displayResults(crap, file);
  } catch (error) {
    showError(`Error parsing file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function showError(message: string) {
  output.innerHTML = `<div class="error">${message}</div>`;
}

function displayResults(crap: CRAP<typeof ALL_KNOWN_PARSER_MAP>, file: File) {
  const html = `
    <div class="success">✓ File parsed successfully!</div>
    
    <div class="results">
      <div class="section">
        <h3>📦 Package Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Package Name</div>
            <div class="info-value">${escapeHtml(crap.packageName)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Author</div>
            <div class="info-value">${escapeHtml(crap.authorName)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Version</div>
            <div class="info-value">${crap.packageVersion}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Main Asset</div>
            <div class="info-value">${escapeHtml(crap.mainAssetName)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">File Format</div>
            <div class="info-value">${crap.fileFormat}</div>
          </div>
          <div class="info-item">
            <div class="info-label">File Count</div>
            <div class="info-value">${crap.fileCount}</div>
          </div>
          <div class="info-item">
            <div class="info-label">File Size</div>
            <div class="info-value">${formatBytes(file.size)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data Offset</div>
            <div class="info-value">${crap.dataOffset} bytes</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>📋 Assets (${crap.assetEntries.length})</h3>
        <div class="asset-list">
          ${crap.assetEntries.map((entry, index) => {
            const parsable = crap.isParsable(index);
            let parsedData = null;
            
            if (parsable) {
              try {
                parsedData = crap.parse(entry);
              } catch (e) {
                // Parsing failed
              }
            }

            return `
              <div class="asset-item ${parsable ? 'parsable' : 'not-parsable'}">
                <div class="asset-header">
                  <div class="asset-name">${escapeHtml(entry.name)}</div>
                  <div class="asset-type">${escapeHtml(entry.type)}</div>
                </div>
                <div class="asset-details">
                  <strong>Checksum:</strong> ${escapeHtml(entry.checksum)}<br>
                  <strong>Offset:</strong> ${entry.offset} bytes | 
                  <strong>Length:</strong> ${formatBytes(entry.length)}<br>
                  <strong>Status:</strong> 
                  <span class="badge ${parsable ? 'parsable' : 'not-parsable'}">
                    ${parsable ? '✓ Parsable' : '⚠ Not Parsable'}
                  </span>
                </div>
                ${parsedData && !(parsedData instanceof Error) ? `
                  <details>
                    <summary style="cursor: pointer; margin-top: 10px; font-weight: 600;">
                      Show Parsed Data
                    </summary>
                    <div class="parsed-data">
                      <pre>${escapeHtml(JSON.stringify(parsedData, null, 2))}</pre>
                    </div>
                  </details>
                ` : parsedData instanceof Error ? `
                  <div class="parsed-data" style="color: #c33;">
                    <strong>Parsing Error:</strong> ${escapeHtml(parsedData.message)}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  output.innerHTML = html;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
