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
  Collapse,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  AddItemIcon,
  CollapseIcon,
  DeleteIcon,
  DividerIcon,
  DragIcon,
  ExpandIcon,
  ExternalIcon,
  HeadingIcon,
  ImageIcon,
  LinkIcon,
  ListIcon,
  ParagraphIcon,
  QuoteIcon,
  RemoveItemIcon
} from './BlockEditorIcons';

// ─── Types ────────────────────────────────────────────────────────────────────

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string; external?: boolean; newTab?: boolean };

export type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; children: InlineNode[] }
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'link'; href: string; label: string; external?: boolean; newTab?: boolean }
  | { type: 'divider' };

type BlockType = Block['type'];

interface BlockEditorProps {
  name: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inlinesToText = (children: InlineNode[]): string => children.map((n) => n.value).join('');

const createDefaultBlock = (type: BlockType): Block => {
  switch (type) {
    case 'heading':
      return { type: 'heading', level: 2, children: [{ type: 'text', value: '' }] };
    case 'paragraph':
      return { type: 'paragraph', children: [{ type: 'text', value: '' }] };
    case 'quote':
      return { type: 'quote', text: '', author: '' };
    case 'image':
      return { type: 'image', src: '', caption: '' };
    case 'list':
      return { type: 'list', items: [''], ordered: false };
    case 'link':
      return { type: 'link', href: '', label: '', external: false, newTab: false };
    case 'divider':
      return { type: 'divider' };
  }
};

const blockSummary = (block: Block): string => {
  switch (block.type) {
    case 'heading':
      return inlinesToText(block.children) || 'Untitled Heading';
    case 'paragraph': {
      const text = inlinesToText(block.children);
      return text ? text.substring(0, 60) + (text.length > 60 ? '…' : '') : 'Empty paragraph';
    }
    case 'quote':
      return block.text || 'Empty quote';
    case 'image':
      return block.src || 'No image URL';
    case 'list':
      return `${block.items.length} item${block.items.length !== 1 ? 's' : ''}`;
    case 'link':
      return block.label || block.href || 'Untitled link';
    case 'divider':
      return '— Divider —';
  }
};

interface BlockTypeOption {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const BLOCK_TYPES: BlockTypeOption[] = [
  { type: 'heading', label: 'Heading', icon: <HeadingIcon fontSize="small" />, description: 'H1–H4 section title' },
  { type: 'paragraph', label: 'Paragraph', icon: <ParagraphIcon fontSize="small" />, description: 'Rich text with inline links' },
  { type: 'quote', label: 'Quote', icon: <QuoteIcon fontSize="small" />, description: 'Blockquote with optional author' },
  { type: 'image', label: 'Image', icon: <ImageIcon fontSize="small" />, description: 'Image URL with caption' },
  { type: 'list', label: 'List', icon: <ListIcon fontSize="small" />, description: 'Ordered or unordered list' },
  { type: 'link', label: 'Link', icon: <LinkIcon fontSize="small" />, description: 'Standalone call-to-action link' },
  { type: 'divider', label: 'Divider', icon: <DividerIcon fontSize="small" />, description: 'Horizontal rule separator' }
];

// ─── Inline Link Dialog ───────────────────────────────────────────────────────

interface InlineLinkDialogProps {
  open: boolean;
  initial?: { value: string; href: string; external: boolean; newTab: boolean };
  onConfirm: (link: { value: string; href: string; external: boolean; newTab: boolean }) => void;
  onClose: () => void;
}

function InlineLinkDialog({ open, initial, onConfirm, onClose }: InlineLinkDialogProps) {
  const [value, setValue] = useState(initial?.value || '');
  const [href, setHref] = useState(initial?.href || '');
  const [external, setExternal] = useState(initial?.external ?? false);
  const [newTab, setNewTab] = useState(initial?.newTab ?? false);

  React.useEffect(() => {
    if (open) {
      setValue(initial?.value || '');
      setHref(initial?.href || '');
      setExternal(initial?.external ?? false);
      setNewTab(initial?.newTab ?? false);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LinkIcon fontSize="small" />
        {initial ? 'Edit Inline Link' : 'Insert Inline Link'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Link Text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Read more"
            fullWidth
            size="small"
            autoFocus
          />

          <ToggleButtonGroup
            exclusive
            size="small"
            value={external ? 'external' : 'internal'}
            onChange={(_, val) => {
              if (val) setExternal(val === 'external');
            }}
          >
            <ToggleButton value="internal">Internal link</ToggleButton>
            <ToggleButton value="external">External link</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label={!external ? 'Path (e.g. /articles/my-post)' : 'URL (e.g. https://example.com)'}
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder={!external ? '/articles/my-post' : 'https://example.com'}
            fullWidth
            size="small"
          />

          <FormControlLabel
            control={<Switch checked={newTab} onChange={(e) => setNewTab(e.target.checked)} size="small" />}
            label="Open in new tab"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" disabled={!value.trim() || !href.trim()} onClick={() => onConfirm({ value, href, external, newTab })}>
          {initial ? 'Update' : 'Insert'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Inline Editor ────────────────────────────────────────────────────────────
// Renders InlineNode[] as alternating text fields and link chips.

interface InlineEditorProps {
  children: InlineNode[];
  onChange: (children: InlineNode[]) => void;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  minRows?: number;
  error?: string;
}

function InlineEditor({ children, onChange, label, placeholder, multiline = false, minRows = 1, error }: InlineEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  const handleTextChange = (index: number, val: string) => {
    const updated = [...children];
    updated[index] = { type: 'text', value: val };
    onChange(updated);
  };

  const handleDeleteNode = (index: number) => {
    // When deleting a link chip, merge surrounding text nodes if both exist
    const updated = children.filter((_, i) => i !== index);
    // Collapse adjacent text nodes
    const collapsed: InlineNode[] = [];
    for (const node of updated) {
      const last = collapsed[collapsed.length - 1];
      if (last?.type === 'text' && node.type === 'text') {
        collapsed[collapsed.length - 1] = { type: 'text', value: last.value + node.value };
      } else {
        collapsed.push(node);
      }
    }
    onChange(collapsed.length ? collapsed : [{ type: 'text', value: '' }]);
  };

  const handleInsertLink = (link: { value: string; href: string; external: boolean; newTab: boolean }) => {
    if (editingLinkIndex !== null) {
      const updated = [...children];
      updated[editingLinkIndex] = { type: 'link', ...link };
      onChange(updated);
    } else {
      // Append link + trailing empty text node
      onChange([...children, { type: 'link', ...link }, { type: 'text', value: '' }]);
    }
    setLinkDialogOpen(false);
    setEditingLinkIndex(null);
  };

  const editingLink =
    editingLinkIndex !== null && children[editingLinkIndex]?.type === 'link'
      ? (children[editingLinkIndex] as Extract<InlineNode, { type: 'link' }>)
      : undefined;

  return (
    <Box>
      <Stack spacing={1}>
        {children.map((node, i) => {
          if (node.type === 'text') {
            return (
              <TextField
                key={i}
                size="small"
                fullWidth
                multiline={multiline}
                minRows={minRows}
                label={i === 0 ? label : undefined}
                placeholder={i === 0 ? placeholder : 'Continue writing...'}
                value={node.value}
                onChange={(e) => handleTextChange(i, e.target.value)}
              />
            );
          }

          // Link chip
          return (
            <Box key={i}>
              <Chip
                icon={
                  node.external ? <ExternalIcon sx={{ fontSize: '14px !important' }} /> : <LinkIcon sx={{ fontSize: '14px !important' }} />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {node.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      →
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {node.href}
                    </Typography>
                    {node.newTab && (
                      <Typography variant="caption" color="text.disabled">
                        (new tab)
                      </Typography>
                    )}
                    {!node.external && <Chip label="internal" size="small" sx={{ height: 16, fontSize: '0.6rem', ml: 0.5 }} />}
                  </Stack>
                }
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  setEditingLinkIndex(i);
                  setLinkDialogOpen(true);
                }}
                onDelete={() => handleDeleteNode(i)}
                sx={{ maxWidth: '100%', height: 'auto', py: 0.75, borderStyle: 'dashed', cursor: 'pointer' }}
              />
            </Box>
          );
        })}
      </Stack>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      <Button
        size="small"
        startIcon={<LinkIcon />}
        onClick={() => {
          setEditingLinkIndex(null);
          setLinkDialogOpen(true);
        }}
        sx={{ mt: 1, fontSize: '0.72rem' }}
      >
        Insert inline link
      </Button>

      <InlineLinkDialog
        open={linkDialogOpen}
        initial={
          editingLink
            ? {
                value: editingLink.value,
                href: editingLink.href,
                external: editingLink.external ?? false,
                newTab: editingLink.newTab ?? false
              }
            : undefined
        }
        onConfirm={handleInsertLink}
        onClose={() => {
          setLinkDialogOpen(false);
          setEditingLinkIndex(null);
        }}
      />
    </Box>
  );
}

// ─── Block Item ───────────────────────────────────────────────────────────────

interface BlockItemProps {
  block: Block;
  index: number;
  onChange: (index: number, block: Block) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

function BlockItem({ block, index, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: BlockItemProps) {
  const [expanded, setExpanded] = useState(true);
  const {
    formState: { errors }
  } = useFormContext();

  const blockErrors = (errors.content as any)?.[index];
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
            <InlineEditor
              children={block.children}
              onChange={(children) => update({ children })}
              label="Heading Text"
              placeholder="Enter heading text..."
              error={blockErrors?.children?.message}
            />
          </Stack>
        );

      case 'paragraph':
        return (
          <InlineEditor
            children={block.children}
            onChange={(children) => update({ children })}
            label="Paragraph Text"
            placeholder="Write your paragraph here..."
            multiline
            minRows={3}
            error={blockErrors?.children?.message}
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
              size="small"
              value={block.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="Enter the quote..."
              error={!!blockErrors?.text?.message}
            />
            <TextField
              fullWidth
              label="Author (optional)"
              size="small"
              value={block.author || ''}
              onChange={(e) => update({ author: e.target.value })}
              placeholder="Quote attribution..."
            />
          </Stack>
        );

      case 'image':
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Image URL"
              size="small"
              value={block.src}
              onChange={(e) => update({ src: e.target.value })}
              placeholder="https://example.com/image.jpg"
              error={!!blockErrors?.src?.message}
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
              size="small"
              value={block.caption || ''}
              onChange={(e) => update({ caption: e.target.value })}
              placeholder="Image caption..."
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
            {/* Array-level error (e.g. "must have at least one item") */}
            {(blockErrors?.items?.message || blockErrors?.items?.root?.message) && (
              <Typography variant="caption" color="error">
                {blockErrors?.items?.message ?? blockErrors?.items?.root?.message}
              </Typography>
            )}
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
                    placeholder={`Item ${i + 1}`}
                    error={!!blockErrors?.items?.[i]?.message}
                    helperText={blockErrors?.items?.[i]?.message}
                    onChange={(e) => {
                      const items = [...block.items];
                      items[i] = e.target.value;
                      update({ items });
                    }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    disabled={block.items.length === 1}
                    onClick={() => {
                      const items = block.items.filter((_, idx) => idx !== i);
                      update({ items: items.length ? items : [''] });
                    }}
                  >
                    <RemoveItemIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Button
                size="small"
                startIcon={<AddItemIcon />}
                sx={{ alignSelf: 'flex-start' }}
                onClick={() => update({ items: [...block.items, ''] })}
              >
                Add Item
              </Button>
            </Stack>
          </Stack>
        );

      case 'link':
        return (
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Link Label"
              size="small"
              value={block.label}
              onChange={(e) => update({ label: e.target.value })}
              placeholder="e.g. Read our privacy policy"
              error={!!blockErrors?.label?.message}
              helperText={blockErrors?.label?.message}
            />
            <ToggleButtonGroup
              exclusive
              size="small"
              value={block.external ? 'external' : 'internal'}
              onChange={(_, val) => {
                if (val) update({ external: val === 'external' });
              }}
            >
              <ToggleButton value="internal">Internal link</ToggleButton>
              <ToggleButton value="external">External link</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              fullWidth
              size="small"
              label={block.external ? 'URL (e.g. https://example.com)' : 'Path (e.g. /articles/my-post)'}
              value={block.href}
              onChange={(e) => update({ href: e.target.value })}
              placeholder={block.external ? 'https://example.com' : '/articles/my-post'}
              error={!!blockErrors?.href?.message}
              helperText={blockErrors?.href?.message}
            />
            <FormControlLabel
              control={<Switch checked={block.newTab ?? false} size="small" onChange={(e) => update({ newTab: e.target.checked })} />}
              label="Open in new tab"
            />
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
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 2 } }}>
      {/* Header */}
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
        <DragIcon sx={{ color: 'text.disabled', fontSize: 18, flexShrink: 0 }} />
        <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{blockOption.icon}</Box>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {blockOption.label}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1, fontStyle: 'italic' }}>
          {!expanded && blockSummary(block)}
        </Typography>
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

      {/* Body */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>{renderEditor()}</Box>
      </Collapse>
    </Paper>
  );
}

// ─── Add Block Menu ───────────────────────────────────────────────────────────

function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
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
              sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.75rem', px: 1.5, py: 0.5 }}
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
    watch
    // formState: { errors }
  } = useFormContext();
  const blocks: Block[] = watch(name) || [];

  const setBlocks = (updated: Block[]) => setValue(name, updated, { shouldValidate: true, shouldDirty: true });

  const handleAdd = (type: BlockType) => setBlocks([...blocks, createDefaultBlock(type)]);
  const handleChange = (index: number, block: Block) => {
    const u = [...blocks];
    u[index] = block;
    setBlocks(u);
  };
  const handleDelete = (index: number) => setBlocks(blocks.filter((_, i) => i !== index));
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const u = [...blocks];
    [u[index - 1], u[index]] = [u[index], u[index - 1]];
    setBlocks(u);
  };
  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const u = [...blocks];
    [u[index], u[index + 1]] = [u[index + 1], u[index]];
    setBlocks(u);
  };

  // const error = errors[name];

  return (
    <Box>
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

      {/* {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
          Blocks section has error
        </Typography>
      )} */}

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

      <AddBlockMenu onAdd={handleAdd} />
    </Box>
  );
}
