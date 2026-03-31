// src/components/Modals/AvatarEditDialog.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, Slider, IconButton,
} from '@mui/material';
import { ZoomIn, ZoomOut, RotateCw, X, Check, Upload } from 'lucide-react';

const CANVAS_SIZE = 280;

const AvatarEditDialog = ({ open, onClose, onSave, currentAvatar }) => {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  // Load image from file
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setZoom(1);
        setRotation(0);
        setOffset({ x: 0, y: 0 });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Draw the canvas preview
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = CANVAS_SIZE;
    canvas.width = size;
    canvas.height = size;

    // Clear with background
    ctx.fillStyle = '#f1f3f6';
    ctx.fillRect(0, 0, size, size);

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    if (image) {
      ctx.translate(size / 2 + offset.x, size / 2 + offset.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Fit image to canvas
      const scale = Math.max(size / image.width, size / image.height);
      const w = image.width * scale;
      const h = image.height * scale;
      ctx.drawImage(image, -w / 2, -h / 2, w, h);
    } else {
      // Placeholder
      ctx.fillStyle = '#e4e7ed';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#98a2b3';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Select an image', size / 2, size / 2);
    }
    ctx.restore();

    // Draw circle border
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#e4e7ed';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [image, zoom, rotation, offset]);

  useEffect(() => { draw(); }, [draw]);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (!image) return;
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (!image) return;
    const touch = e.touches[0];
    setDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };
  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    setOffset({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
  };

  const handleSave = async () => {
    if (!image) return;
    setSaving(true);
    try {
      // Export canvas to blob
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png', 0.9);
      await onSave(dataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to save avatar:', err);
    } finally {
      setSaving(false);
    }
  };

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setImage(null);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });

      // If there's a current avatar, load it
      if (currentAvatar) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setImage(img);
        img.src = currentAvatar;
      }
    }
  }, [open, currentAvatar]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pb: 1, fontFamily: '"Plus Jakarta Sans", sans-serif',
      }}>
        <Typography variant="h6" fontWeight={700} color="#101828"
          fontFamily='"Plus Jakarta Sans", sans-serif'>
          Edit Profile Picture
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: '#98a2b3' }}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 1 }}>
        {/* Canvas preview */}
        <Box
          sx={{
            position: 'relative',
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: image ? 'grab' : 'default',
            mb: 3,
            boxShadow: '0 8px 32px rgba(16,24,40,0.12)',
            '&:active': { cursor: image ? 'grabbing' : 'default' },
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, display: 'block' }}
          />
        </Box>

        {/* Upload button */}
        <Button
          variant="outlined"
          startIcon={<Upload size={14} />}
          onClick={() => fileRef.current?.click()}
          size="small"
          sx={{
            borderRadius: '10px', borderColor: '#e4e7ed', color: '#667085',
            fontWeight: 600, textTransform: 'none', mb: 2.5,
            '&:hover': { borderColor: '#f43f6e', color: '#f43f6e', bgcolor: '#fff1f3' },
          }}
        >
          Choose Image
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />

        {/* Controls */}
        {image && (
          <Box sx={{ width: '100%', px: 1 }}>
            {/* Zoom */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <ZoomOut size={16} color="#98a2b3" />
              <Slider
                value={zoom}
                onChange={(_, v) => setZoom(v)}
                min={0.5}
                max={3}
                step={0.05}
                sx={{
                  color: '#f43f6e',
                  '& .MuiSlider-thumb': {
                    width: 16, height: 16,
                    boxShadow: '0 2px 6px rgba(244,63,110,0.3)',
                  },
                }}
              />
              <ZoomIn size={16} color="#98a2b3" />
            </Box>

            {/* Rotate */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="text"
                startIcon={<RotateCw size={14} />}
                onClick={() => setRotation((r) => (r + 90) % 360)}
                size="small"
                sx={{
                  color: '#667085', fontWeight: 600, textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#f8f9fb' },
                }}
              >
                Rotate 90°
              </Button>
            </Box>
          </Box>
        )}

        <Typography variant="caption" color="#98a2b3" sx={{ mt: 1.5, textAlign: 'center' }}>
          {image ? 'Drag to reposition • Use slider to zoom' : 'Upload or select a photo to get started'}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: '10px', color: '#667085', fontWeight: 600,
            textTransform: 'none', px: 2.5,
            '&:hover': { bgcolor: '#f8f9fb' },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!image || saving}
          startIcon={<Check size={14} />}
          sx={{
            background: 'linear-gradient(135deg, #f43f6e, #fb7292)',
            borderRadius: '10px', px: 2.5, fontWeight: 600, textTransform: 'none',
            boxShadow: '0 4px 16px rgba(244,63,110,0.25)',
            '&:hover': { boxShadow: '0 8px 24px rgba(244,63,110,0.35)' },
            '&:disabled': { opacity: 0.5 },
          }}
        >
          {saving ? 'Saving…' : 'Save Photo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarEditDialog;
