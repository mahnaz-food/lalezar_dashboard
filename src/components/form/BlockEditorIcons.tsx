import {
  Add,
  Trash,
  Menu,
  Text,
  NoteText,
  QuoteUp,
  Image as ImageIconBase,
  TaskSquare,
  Minus,
  ArrowDown2,
  ArrowUp2,
  AddCircle,
  MinusCirlce
} from 'iconsax-react';

// Wrap them to match your existing MUI naming
export const AddIcon = (props: any) => <Add {...props} />;
export const DeleteIcon = (props: any) => <Trash {...props} />;
export const DragIcon = (props: any) => <Menu {...props} />;
export const HeadingIcon = (props: any) => <Text {...props} />;
export const ParagraphIcon = (props: any) => <NoteText {...props} />;
export const QuoteIcon = (props: any) => <QuoteUp {...props} />;
export const ImageIcon = (props: any) => <ImageIconBase {...props} />;
export const ListIcon = (props: any) => <TaskSquare {...props} />;
export const DividerIcon = (props: any) => <Minus {...props} />;
export const ExpandIcon = (props: any) => <ArrowDown2 {...props} />;
export const CollapseIcon = (props: any) => <ArrowUp2 {...props} />;
export const AddItemIcon = (props: any) => <AddCircle {...props} />;
export const RemoveItemIcon = (props: any) => <MinusCirlce {...props} />;
