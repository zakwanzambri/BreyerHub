/* This file will help generate icons dynamically */
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

const createIcon = (size) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  
  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Add university icon
  const scale = size / 192; // Base size is 192px
  
  // Main building
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(20 * scale, 60 * scale, 56 * scale, 36 * scale);
  
  // Columns
  ctx.fillStyle = 'white';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect((24 + i * 11) * scale, 45 * scale, 6 * scale, 51 * scale);
  }
  
  // Roof triangle
  ctx.beginPath();
  ctx.moveTo(48 * scale, 30 * scale);
  ctx.lineTo(15 * scale, 50 * scale);
  ctx.lineTo(81 * scale, 50 * scale);
  ctx.closePath();
  ctx.fill();
  
  // Flag pole
  ctx.fillRect(46 * scale, 15 * scale, 4 * scale, 20 * scale);
  
  // Flag
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(50 * scale, 15 * scale, 15 * scale, 8 * scale);
  
  // Door
  ctx.fillStyle = '#667eea';
  ctx.fillRect(44 * scale, 75 * scale, 8 * scale, 21 * scale);
  
  // Windows
  ctx.fillRect(28 * scale, 68 * scale, 8 * scale, 8 * scale);
  ctx.fillRect(60 * scale, 68 * scale, 8 * scale, 8 * scale);
  
  // Text
  if (size >= 128) {
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(16 * scale)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('BreyerHub', size / 2, 160 * scale);
  }
  
  return canvas.toDataURL('image/png');
};

// Usage: This would be called to generate icons
// For now, we'll use the SVG as a fallback
console.log('Icon generator ready');
