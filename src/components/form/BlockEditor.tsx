import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Tooltip,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Collapse
} from '@mui/material';

import { Block } from 'types/blog';
import {
  AddItemIcon,
  CollapseIcon,
  DeleteIcon,
  DividerIcon,
  DragIcon,
  ExpandIcon,
  HeadingIcon,
  ImageIcon,
  ListIcon,
  ParagraphIcon,
  QuoteIcon,
  RemoveItemIcon
} from './BlockEditorIcons';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BlockEditorProps {
  name: string;
}

type BlockType = Block['type'];

interface BlockTypeOption {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOCK_TYPES: BlockTypeOption[] = [
  { type: 'heading', label: 'Heading', icon: <HeadingIcon fontSize="small" />, description: 'H1–H4 section title' },
  { type: 'paragraph', label: 'Paragraph', icon: <ParagraphIcon fontSize="small" />, description: 'Body text block' },
  { type: 'quote', label: 'Quote', icon: <QuoteIcon fontSize="small" />, description: 'Blockquote with optional author' },
  { type: 'image', label: 'Image', icon: <ImageIcon fontSize="small" />, description: 'Image URL with caption' },
  { type: 'list', label: 'List', icon: <ListIcon fontSize="small" />, description: 'Ordered or unordered list' },
  { type: 'divider', label: 'Divider', icon: <DividerIcon fontSize="small" />, description: 'Horizontal rule separator' }
];

const createDefaultBlock = (type: BlockType): Block => {
  switch (type) {
    case 'heading':
      return { type: 'heading', level: 2, text: '' };
    case 'paragraph':
      return { type: 'paragraph', text: '' };
    case 'quote':
      return { type: 'quote', text: '', author: '' };
    case 'image':
      return { type: 'image', src: '', caption: '' };
    case 'list':
      return { type: 'list', items: [''], ordered: false };
    case 'divider':
      return { type: 'divider' };
  }
};

// ─── Block Preview Label ──────────────────────────────────────────────────────

const blockSummary = (block: Block): string => {
  switch (block.type) {
    case 'heading':
      return block.text || 'Untitled Heading';
    case 'paragraph':
      return block.text ? block.text.substring(0, 60) + (block.text.length > 60 ? '…' : '') : 'Empty paragraph';
    case 'quote':
      return block.text || 'Empty quote';
    case 'image':
      return block.src || 'No image URL';
    case 'list':
      return `${block.items.length} item${block.items.length !== 1 ? 's' : ''}`;
    case 'divider':
      return '— Divider —';
  }
};

// ─── Individual Block Editors ─────────────────────────────────────────────────

interface BlockEditorItemProps {
  block: Block;
  index: number;
  onChange: (index: number, block: Block) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

function BlockItem({ block, index, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: BlockEditorItemProps) {
  const [expanded, setExpanded] = useState(true);

  const blockOption = BLOCK_TYPES.find((b) => b.type === block.type)!;

  const update = (patch: Partial<Block>) => onChange(index, { ...block, ...patch } as Block);

  const renderEditor = () => {
    switch (block.type) {
      case 'heading':
        return (
          <Stack spacing={2}>
            <FormControl size="small" sx={{ width: 140 }}>
              <InputLabel>Level</InputLabel>
              <Select value={block.level} label="Level" onChange={(e) => update({ level: e.target.value as 1 | 2 | 3 | 4 })}>
                {[1, 2, 3, 4].map((l) => (
                  <MenuItem key={l} value={l}>
                    H{l}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Heading Text"
              value={block.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="Enter heading text..."
              size="small"
            />
          </Stack>
        );

      case 'paragraph':
        return (
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Paragraph Text"
            value={block.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Write your paragraph here..."
            size="small"
          />
        );

      case 'quote':
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Quote Text"
              value={block.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="Enter the quote..."
              size="small"
            />
            <TextField
              fullWidth
              label="Author (optional)"
              value={block.author || ''}
              onChange={(e) => update({ author: e.target.value })}
              placeholder="Quote attribution..."
              size="small"
            />
          </Stack>
        );

      case 'image':
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Image URL"
              value={block.src}
              onChange={(e) => update({ src: e.target.value })}
              placeholder="https://example.com/image.jpg"
              size="small"
            />
            {block.src && (
              <Box
                component="img"
                src={block.src}
                alt="preview"
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
                sx={{ maxHeight: 160, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              />
            )}
            <TextField
              fullWidth
              label="Caption (optional)"
              value={block.caption || ''}
              onChange={(e) => update({ caption: e.target.value })}
              placeholder="Image caption..."
              size="small"
            />
          </Stack>
        );

      case 'list':
        return (
          <Stack spacing={2}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={block.ordered ? 'ordered' : 'unordered'}
              onChange={(_, val) => {
                if (val) update({ ordered: val === 'ordered' });
              }}
            >
              <ToggleButton value="unordered">Unordered</ToggleButton>
              <ToggleButton value="ordered">Ordered</ToggleButton>
            </ToggleButtonGroup>
            <Stack spacing={1}>
              {block.items.map((item, i) => (
                <Stack key={i} direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                    {block.ordered ? `${i + 1}.` : '•'}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={item}
                    onChange={(e) => {
                      const items = [...block.items];
                      items[i] = e.target.value;
                      update({ items });
                    }}
                    placeholder={`Item ${i + 1}`}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      const items = block.items.filter((_, idx) => idx !== i);
                      update({ items: items.length ? items : [''] });
                    }}
                    disabled={block.items.length === 1}
                  >
                    <RemoveItemIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                size="small"
                startIcon={<AddItemIcon />}
                onClick={() => update({ items: [...block.items, ''] })}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Item
              </Button>
            </Stack>
          </Stack>
        );

      case 'divider':
        return (
          <Box sx={{ py: 1 }}>
            <Divider />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
              Horizontal Divider
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 2 }
      }}
    >
      {/* Block Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: 'grey.50',
          borderBottom: expanded ? '1px solid' : 'none',
          borderColor: 'divider',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Drag handle (visual only) */}
        <DragIcon sx={{ color: 'text.disabled', fontSize: 18, flexShrink: 0 }} />

        {/* Block type icon + label */}
        <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{blockOption.icon}</Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {blockOption.label}
        </Typography>

        {/* Preview text */}
        <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1, fontStyle: 'italic' }}>
          {!expanded && blockSummary(block)}
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={0.5} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Move Up">
            <span>
              <IconButton size="small" onClick={() => onMoveUp(index)} disabled={isFirst}>
                <Typography variant="caption" lineHeight={1}>
                  ↑
                </Typography>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Move Down">
            <span>
              <IconButton size="small" onClick={() => onMoveDown(index)} disabled={isLast}>
                <Typography variant="caption" lineHeight={1}>
                  ↓
                </Typography>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete Block">
            <IconButton size="small" color="error" onClick={() => onDelete(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <CollapseIcon fontSize="small" /> : <ExpandIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </Stack>

      {/* Block Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>{renderEditor()}</Box>
      </Collapse>
    </Paper>
  );
}

// ─── Add Block Menu ───────────────────────────────────────────────────────────

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
}

function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'primary.main' }
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        Add Block
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {BLOCK_TYPES.map(({ type, label, icon, description }) => (
          <Tooltip key={type} title={description} placement="top">
            <Button
              size="small"
              variant="outlined"
              startIcon={icon}
              onClick={() => onAdd(type)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5
              }}
            >
              {label}
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}

// ─── Main BlockEditor ─────────────────────────────────────────────────────────

export function BlockEditor({ name }: BlockEditorProps) {
  const {
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();
  const blocks: Block[] = watch(name) || [];

  const setBlocks = (updated: Block[]) => setValue(name, updated, { shouldValidate: true, shouldDirty: true });

  const handleAdd = (type: BlockType) => {
    setBlocks([...blocks, createDefaultBlock(type)]);
  };

  const handleChange = (index: number, block: Block) => {
    const updated = [...blocks];
    updated[index] = block;
    setBlocks(updated);
  };

  const handleDelete = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blocks];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setBlocks(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setBlocks(updated);
  };

  const error = errors[name];

  return (
    <Box>
      {/* Section Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            Content Blocks
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {blocks.length} block{blocks.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        {blocks.length > 0 && (
          <Button size="small" color="error" variant="text" onClick={() => setBlocks([])} sx={{ fontSize: '0.75rem' }}>
            Clear All
          </Button>
        )}
      </Stack>

      {/* Error */}
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
          {String(error.message)}
        </Typography>
      )}

      {/* Block List */}
      <Stack spacing={1.5} mb={2}>
        {blocks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.disabled' }}>
            <ParagraphIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
            <Typography variant="body2">No content blocks yet. Add one below.</Typography>
          </Box>
        ) : (
          blocks.map((block, index) => (
            <BlockItem
              key={index}
              block={block}
              index={index}
              onChange={handleChange}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
            />
          ))
        )}
      </Stack>

      {/* Add Block Menu */}
      <AddBlockMenu onAdd={handleAdd} />
    </Box>
  );
}
