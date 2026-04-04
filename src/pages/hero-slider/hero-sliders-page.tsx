import { ColumnDef } from '@tanstack/react-table';
import ReactTable from 'components/table/Table';
import { useModal } from 'contexts/ModalContext';
import { FormFieldConfig } from 'components/form/AppFrom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAddHeroSlideMutation,
  useDeleteHeroSlideMutation,
  useGetHeroSlidesQuery,
  useUpdateHeroSlideMutation
} from 'hooks/api/hero-sliders/slidersHooks';
import { HeroSlideFormValues, Slide } from 'types/admin';
import { slideFormSchema } from '../../../validators/hero-sliders-schema';

export const columns: ColumnDef<Slide>[] = [
  {
    accessorKey: 'image',
    header: 'image',
    cell: ({ row }) => {
      return <img src={row.original.image} style={{ width: '60px', height: '40px', borderRadius: '2px' }} alt={row.original.headline} />;
    }
  },
  {
    accessorKey: 'headline',
    header: 'headline'
  }
];

const defaultValues: HeroSlideFormValues = {
  image: '',
  headline: '',
  isActive: true,
  sub: '',
  tag: '',
  buttons: []
};

const fields: FormFieldConfig<HeroSlideFormValues>[] = [
  { name: 'image', label: 'Image', placeholder: 'Enter image URL', type: 'text', md: 12 },
  { name: 'headline', label: 'Headline', placeholder: 'Enter headline', type: 'text', md: 6 }
];

export default function HeroSlidersPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useGetHeroSlidesQuery();
  const { openForm, confirm } = useModal();

  const { mutate: addSlide, isPending: isAdding } = useAddHeroSlideMutation();
  const { mutate: updateSlide, isPending: isUpdating } = useUpdateHeroSlideMutation();
  const { mutate: deleteSlide, isPending: isSingleDeleting } = useDeleteHeroSlideMutation();

  const handleAddClick = () => {
    openForm({
      title: 'Add Hero Slide',
      schema: slideFormSchema,
      defaultValues,
      fields,
      isPending: isAdding,
      onSubmit: (data: HeroSlideFormValues) => {
        addSlide(data, {
          onSuccess: (data: { message: string }) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
          }
        });
      }
    });
  };

  const handleViewRow = (row: Slide) => {
    openForm({
      title: 'Update Hero Slide',
      schema: slideFormSchema,
      defaultValues: { ...defaultValues, image: row.image },
      fields,
      isPending: isUpdating,
      onSubmit: (data: HeroSlideFormValues) => {
        updateSlide(
          { id: row.id, data },
          {
            onSuccess: (data: { message: string }) => {
              toast.success(data.message);
              queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
            }
          }
        );
      }
    });
  };

  const handleDelete = async (id: string) => {
    await confirm({
      title: 'Delete Hero Slide',
      description: 'Are you sure you want to delete this slide?',
      isPending: isSingleDeleting,
      onConfirm: () => {
        deleteSlide(
          { id },
          {
            onSuccess: (data: { message: string }) => {
              toast.success(data.message);
              queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
            }
          }
        );
      }
    });
  };
  return (
    <>
      <ReactTable
        data={data}
        columns={columns}
        tableTitle="Hero Slides"
        onAdd={handleAddClick}
        enableExport
        addButtonLabel="Add Slide"
        isLoading={isLoading}
        onViewRow={(row) => handleViewRow(row)}
        onDeleteRow={(row) => {
          handleDelete(row.id);
        }}
      />
    </>
  );
}
